---
title: (번역) 대규모 SPA에서 유연하게 네트워크 데이터 미리 로딩하기
description: 페이지 로드 시 네트워크 데이터를 미리 로딩하여 SPA 렌더링 성능을 개선하는 방법을 코드를 통해 설명하며 원글 저자의 경험을 나누어주는 글을 소개해드립니다.
date: 2024-08-15
lastUpdated: 2024-08-15
tags: [React]
---

> 원문 : [Flexible network data preloading in large SPAs](https://mmazzarolo.com/blog/2024-07-29-data-preloading-script/)

> **주의**: 이 글은 클라이언트 사이드에서 렌더링하는 SPA의 성능을 개선하기 위한 맞춤형 솔루션에 중점을 둡니다. Next.js, Remix와 같은 프레임워크를 사용 중이라면, 이러한 최적화는 자동으로 처리되는 경우가 많습니다 :)

제 경험상으로 클라이언트 사이드 렌더링을 구현할 때 중요한 최적화 중 하나는 페이지 로드 시 네트워크 데이터를 미리 로딩하는 것입니다. 제가 근무했던 세 회사에서 경험한 바로는, 대규모 SPA는 일반적으로 페이지 로드 시 일련의 네트워크 요청이 필요합니다. 예를 들어, 사용자 인증 데이터나 환경 구성요소 등을 로드하기 위해서 말이죠.

리액트 애플리케이션을 처음 작성할 때 이러한 네트워크 요청은 보통 리액트 앱이 마운트된 후에 시작됩니다. 이 접근 방식은 효과가 있긴 하지만, 애플리케이션이 확장됨에 따라 비효율적일 수 있습니다. 앱 번들이 다운로드, 파싱되고 리액트 앱이 로드될 때까지 기다려서 네트워크 요청을 시작할 필요가 있을까요? 이런 과정과 네트워크 요청을 병렬로 실행할 수도 있는데 말이죠.

### 네트워크 요청 미리 로딩하기

