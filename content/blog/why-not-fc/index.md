---
title: 리액트에서 FC를 사용하지 말아야 하는 이유
date: 2022-07-31
lastUpdated: 2022-08-09
description: '무지성 FC 사용에서 벗어나기'
tags: [Typescript, React]
---

> ⚠️ 리액트 17 이하 버전에서 유효한 내용입니다.

개인적으로 타입스크립트로 리액트 컴포넌트를 작성할 때 가장 많이 사용하는 방법은 다음과 같습니다.

```tsx
interface MyComponentProps {}

const MyComponent: FC<MyComponentProps> = () => {
  return <div>hi</div>;
};
```

이렇게 표현식과 `FC` 조합으로 컴포넌트를 작성하는 데에 별 다른 이유가 있었던 것은 아닙니다.  
그냥 익숙해졌고, 별다른 불편함이 없으니 쓰던대로 계속 썼다가 맞습니다.  
나름대로는 `FC` 에 `children`이 포함되어 있으니 편리하다고 느끼기도 했습니다.

그러다 최근 리액트 컴포넌트의 표현식과 선언식은 단순히 취향차이일까? 하는 생각에서 시작해 알아보다가 그동안 무지성으로 `FC`를 사용한 것을 반성하게 되었습니다.

> 리액트 컴포넌트의 표현식 vs 선언식에서 갑자기 `FC`로 주제가 튄 이유는 선언식은 `FC`를 사용하지 못하기 때문입니다. (`FC`는 말 그대로 함수에 대한 타입 정의이기 때문에 선언식에선 사용할 수 없습니다) `FC`를 사용하지 못하는게 큰 단점일까?를 생각하다가 여기까지 오게 되었죠.

## FC를 쓰지 말아야 하는 이유

React Typescript에서 `FC`는 비기너라면 몰라도, 그다지 좋은 방법(best practice)이 아닙니다.  
가장 큰 이유는 props에 children이 암시적으로 들어가 있기 때문이라고 생각합니다.  
CRA에서는 기본 템플릿에 `FC`를 빼야한다는 PR(https://github.com/facebook/create-react-app/pull/8177) 이 올라왔었고, 반영되었습니다.

지금부터 작성할 내용은 위 PR에서 주장한 내용들을 번역(의역)한 것입니다.

> 대부분이 함수 컴포넌트를 사용하는 요즘에 적합하지 않은 이유(defaultProps)는 제외했습니다

### 1. children을 암시적으로 가지고 있습니다.

`FC`를 이용하면 컴포넌트 props는 type이 `ReactNode`인 `children`을 **암시적으로** 가지게 됩니다.  
이는 꼭 타입스크립트에 한정하지 않더라도 안티패턴입니다.

```tsx
const App: React.FC = () => {
  return <div>hi</div>;
};

const Example = () => {
  <App>
    <div>Unwanted children</div>
  </App>;
};
```

위 코드를 보면 `<App/>` 컴포넌트에서 **`children`을 다루고 있지 않음에도** `Example`에서 `children`을 넘겨주고 있으며, 어떤 런타임 에러도 발생하지 않습니다.

이런 실수는 `FC`를 사용하지 않는다면 잡아낼 수 있습니다.

> 물론 FC를 사용한다면 자주 사용하는 children의 타입을 하나하나 작성해주지 않아도 된다는 편리함이 있습니다. FC를 사용하지 않는다면 구체적으로 타입을 작성해주어야 하겠죠. 귀찮긴 하지만 타입스크립트의 사용 목적을 생각해보면 따르지 않을 이유가 없습니다.

### 2. 제네릭을 지원하지 않습니다.

가끔 다음과 같은 제네릭 컴포넌트를 작성할 수 있습니다.

```ts
type GenericComponentProps<T> = {
  prop: T;
  callback: (t: T) => void;
};

const GenericComponent = <T>(props: GenericComponentProps<T>) => {
  /*...*/
};
```

그러나 이런 형태는 `FC`에서 허용되지 않습니다. 왜냐하면 `T`를 넘겨줄 방법이 없기 때문입니다.

```tsx
const GenericComponent: React.FC</* ??? */> = <T>(props: GenericComponentProps<T>) => {/*...*/}
```

### 3. 네임 스페이스 패턴을 이용할 때 더 불편합니다.

다음과 같이 연관성 있는 컴포넌트에 대해 네임 스페이스 패턴을 적용하는 것은 매우 많이 쓰이는 방법입니다.

```tsx
<Select>
  <Select.Item />
</Select>
```

`FC`를 쓰고도 이 패턴을 적용할 수 있긴 하지만, **많이 불편해집니다.**

```tsx
// FC를 사용할 때
const Select: React.FC<SelectProps> & { Item: React.FC<ItemProps> } = (
  props
) => {
  /* ... */
};
Select.Item = (props) => {
  /*...*/
};

// FC를 사용하지 않을 때
const Select = (props: SelectProps) => {
  /* ... */
};
Select.Item = (props: ItemProps) => {
  /*...*/
};
```

### 4. FC를 이용하면 코드가 더 길어집니다.

큰 단점은 아니지만, 어쨌든 그렇습니다.

```tsx
const C1: React.FC<CProps> = (props) => {};
const C2 = (props: CProps) => {};
```

## 결국 리액트 18 이상에서 없어졌습니다.

> 친절하신 댓글 제보로 내용을 추가합니다.

리액트 18 업데이트로, FC의 암시적인 children이 삭제되었습니다. 해당 변경 사항은 [이 PR](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210)에서 확인할 수 있습니다.

아직 리액트 17을 쓰고 있지만 라이브러리 몇 가지만 업데이트 되면 18로 업데이트할 예정이라, 지금부터 틈틈이 FC의 암시적인 children을 사용하는 코드들을 정리해야겠습니다. 🤧

## 참고문서

- [Why you probably shouldn’t use React.FC to type your React components](https://medium.com/raccoons-group/why-you-probably-shouldnt-use-react-fc-to-type-your-react-components-37ca1243dd13)
- [Remove React.FC from Typescript template](https://github.com/facebook/create-react-app/pull/8177)
- [TypeScript + React: Why I don't use React.FC](https://fettblog.eu/typescript-react-why-i-dont-use-react-fc/)
