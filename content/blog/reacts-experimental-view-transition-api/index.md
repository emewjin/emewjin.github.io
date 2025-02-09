---
title: (번역) 리액트의 실험적인 애니메이션 API 공개
description:
date: 2025-02-09
lastUpdated: 2025-02-09
tags: [React, 번역]
---

> 원문: [Revealed: React's experimental animations API](https://motion.dev/blog/reacts-experimental-view-transition-api)

12년(!) 전 처음 출시된 이래로 리액트의 API에는 눈에 띄는 애니메이션 공백이 존재했습니다.

그동안 뷰와 스벨트 같은 가장 가까운 경쟁사들은 광범위하진 않지만 애니메이션을 조금 더 쉽게 만들어주는 API를 도입했습니다. 반면에 리액트 개발자는 [Motion for React](https://motion.dev/docs/react-quick-start), [React Spring](https://react-spring.dev/) 등과 같은 써드파티 라이브러리에 의존해야 했습니다.

그러나 이제 상황이 달라졌습니다.

리액트가 드디어 첫 번째 애니메이션 API를 도입합니다. 천사들이 노래하고, 하늘이 갈라지고, 긴 어둠의 틈새로 작가 [Seb Markbåge](https://bsky.app/profile/sebmarkbage.calyptus.eu)가 세상에 새로운 `<ViewTransition />`을 선사합니다. (덧붙여서 이 새로운 API에 대한 많은 질문에 답해주신 Seb에게 감사드립니다.)

`<ViewTransition />`는 그 이름에서 알 수 있듯이 브라우저의 강력한 새로운 [뷰 트랜지션 API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) 기능을 기반으로 하고 있습니다.

흥미롭게도, 이미 리액트의 사전 릴리즈 채널에서 사용할 수 있습니다. 따라서 이번 글에서는 오늘날 리액트와 Next.js에서 `<ViewTransition />`을 사용하는 방법을 설명하고, 복사 붙여넣기 가능한 실시간 예제를 통해 그 기능을 탐구해보겠습니다.

또한, 이러한 예제들을 마음껏 살펴볼 수 있는 [마이크로사이트](https://react-view-transition-examples.motion.dev/)도 함께 제공됩니다.

하지만 제가 너무 앞서갔네요. 우선, 뷰 트랜지션이란 무엇일까요? 그리고 왜 이 기능이 리액트 팀으로 하여금 첫 애니메이션 API를 도입하게 만들었을까요?

## 뷰 트랜지션 101

뷰 트랜지션 API는 개발자들이 두 뷰 간의 애니메이션을 구현할 수 있도록 하는 새로운 브라우저 기능입니다.

이 API는 매우 강력해서 이전에는 애니메이션이 불가능하던 값, 예를 들어 `justify-content`를 `flex-start`에서 `flex-end`로 전환하는 것 같은 동작도 가능합니다.

[라이브 데모 Sandbox](https://examples.motion.dev/js/view-animation?utm_source=embed)

또는 두 개의 완전히 별개인 요소를 마치 하나인 것처럼 애니메이션 처리하는 것도 가능합니다.

[라이브 데모 Sandbox](https://examples.motion.dev/js/lightbox?utm_source=embed)

여러모로 앞선 기술이긴 하지만, 뷰 트랜지션은 몇 가지 단점도 존재합니다. 요약하자면, 본질적으로 중단할 수 없고, 가상 요소의 CSS API는 불편하며, 스크롤 위치의 변화에 애니메이션이 적용되고, 독립적으로 애니메이션이 적용되는 모든 요소에 고유한 `view-transition-name`을 할당해야 합니다. 이는 관리가 번거롭고 오류가 발생하기 쉬워 구성을 불필요하게 어렵게 만듭니다.

이런 문제를 해결하기 위해 최근에 새로운 [`view()` 함수](https://motion.dev/docs/view)의 알파 버전을 출시했으며, 이는 [Motion+](https://motion.dev/plus) 초기 액세스에서 사용 가능합니다.

따라서 여러분은 vanilla JS 사용자들을 위해 이러한 문제를 해결할 수 있다면, 다음 단계로 `view()`를 리액트 래퍼로 옮기는 것은 쉬운 일이라고 생각할 수 있습니다.

하지만 안타깝게도, 리액트와 통합할 때 `view()`는 뷰 트랜지션 API와 동일한 근본적인 한계를 공유합니다.

1. 상태를 설정하기 전에 뷰 트랜지션을 시작해야 합니다.
2. 상태 업데이트를 리액트의 `flushSync`로 감싸야 합니다.
   ```
   view(() => {
     flushSync(() => setState(yourNewState))
   })
   ```

이는 성능이 좋지 않은 방법입니다.

뷰 트랜지션은 본질적으로 요소 자체가 아닌 요소의 **스크린샷**을 포함하는 가상 요소를 애니메이션 처리합니다. 이 과정에는 장단점이 있지만, 결과적으로 페이지의 일부 또는 전체가 시각적으로 정지되고, 애니메이션이 끝날 때까지 정적이고 인터랙티브하지 않은 상태로 유지됩니다.

따라서 뷰 트랜지션을 시작하기에 가장 적합한 시점은 DOM을 변경하기 직전입니다. 상태 업데이트를 설정하기 전이 아니고, 그 상태 업데이트가 렌더에 이르고, 커밋으로 이어지기 전도 아닙니다.

더 나쁜 것은, 리액트에서 `flushSync`는 새 상태가 렌더링될 때까지 메인 스레드를 차단하기 때문에 이 상태 업데이트를 수행하는 가장 성능이 낮은 방법입니다. 모든 메인 스레드 애니메이션과 상호작용을 정지시키고, bail-outs이나 취소를 방지합니다.

이것이 바로 `<ViewTransition />`이 중요한 이유입니다. 이는 리액트 렌더 사이클에 깊숙이 연결되어 있어 가능한 한 늦게 뷰 트랜지션을 트리거할 수 있습니다. 그동안 페이지는 시각적으로 정지되지 않습니다.

또한, 비동기 업데이트(`startTransition`이나 `<Suspense />` 같은)**에서만** 작동하기 때문에, 상태 업데이트는 애니메이션이 시작되기 전에 중단되거나 취소될 수 있습니다. 결과적으로 UI는 더욱 반응성이 높아집니다.

와우, 완벽하게 들리죠? 사실상 뷰 트랜지션 API 자체의 본질적인 한계를 제외하면 거의 완벽합니다. 이제 왜 좋은지 이유를 알았으니, 자세히 살펴보겠습니다.

## 시작하기

먼저 주의하세요! `<ViewTransition />`은 실험적인 API입니다. 예고 없이 언제든지 변경될 수 있습니다 (아마도 변경될 것입니다). 이러한 초기 릴리스의 목적은 API의 버그와 허점을 찾는 데 있습니다. 따라서 재미로 사용해보는 것은 좋지만, 당장 이 API로 프로덕션 코드를 작성하는 것은 권장하지 않습니다.

즉, 가장 빠르게 시작하는 방법은 이미 리액트가 실험적 채널로 설정된 [이 CodeSandbox를](https://codesandbox.io/p/sandbox/react-viewtransition-component-cxh98w?file=%2Fsrc%2FApp.js%3A10%2C1-13%2C1) 포크하는 것입니다.

또한, 여러분의 프로젝트에 이렇게 `react`와 `react-dom`을 설치할 수도 있습니다.

```
npm install react@experimental react-dom@experimental
```

Next.js 사용자라면, 최소 버전이 `15.2.0-canary.6`인 `canary` 버전을 설치해야 합니다. 그 후, `next.config.js` 파일에 다음을 추가하세요.

```ts
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
};
```

마지막으로, 불안정한 API인 `ViewTransition`은 `unstable_ViewTransition`으로 내보내집니다. 따라서 다음과 같이 가져올 수 있습니다.

```tsx
import { unstable_ViewTransition as ViewTransition } from 'react';
```

## 기본 사용법

`<ViewTransition />`이 컴포넌트를 감싸면, 첫 번째 DOM 자식에게 자동으로 `view-transition-name`이 할당됩니다.

예를 들어, 이 토글은 `.handle` 요소를 `ViewTransition`으로 감싸서 만들어졌습니다.

```tsx
<button style={{ justifyContent: isOn ? 'flex-end' : 'flex-start' }}>
  <ViewTransition>
    <div className='handle' />
  </ViewTransition>
</button>
```

[라이브 데모 Sandbox](https://react-view-transition-examples.motion.dev/react/view-transition)

중요한 점은, `isOn` 상태 업데이트는 `startTransition`으로 감싸야 한다는 것입니다. 그렇지 않으면 애니메이션이 작동하지 않습니다.

```tsx
const toggleOn = startTransition(() => setIsOn(!isOn));
```

이 방법의 큰 장점은 `view-transition-name`이 자동으로 생성될 뿐만 아니라 **자동으로 적용된다는** 것입니다.

이게 무슨 의미일까요? 뷰 트랜지션 API에서는 요소에 `view-transition-name`을 설정하고 그저 잊어버릴 수 없습니다. 추가적인 작업 없이 뷰 트랜지션 "타입"으로 알려진 것을 관리하지 않으면, 모든 `view-transition-name`이 있는 요소들이 모든 단일 뷰 트랜지션에 포함됩니다.

즉, 단순한 접근 방식으로는 이러한 스위치 중 하나를 클릭하면 실제로는 하나만 눈에 띄는 경우에도 다음과 같이 여섯 개의 애니메이션이 실행될 수 있습니다.

[라이브 데모 Sandbox](https://react-view-transition-examples.motion.dev/react/sibling-view-transitions)

그러나 인스펙터를 보면, 이러한 스위치에 대해 단 하나의 애니메이션만 생성되었다는 것을 확인할 수 있습니다.

![](./view-transtion.avif)

`view-transition-name` 스타일이 애니메이션 직전에 적용되고, 애니메이션 직후에 제거되기 때문입니다. 이는 성능 향상과 미세한 상호작용의 분리에 모두 이점이 있습니다. `name` 생성과 적용 사이에서는 이미 뷰 트랜지션 API의 주요 문제점 두 가지를 해결했습니다.

`<ViewTransition />`은 시각적 변화를 감지하는 데 매우 강력합니다. 여기에서는 단순히 `img`의 URL을 변경하기만 하면 이 컴포넌트는 이미지가 한 이미지에서 다음 이미지로 올바르게 전환되도록 합니다.

[라이브 데모 Sandbox](https://react-view-transition-examples.motion.dev/react/crossfade)

## 자식 전환하기

`view-transition-name` 적용의 강력한 면모 중 하나는 요소가 동일할 때만 작동하는 것이 아니라는 점입니다. 두 개의 완전히 다른 요소를 단순히 교체함으로써 교차 페이드할 수 있습니다.

```tsx
<ViewTransition>{state ? <MenuA /> : <MenuB />}</ViewTransition>
```

[라이브 데모 Sandbox](https://react-view-transition-examples.motion.dev/react/switch-menu)

이것은 `<Suspense />` 컴포넌트와도 함께 작동하므로, 대체 UI(fallback)에서 준비된 콘텐츠로 애니메이션을 적용할 수 있습니다.

```tsx
<ViewTransition>
  <Suspense fallback={<Skeleton />}>
    <Content />
  </Suspense>
</ViewTransition>
```

안타깝게도 이 설정의 모의 버전을 작동시키는 데 성공하지 못했습니다. 성공할 경우 이 글을 업데이트하겠습니다.

## 공유 요소 애니메이션

이전 예제에서 밑줄 애니메이션도 보셨나요? 이는 상태에 따라 `<ViewTransition />`을 각 버튼에 조건부로 렌더링하여 수행됩니다. 두 버튼은 일치하는 `name` 프로퍼티를 수동으로 제공하여 연결합니다.

```tsx
{
  isSelected && (
    <ViewTransition name='underline'>
      <Underline />
    </ViewTransition>
  );
}
```

`<ViewTransition />`이 한 위치에서 제거되고 다른 곳에 생성되면, 두 요소는 공유 요소가 됩니다.

이 기능에는 Motion의 `view()` 함수에 그대로 모방하고 싶은 아주 기발한 특징이 있습니다. 이렇게 두 요소가 연결되어 있을 때, 만약 그 중 하나가 화면(뷰포트) 밖에 있다면, 단순한 페이드 애니메이션이 사용됩니다. 이렇게 하면 사용자에게 불필요한 요소가 화면 곳곳을 날아다니는 것을 방지할 수 있습니다.

이를 보여주기 위해 "Toggle box position"을 눌러 레이아웃 애니메이션을 확인한 다음, "Toggle container size"를 눌러 하단 상자를 화면 밖으로 이동시키고 다시 박스 위치를 토글해 보세요.

[라이브 데모 Sandbox](https://react-view-transition-examples.motion.dev/react/viewport-detection)

## 애니메이션 커스터마이징

지금까지 여러 애니메이션을 만들었지만, 실제로 가속도(easing), 지속 시간(duration), 지연(delay)을 커스터마이즈하진 않았습니다.

`name`을 수동으로 설정하고 뷰 트랜지션 API의 다소 복잡한 가상 선택자를 사용하여 CSS를 사용할 수 있습니다.

```tsx
<>
  <ViewTransition name='photo' />
  <style>{`
    ::view-transition-group(photo),
    ::view-transition-new(photo),
    ::view-transition-old(photo) {
      animation-duration: 1s;
    }
  `}</style>
</>
```

[라이브 데모 Sandbox](https://react-view-transition-examples.motion.dev/react/customise-css)

하지만 컴포넌트의 편리한 이벤트 핸들러를 사용하는 것이 더욱 유용할 것입니다. 다음은 다섯 가지가 있습니다.

- `onEnter`/`onLeave`: 이 컴포넌트가 DOM에 들어오거나 나가며, 동일한 `name`을 공유하는 다른 요소가 없습니다.
- `onLayout`: 외부 컴포넌트로 인해 이 컴포넌트의 경계가 변경되었습니다.
- `onUpdate`: 이 컴포넌트의 내용 또는 경계가 자체 또는 자식 컴포넌트로 인해 변경되었습니다.
- `onShare`: 이 컴포넌트가 공유 요소 전환을 수행하고 있습니다.

각 이벤트 콜백은 애니메이션에서 사용된 각 가상 요소의 참조를 포함하는 `ViewTransitionInstance`를 제공합니다. 이 참조는 미리 바인딩된 Web Animations API 함수를 포함하고 있으며, 이를 사용하여 완전히 사용자 정의된 애니메이션을 만들 수 있습니다.

따라서 이미지를 교환하는 예제에서 이제 `direction`을 사용하여 이미지를 왼쪽이나 오른쪽으로 동적으로 애니메이션할 수 있습니다.

```tsx
function onUpdate(instance: ViewTransitionInstance) {
  const offset = 100 * direction;

  instance.old.animate(
    {
      clipPath: ['none', `translateX(${-offset}px)`],
    },
    { duration: 300, fill: 'both', easing: 'ease-in' }
  );

  instance.new.animate(
    {
      transform: [`translateX(${offset}px)`, 'none'],
    },
    { duration: 400, delay: 200, fill: 'both', easing: 'ease-out' }
  );
}
```

[라이브 데모 Sandbox](https://react-view-transition-examples.motion.dev/react/customise-waapi)

우리는 전형적인 `opacity`/`transform` 애니메이션에 국한되지 않습니다. 여기서는 `clipPath` 애니메이션을 사용하여 마스크를 애니메이션화하고 있습니다.

[라이브 데모 Sandbox](https://react-view-transition-examples.motion.dev/react/customise-mask)

## Motion은 어디로 가는가?

이것이 바로 `<ViewTransition />`입니다. 이것은 확실히 리액트 애니메이션에 많은 새로운 기능을 제공하고, 뷰 트랜지션 API를 원형 형태보다 훨씬 쉽게 사용할 수 있게 해줄 것입니다.

그러나 뷰 트랜지션 API의 단점 일부를 해결할 뿐입니다. 뷰 트랜지션 자체는 모든 웹 애니메이션에 대한 만능 해결책이 아닙니다. 이는 "단지" 새롭고 놀라운 도구일 뿐이며, CSS 전환, 스크롤 애니메이션 등 다른 놀라운 도구들과 함께 사용할 수 있는 것입니다.

그러나 Motion for React에는 뷰 트랜지션과 매우 밀접하게 연관된 벤 다이어그램의 겹치는 공간에 위치한 하나의 API가 있는데, 바로 [레이아웃 애니메이션](https://motion.dev/docs/react-layout-animations)입니다.

레이아웃 애니메이션은 불가능한 것을 애니메이션화하는 비슷한 작업을 수행하지만 변형과 스케일 왜곡 보정 계산을 사용합니다. 마이크로 인터랙션의 경우 부분적으로는 스크롤 오프셋을 고려하고 상대적으로/중첩된 애니메이션을 처리하기 때문에 여전히 선호되지만, **대부분 중단할 수 있기** 때문입니다.

```tsx
<motion.div layout />
```

[라이브 데모 Sandbox](https://examples.motion.dev/react/layout-animation?utm_source=embed)

명백한 단점은 약 33kb 크기의 `motion` 비용이 발생한다는 것입니다. 따라서 의심할 여지 없이 더 작은 번들 크기로 동일한 기능을 많이 수행하는 대안이 있다는 것은 좋은 소식입니다.

더 흥미로운 것은 Motion에서 `<ViewTransition />` 컴포넌트를 생각하고 있다는 것이며, 이는 모든 개발자가 뷰 트랜지션을 더 쉽게 접근할 수 있게 만들 수 있는 방법입니다. 아마도 JS 이징 함수와 스프링을 허용하고 다른 Motion과 마찬가지로 합리적인 기본값을 포함하는 선언적 API가 될 것입니다.

```tsx
<AnimateView share={{ type: 'spring', bounce: 0.3 }} />
```

뷰 트랜지션 시작 직전에 실행될 수 있는 `onRead` 같은 이벤트 몇 가지가 더 있다면, `<ViewTransition />`에 대한 `view()`의 예정된 개선 사항 중 일부, 특히 스크롤 위치의 변경을 취소하는 기능을 추가할 수 있을 것입니다.

그러나 아마도 `<ViewTransition />`이 안정화될 때까지 기다려야 할 것입니다.

그때까지 리액트의 새로운 애니메이션 API에 대한 여러분의 의견을 [알려주시고](https://twitter.com/mattgperry), 이를 이용해 무엇을 만드시는지 알려주세요!