최신 브라우저는 이와 같은 특정 상황을 처리하기 위해 [`link rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) 및 [리소스 힌트](https://web.dev/learn/performance/resource-hints?hl=ko) 같은 도구를 제공합니다. 이러한 도구는 필요한 네트워크 요청을 최대한 빨리 시작하는 데 사용됩니다. 그러나 이는 주로 단순하고 하드코딩된 요청에만 한정됩니다. 보다 복잡한 시나리오에서는 기존 프레임워크 솔루션에 의존하거나 직접 구현해야 할 수도 있습니다.

맞춤형 솔루션을 구축해야만 할 경우, 제가 선호하는 방법은 HTML 문서의 헤드에 작은 자바스크립트 스크립트를 삽입하여 네트워크 요청을 즉시 시작하는 것입니다. 브라우저 힌트와 달리, 이 스크립트는 개발자가 완전히 제어할 수 있어 조건부 요청, 요청 워터폴, 웹소켓 연결 처리 등의 복잡한 동작을 구현할 수 있습니다.

### 기본 구현

예를 들어, 사용자 데이터를 로드하기 위해 필요한 네트워크 요청을 미리 로딩하는 간단한 예제는 다음과 같습니다.

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <script>
      // 고수준에서 미리 로딩하는 것이 어떻게 보이는지 보여주기 위해 간소화되었습니다.
      window.__userDataPromise = (async function () {
        const user = await (await fetch('/api/user')).json();
        const userPreferences = await (
          await fetch(`/api/user-preferences/${user.id}`)
        ).json();
        return { user, userPreferences };
      })();
    </script>
  </head>
  <body>
    <script src="/my-app.js"></script>
  </body>
</html>
```

```js
// my-app.js

// 역시나 매우 단순한 접근 방식입니다. 실제 애플리케이션에서는 리액트 쿼리와 같은 유틸리티를 사용해 프로미스를 처리하는 것이 좋습니다.
function MyApp() {
  const [userData, setUserData] = useState();

  async function loadUserData() {
    setUserData(await window.__userDataPromise);
  }

  useEffect(() => {
    loadUserData();
  }, []);
}
```

이 방법은 간단한 사용 사례에서는 효과적이지만, 애플리케이션이 커지면 번거로워질 수 있습니다. 예를 들어, 대부분의 경우 미리 로드하려는 플로우는 앱 실행 중에 다시 호출하게 될 플로우일 가능성이 높습니다. 위 예제의 경우, 사용자가 다시 로그인하거나 계정을 변경한 후 사용자 및 구성 데이터를 다시 가져오고 싶을 수 있습니다.

### 보다 "확장 가능한" 미리 로딩 패턴

이를 해결하기 위해, 제가 가장 많이 사용하는 패턴은 앱 내의 모든 함수를 "미리 로딩 가능"하게 만드는 것입니다. 기본적인 단계는 다음과 같습니다.

1. SPA 코드에서 미리 로딩할 함수를 정의합니다.
2. 해당 함수를 withPreload API로 감싸고 내보냅니다.
3. 프리 로딩 스크립트에서 함수를 불러와 실행합니다.
4. 런타임에, 함수는 실행 전에 미리 로딩된 결과를 확인합니다.

### 구현

이 패턴을 구현하는 간단한 코드 예제는 다음과 같습니다.

```typescript
// my-app/data-preloader.ts

/**
 * `DataPreloader`는 데이터를 가능한 빨리 미리 로딩하고 필요할 때 사용할 수 있는 유틸리티입니다.
 * 예를 들어, 사용자 정보나 설정을 앱 렌더링 *전에* 미리 로딩하여 UI 렌더링을 기다릴 필요 없이 데이터를 가져와 워터폴 효과를 피할 수 있습니다.
 *
 * `withPreload` 함수는 미리 로딩할 데이터를 위한 함수를 감싸는 고차 함수입니다.
 * 호출 시 미리 로딩된 프로미스를 반환하거나, 없으면 원래 함수를 호출합니다.
 * 반환된 함수는 데이터를 미리 로딩할 수 있는 `preload` 메서드도 가집니다.
 *
 * 이를 통해 코드의 한 부분에서 데이터를 미리 로딩하고, 다른 부분에서 사용할 수 있습니다.
 * 데이터가 미리 로딩된 경우 프로미스를 반환하고, 그렇지 않으면 원래 함수를 호출합니다.
 */
type PreloadEntry<T> = {
  id: string;
  promise: Promise<T>;
  status: 'pending' | 'resolved' | 'rejected';
  result?: T;
  error?: unknown;
};

class DataPreloader {
  private entries: Map<string, PreloadEntry<unknown>>;

  constructor() {
    // 이것이 SPA 코드에서 호출되면, 미리 로딩하는 스크립트에서 생성된 프로미스로 다시 수화합니다.
    if (window.__dataPreloader_entries) {
      this.entries = window.__dataPreloader_entries;
      // 이것이 프리로드 스크립트인 경우, window 객체에 프로미스를 노출합니다.
    } else {
      this.entries = new Map();
      window.__dataPreloader_entries = this.entries;
    }
  }

  // 프로미스를 시작하고 이를 전역 목록에 저장된 프로미스로 관리합니다.
  preload<T>(id: string, func: () => Promise<T>): Promise<T> {
    const entry: PreloadEntry<T> = {
      id,
      promise: func(), // 이것이 프리로딩을 시작하는 것입니다.
      status: 'pending',
    };
    // 이는 주로 프로미스 상태를 기다리지 않고 확인하려는 경우를 위해 추가된 것입니다.
    entry.promise
      .then((result) => {
        entry.status = 'resolved';
        entry.result = result;
      })
      .catch((error) => {
        entry.status = 'rejected';
        entry.error = error;
      });
    this.entries.set(id, entry);
    return entry.promise;
  }

  // 특정 프로미스에 대해 미리 로딩된 데이터가 있으면 결과를 반환하고 목록에서 프로미스를 삭제합니다. (오래된 데이터를 반환하지 않았음을 보장하기 위해서)
  // 여기서 개선할 수 있는 점은 최근에 미리 로딩된 경우에만 프로미스를 사용하는 방법입니다. -- 역시, 신선하지 않은 데이터를 피하기 위함입니다.
  consumePreloadedPromise<T>(id: string) {
    const preloadEntry = this.entries.get(id);
    if (preloadEntry) {
      this.entries.delete(id);
      return preloadEntry.promise as Promise<T>;
    }
  }
}

// 싱글톤으로 내보냅니다.
const dataPreloader = new DataPreloader();

// 여기서 또 다른 개선점은 함수에 매개변수를 전달할 수 있게 하는 것입니다.
// 이를 위해 매개변수를 문자열로 직렬화하고 키로 사용하여, 이를테면 다른 매개변수로 실행된 프리 로딩과 혼동되지 않도록 할 수 있습니다.
export const withPreload = <T>(id: string, func: () => Promise<T>) => {
  const preloadableFunc = () => {
    const promise = dataPreloader.consumePreloadedPromise<T>(id);
    if (promise) {
      return promise;
    } else {
      return func();
    }
  };
  // 함수에 "preload" 메서드를 노출하여 미리 로딩을 시작할 수 있도록 합니다.
  preloadableFunc.preload = () => dataPreloader.preload(id, func);
  return preloadableFunc;
};
```

```ts
// my-app/load-user-data.ts
import { fetchUser, fetchUserPreferences } from './api';
import { getUserAuthToken } from './auth';
import { withPreload } from './data-preloader';

type UserData =
  | {
      isLoggedIn: false;
    }
  | { isLoggedIn: true; user: User; userPreferences: UserPreferences };

const _loadUserData = async () => {
  const userAuthToken = await getUserAuthToken();

  if (!userAuthToken) {
    return { isLoggedIn: false };
  }

  const user = await fetchUser();

  const userPreferences = await fetchUserPreferences();

  return { isLoggedIn: true, user, userPreferences };
};

// 위 함수를 미리 로딩 가능하게 만들려면 `withPreload`로 감싸고, SPA에서 고유한 ID를 할당하세요.
const LOAD_USER_DATA_PRELOAD_ID = 'loadUserData';
export const loadUserData = withPreload(
  LOAD_USER_DATA_PRELOAD_ID,
  _loadUserData
);
```

```ts
// my-app/app.tsx

// 앱의 어느 부분에서든 `loadUserData`를 그대로 사용하면, 데이터가 미리 로딩되었는지 아닌지 걱정할 필요가 없습니다.
const userData = await loadUserData();
```

```ts
// my-app/preload-script-entry-point.ts

/**
 * 이 파일은 데이터 프리로더의 진입점입니다.
 * SPA의 나머지 부분과는 별도의 스크립트로 주입되어 가능한 빨리 데이터를 미리 로딩할 수 있습니다.
 * 보통 웹팩과 같은 번들러를 사용해 이 파일을 별도로 분리하는 것이 좋습니다.
 */
import { loadUserData } from './load-user-data';

(async function run() {
  await loadUserData.preload();
})();
```

여기서는 `withPreload`를 사용하여 사용자 데이터를 미리 로딩하고 있습니다. 하지만, 이 패턴을 확장하여 다른 정보를 미리 로딩할 수도 있습니다. 미리 로딩하고 싶은 함수를 `withPreload`로 감싸고, 미리 로딩 스크립트에서 시작하기만 하면 됩니다. 또한, URL, 쿠키, 로컬 스토리지 등을 기반으로 미리 로딩 여부를 결정하는 로직을 추가할 수 있습니다.

### 장점과 고려 사항

앞서 언급했듯이 이것은 이 패턴의 작동 방식을 보여주는 간단한 예시이며, 프리로딩 만료 로직 추가, withPreload의 매개변수 매칭 지원 등 다양한 개선 방법이 있습니다. 일반적으로 이 패턴은 저의 사용 사례에서 효과적이었지만, 모든 상황에 맞는 해결책은 아닙니다. 프리로딩 스크립트에 과도하게 의존성을 추가하지 않도록 주의하세요. 그렇지 않으면 스크립트가 너무 커져서 다운로드 및 파싱이 비효율적일 수 있습니다.

이 패턴을 자신의 스타일과 사용 사례에 맞게 더 발전시켜 보세요 :)

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
