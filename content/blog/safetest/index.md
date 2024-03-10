---
title: (번역) 프런트엔드 테스트에 대한 새로운 접근 방식 SafeTest를 소개합니다
description: 최근 넷플릭스에서 새로운 프런트엔드 테스트 도구 SafeTest를 공개했습니다. 넷플릭스가 기존의 테스트 방법 및 도구에서 어떤 불편함을 겪었고 SafeTest가 이를 어떻게 해결해 주는지 소개합니다.
date: 2024-03-10
lastUpdated: 2024-03-10
tags: [번역]
---

> 이 글은 원래 [원문](https://netflixtechblog.com/introducing-safetest-a-novel-approach-to-front-end-testing-37f9f88c152d)에 게시된 넷플릭스 기술 블로그 글을 번역한 것입니다. 넷플릭스가 아닌 [emewjin](https://emewjin.github.io/)이 번역했으며 원본 저작권은 Netflix, Inc에 있습니다.

by [Moshe Kolodny](https://medium.com/u/a155da075195?source=post_page-----37f9f88c152d--------------------------------)

이번 글에서 웹 기반 사용자 인터페이스(UI) 애플리케이션의 엔드투엔드(E2E) 테스트에 대한 새로운 관점을 제공하는 혁신적인 라이브러리인 SafeTest를 소개하게 되어 기쁩니다.

## 기존 UI 테스트의 문제점

전통적으로 UI 테스트는 단위 테스트 또는 통합 테스트(엔드투엔드(E2E) 테스트라고도 합니다)를 통해 수행되었습니다. 그러나 이러한 각 방법에는 테스트 픽스처와 설정을 제어하거나 테스트 드라이버를 제어하는 방법 중 하나를 선택해야 하는 특유의 장단점이 있습니다.

예를 들어 단위 테스트 솔루션인 [react-testing-library](https://testing-library.com/docs/react-testing-library/intro/)를 사용하면 렌더링할 대상과 기본 서비스 및 import의 동작 방식을 완벽하게 제어할 수 있습니다. 하지만 실제 페이지와 상호 작용할 수 없게 되므로 다음과 같은 수많은 문제점이 발생할 수 있습니다.

- `<Dropdown />` 컴포넌트 같이 복잡한 UI 요소와 상호 작용하기 어려움.
- CORS 설정 또는 GraphQL 호출을 테스트할 수 없음.
- 버튼의 클릭 기능에 영향을 미치는 z-index 문제를 파악하기 어려움.
- 테스트 작성 및 디버깅이 복잡하고 직관적이지 않음.

반면에 Cypress나 Playwright와 같은 통합 테스팅 도구를 사용하면 페이지를 제어할 수 있지만 앱의 부트스트랩 코드를 도구로 접근하기 어렵다는 점을 감수해야 합니다. 이러한 도구들은 브라우저를 원격으로 제어하여 URL을 방문하고 페이지와 상호 작용하는 방식으로 작동합니다. 이 접근 방식은 다음과 같은 고유한 문제가 있습니다.

- 사용자 정의 네트워크 레이어 API 재작성 규칙을 구현하지 않으면 대체 API 엔드포인트를 호출하기 어렵습니다.
- 스파이/모의 객체에 대한 어설션(assertion)을 수행하거나 앱 내에서 코드를 실행할 수 없습니다.
- 다크 모드 같은 기능을 테스트하려면 테마 전환 스위치를 클릭하거나 오버라이드할 로컬스토리지 메커니즘을 알아야합니다.
- 앱의 일부를 테스트할 수 없습니다. 예를 들어 버튼을 클릭하고 60초 타이머를 기다려야만 특정 컴포넌트가 표시되는 경우, 테스트는 이러한 작업을 수행해야 하며 적어도 1분 이상 소요됩니다.

이러한 문제점을 인식하여 [Cypress](https://docs.cypress.io/guides/component-testing/overview)와 [Playwright](https://playwright.dev/docs/test-components)와 같은 E2E 컴포넌트 테스트 솔루션이 등장했습니다. 이 도구들은 기존의 통합 테스트 방법의 단점을 해결하려 하지만, 그들의 아키텍처로 인해 다른 한계가 발생합니다. 이 도구들은 부트스트랩 코드를 사용해 개발 서버를 실행하여 원하는 컴포넌트나 설정 코드를 불러옵니다. 이 때문에 OAuth나 복잡한 빌드 파이프라인이 있을 수 있는 복잡한 엔터프라이즈 애플리케이션을 처리하는 데 한계가 있습니다. 또한 타입스크립트를 업데이트하면 Cypress/Playwright 팀이 그들의 러너를 업데이트하기 전까지 테스트가 실패할 수 있습니다.

## SafeTest 사용을 환영합니다

SafeTest는 UI 테스트에 대한 새로운 접근 방식으로 이러한 문제들을 해결하고자 합니다. 주요 아이디어는 [애플리케이션 부트스트래핑 단계에서 테스트를 실행하기 위한 훅을 삽입하는 코드 스니펫을 만드는 것입니다](https://www.npmjs.com/package/safetest#bootstrapping-your-application)(자세한 내용은 [SafeTest 작동 방식](https://www.npmjs.com/package/safetest#how-safetest-works) 섹션을 참조하세요). **이 작동 방식이 앱의 정상적인 사용에 실제로 영향을 미치지 않음에 주목하세요. SafeTest는 테스트를 실행할 때만 지연 로딩을 활용하여 테스트를 동적으로 로드하기 때문입니다(README 예제에서 테스트는 프로덕션 번들에 전혀 포함되지 않습니다).** 일단 설정이 완료되면 Playwright를 사용하여 일반적인 테스트를 실행할 수 있으므로 테스트에 대해서 원했던 만큼 이상적으로 브라우저를 제어할 수 있습니다.

또한 이 접근 방법은 다음과 같이 몇 가지 흥미로운 기능도 제공합니다.

- 노드 테스트 서버를 실행할 필요 없이 특정 테스트에 딥 링킹(Deep Linking)됩니다.
- 브라우저와 테스트(노드) 컨텍스트 간에 양방향으로 통신할 수 있습니다.
- Playwright에서 제공하는 모든 DX 기능에 접근할 수 있습니다(단, @playwright/test와 함께 제공되는 것은 제외).
- 테스트를 비디오로 녹화하거나, 트레이스를 표시하거나, 다양한 페이지 선택자/액션을 시도하기 위해 페이지를 일시 정지할 수 있습니다.
- 브라우저 내 호출의 스냅샷과 일치하는 노드에서 브라우저의 스파이에 대한 어설션을 수행할 수 있습니다.

## SafeTest로 작성한 테스트 예제

SafeTest는 기존 솔루션들의 장점을 활용하기 때문에 이전에 UI 테스트를 해본 적이 있는 사용자라면 누구나 친숙하게 느낄 수 있도록 설계되었습니다. 다음은 전체 애플리케이션을 테스트하는 방법의 예시입니다.

```js
import { describe, it, expect } from 'safetest/jest';
import { render } from 'safetest/react';

describe('my app', () => {
  it('loads the main page', async () => {
    const { page } = await render();

    await expect(page.getByText('Welcome to the app')).toBeVisible();
    expect(await page.screenshot()).toMatchImageSnapshot();
  });
});
```

특정 컴포넌트를 테스트하는 것도 매우 간단하게 할 수 있습니다.

```js
import { describe, it, expect, browserMock } from 'safetest/jest';
import { render } from 'safetest/react';

describe('Header component', () => {
  it('has a normal mode', async () => {
    const { page } = await render(<Header />);

    await expect(page.getByText('Admin')).not.toBeVisible();
  });

  it('has an admin mode', async () => {
    const { page } = await render(<Header admin={true} />);

    await expect(page.getByText('Admin')).toBeVisible();
  });

  it('calls the logout handler when signing out', async () => {
    const spy = browserMock.fn();
    const { page } = await render(<Header handleLogout={spy} />);

    await page.getByText('logout').click();
    expect(await spy).toHaveBeenCalledWith();
  });
});
```

## 오버라이드 활용하기

SafeTest는 테스트 도중에 값을 오버라이드할 수 있도록 리액트 컨텍스트를 활용합니다. 이것이 어떻게 작동하는지를 설명하기 위해 컴포넌트에서 fetchPeople 함수가 사용된다고 가정해 보겠습니다.

```tsx
import { useAsync } from 'react-use';
import { fetchPerson } from './api/person';

export const People: React.FC = () => {
  const { data: people, loading, error } = useAsync(fetchPeople);

  if (loading) return <Loader />;
  if (error) return <ErrorPage error={error} />;
  return <Table data={data} rows=[...] />;
}
```

오버라이드를 통해 People 컴포넌트를 수정할 수 있습니다.

```tsx
 import { fetchPerson } from './api/person';
// highlight-start
+import { createOverride } from 'safetest/react';
// highlight-end

// highlight-start
+const FetchPerson = createOverride(fetchPerson);
// highlight-end

 export const People: React.FC = () => {
// highlight-start
+  const fetchPeople = FetchPerson.useValue();
// highlight-end
   const { data: people, loading, error } = useAsync(fetchPeople);

   if (loading) return <Loader />;
   if (error) return <ErrorPage error={error} />;
   return <Table data={data} rows=[...] />;
 }
```

이제 이 테스트에서 이 호출에 대한 응답을 오버라이드할 수 있습니다.

```ts
const pending = new Promise(r => { /* 아무것도 하지 않음 */ });
const resolved = [{name: 'Foo', age: 23], {name: 'Bar', age: 32]}];
const error = new Error('Whoops');

describe('People', () => {
  it('has a loading state', async () => {
    const { page } = await render(
      <FetchPerson.Override with={() => () => pending}>
        <People />
      </FetchPerson.Override>
    );

    await expect(page.getByText('Loading')).toBeVisible();
  });

  it('has a loaded state', async () => {
    const { page } = await render(
      <FetchPerson.Override with={() => async () => resolved}>
        <People />
      </FetchPerson.Override>
    );

    await expect(page.getByText('User: Foo, name: 23')).toBeVisible();
  });

  it('has an error state', async () => {
    const { page } = await render(
      <FetchPerson.Override with={() => async () => { throw error }}>
        <People />
      </FetchPerson.Override>
    );

    await expect(page.getByText('Error getting users: "Whoops"')).toBeVisible();
  });
});
```

렌더링 함수는 초기 앱 컴포넌트로 전달될 함수도 받을 수 있으므로 앱의 어느 곳에나 원하는 요소를 삽입할 수 있습니다.

```tsx
it('has a people loaded state', async () => {
  const { page } = await render((app) => (
    <FetchPerson.Override with={() => async () => resolved}>
      {app}
    </FetchPerson.Override>
  ));
  await expect(page.getByText('User: Foo, name: 23')).toBeVisible();
});
```

오버라이드 기능를 통해 복잡한 테스트 케이스를 작성할 수 있습니다. 예를 들면 `/foo`, `/bar`, `/baz`에서의 API 요청을 결합하는 서비스 메서드가 실패한 API 요청에 대해서만 적절한 재시도 메커니즘을 가지고 있고 반환 값을 올바르게 매핑하는지 확인하는 테스트를 작성할 수 있습니다. 따라서 `/bar` 요청을 3번 시도하면, 메서드는 총 5번의 API 호출을 하게 됩니다.

API 호출만 오버라이드할 수 있는 것은 아닙니다([`page.route`](https://playwright.dev/docs/api/class-page#page-route)도 사용할 수 있으므로). 기능 플래그나 일부 정적 값 변경과 같은 특정 앱 수준의 값도 오버라이드할 수 있습니다.

```ts
// highlight-start
+const UseFlags = createOverride(useFlags);
// highlight-end
 export const Admin = () => {
// highlight-start
+  const useFlags = UseFlags.useValue();
// highlight-end
   const { isAdmin } = useFlags();
   if (!isAdmin) return <div>Permission error</div>;
   // ...
 }

// highlight-start
+const Language = createOverride(navigator.language);
// highlight-end
 export const LanguageChanger = () => {
// highlight-start
-  const language = navigator.language;
+  const language = Language.useValue();
// highlight-end
   return <div>Current language is { language } </div>;
 }

 describe('Admin', () => {
   it('works with admin flag', async () => {
     const { page } = await render(
       <UseIsAdmin.Override with={oldHook => {
         const oldFlags = oldHook();
         return { ...oldFlags, isAdmin: true };
       }}>
         <MyComponent />
       </UseIsAdmin.Override>
     );

     await expect(page.getByText('Permission error')).not.toBeVisible();
   });
 });

 describe('Language', () => {
   it('displays', async () => {
     const { page } = await render(
       <Language.Override with={old => 'abc'}>
         <MyComponent />
       </Language.Override>
     );

     await expect(page.getByText('Current language is abc')).toBeVisible();
   });
 });
```

오버라이드는 SafeTest의 강력한 기능 중 하나이며 여기에 있는 예제는 겉핥기에 불과합니다. 더 많은 정보와 예제는 [README](https://github.com/kolodny/safetest/blob/main/README.md)의 [오버라이드 섹션](https://www.npmjs.com/package/safetest#overrides)을 참조하세요.

## 리포팅

SafeTest는 기본적으로 강력한 리포팅 기능을 제공합니다. 이는 비디오 리플레이 자동 연결, Playwright 트레이스 뷰어, 그리고 [마운트된 테스트 대상 컴포넌트에 직접 딥 링크](https://safetest-two.vercel.app/vite-react-ts/?test_path=.%2FAnother.safetest&test_name=Main2+can+do+many+interactions+fast)하는 기능을 포함합니다. SafeTest 레포지토리 [README](https://github.com/kolodny/safetest/blob/main/README.md)는 모든 [예제 앱](https://safetest-two.vercel.app/)과 [보고서](https://safetest-two.vercel.app/report.html#results=vite-react-ts/artifacts/results.json&url=vite-react-ts/)에 대한 링크를 제공합니다.

![image](https://github.com/emewjin/emewjin.github.io/assets/76927618/805eef0b-b310-4cc8-97b7-8a27690002fc)

## 기업 환경에서의 SafeTest

많은 대기업에서는 앱을 사용하기 위해 일종의 인증이 필요합니다. 일반적으로 localhost:3000으로 이동하면 무한 로딩 페이지가 표시됩니다. 기본 서비스 호출에 대한 프록시 서버가 있는 localhost:8000과 같은 다른 포트로 이동하여 인증 자격 증명을 확인하거나 주입해야 합니다. 이러한 제한은 Cypress나 Playwright의 컴포넌트 테스트가 넷플릭스에서 사용하기에 적합하지 않았던 주요 이유 중 하나입니다.

그러나 일반적으로 로그인하고 애플리케이션과 상호 작용하는 데 사용할 수 있는 자격 증명을 가진 테스트 사용자를 생성할 수 있는 서비스가 있습니다. 이는 테스트 사용자를 자동으로 생성하고 가정할 수 있도록 SafeTest 주변에 가벼운 래퍼를 만드는 데 도움이 됩니다. 예를 들어, 넷플릭스에서는 주로 다음과 같이 작성합니다.

```ts
import { setup } from 'safetest/setup';
import { createTestUser, addCookies } from 'netflix-test-helper';

type Setup = Parameters<typeof setup>[0] & {
  extraUserOptions?: UserOptions;
};

export const setupNetflix = (options: Setup) => {
  setup({
    ...options,
    hooks: { beforeNavigate: [async (page) => addCookies(page)] },
  });

  beforeAll(async () => {
    createTestUser(options.extraUserOptions);
  });
};
```

이렇게 설정한 뒤 위의 패키지를 safetest/setup을 사용했던 위치에 import만 하면 됩니다.

## 리액트 그 너머

이 글에서는 SafeTest가 리액트와 어떻게 작동하는지에 초점을 맞추었지만, 이 기능은 리액트에만 국한되지는 않습니다. SafeTest는 뷰, 스벨트, 앵귤러에서도 작동하며, 심지어 NextJS나 갯츠비에서도 실행할 수 있습니다. 또한, 초기 설정에 따라 사용된 Jest 또는 Vitest 같은 테스트 러너 중 하나를 기반으로 실행됩니다. [예제 폴더](https://github.com/kolodny/safetest/tree/main/examples)에서는 다양한 도구 조합으로 SafeTest를 사용하는 방법을 보여주며, 더 많은 사례를 추가할 수 있도록 기여를 권장합니다.

SafeTest의 핵심은 테스트 러너, UI 라이브러리, 브라우저 러너를 지능적으로 통합하는 것입니다. 넷플릭스에서 가장 일반적으로 사용되는 것은 리액트/Jest/Playwright이지만, 다른 옵션을 위한 어댑터를 쉽게 추가할 수 있습니다.

## 결론

SafeTest는 넷플릭스 내에서 채택되고 있는 강력한 테스트 프레임워크입니다. 테스트를 쉽게 작성할 수 있으며, 어떤 실패가 언제 발생했는지에 대한 포괄적인 보고서를 제공합니다. 보고서에는 기록된 동영상을 보거나 테스트 단계를 수동으로 실행하여 무엇이 실패했는지 확인할 수 있는 링크가 포함되어 있습니다. UI 테스트에 어떤 혁신을 가져올지 기대가 되며 여러분의 피드백과 기여를 기다리겠습니다.
