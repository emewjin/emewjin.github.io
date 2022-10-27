---
title: React children을 수정해야 할 때
description: children 중 특정 컴포넌트만 수정하기
date: 2022-08-19
lastUpdated: 2022-08-19
tags: [Typescript, React]
---

## 요구사항

디자인 시스템 구축 작업 중에 마주한 문제이다.  
Button 컴포넌트의 경우, children으로 들어오는 Icon 컴포넌트의 size는 Button 컴포넌트의 size보다 한 단계 아래로 적용하게 해야한다.

## 해결방법

`React.Children` API를 이용한다.

children 배열을 map으로 순회하면서 children이 Icon 컴포넌트인지 아닌지를 판별 후, Icon이라면 prop을 편집하고, 아니라면 그대로 반환한다.

### 문제 1. 어떻게 React children이 특정 컴포넌트인지 알 수 있을 것인가?

children을 콘솔에 찍어보면

![image](https://user-images.githubusercontent.com/76927618/185615841-6822e220-baa3-48dd-a3f3-175b3f4ee13f.png)

이런 객체가 찍히는데 private임을 의미하는 \_ 를 제외하고 살펴보면 뭔가 건질만한 부분은 props와 type이다.  
Icon 컴포넌트라면 무조건 props에 icon이 undefined일 수 없으므로, 이를 이용해도 되겠으나 좀 더 명시적으로 이용할 수 있는 부분은 type이다.

![image](https://user-images.githubusercontent.com/76927618/185615864-a90a41a8-7a97-48da-919e-952e37f09daf.png)

기본적으로 name이 있지만, 빌드시 난독화가 되기 때문에 사용할 수 없다.  
그래서 난독화 되지 않는 displayName을 사용해야 한다. 이 displayName으로 Icon 인지 아닌지로 판별하면 되겠다.

```tsx
function Icon() {}
Icon.displayName = 'Icon';
```

displayName은 [공식 문서](https://reactjs.org/docs/react-component.html#displayname)에서 Class Properties 하위에 설명이 작성되어 있어서 Function component에서는 해당이 안되는 내용인지 좀 헷갈리는데 어쨌든 설명을 읽어보면 다음과 같다.

> The displayName string is used in debugging messages. Usually, you don’t need to set it explicitly because it’s inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see Wrap the Display Name for Easy Debugging for details.

요약하면 디버깅을 쉽게 하기 위해 디버깅 메세지에 어떤 컴포넌트인지 정확하게 표시해주는 역할을 한다.  
단, 굳이 명시해줄 필요는 없는데 함수 또는 클래스에서 알아서 name을 뽑아내기 때문이다. 만약 다른 이름을 표시하고 싶다면 displayName으로 명시하면 된다고 함.

즉 빌드된 앱에서 리액트 데브 툴로 컴포넌트 트리를 보면, displayName을 지정해주지 않은 컴포넌트들은 함수 컴포넌트의 name을 이용하기 때문에 난독화된 문자열이 보여 이게 어떤 컴포넌트인지 구분하기 어렵다.  
반면 displayName을 지정해준 컴포넌트들은 문자열이 유지되어 어떤 컴포넌트인지 알아차리기 쉽다.

![image-20221027-065615](https://user-images.githubusercontent.com/76927618/198322864-d5ad2aea-8d70-42e6-b49a-e3b2a78ba94e.png)

```tsx
import { isValidElement, ReactElement } from 'react';

import { IconProps } from '../Icon/Icon';

export const isIconComponent = (
  child: Parameters<typeof isValidElement>[number]
): child is ReactElement<IconProps> =>
  isValidElement(child) &&
  typeof child.type === 'function' &&
  child.type.displayName === 'Icon';
```

이걸로 특정 children이 Icon 컴포넌트인지 아닌지를 판별할 수 있다.  
다음은 이 특정한 컴포넌트에 원하는 prop을 넘겨주어야 하는데, 이를 위해 `cloneElement` API를 이용한다.

`cloneElement`의 첫 번째 인자로 클론 대상을 넘겨주고, 두 번째 인자로 원하는 prop object를 넘겨주면 넘겨준 prop은 클론 대상이 원래 가지는 prop과 shallow로 병합된다.

> Clone and return a new React element using element as the starting point. config should contain all new props, key, or ref. **The resulting element will have the original element’s props with the new props merged in shallowly.** New children will replace existing children. key and ref from the original element will be preserved if no key and ref present in the config.
>
> 리액트 공식문서

이를 이용하면 최종적으로 코드를 다음과 같이 완성할 수 있다.  
아래의 코드는 많이 간소화된 버전이다 😉.

```tsx
const _Button = (props: ButtonProps) => {
  const { children, size = 'md', ...restProps } = props;

  return (
    <button size={size} {...restProps}>
      {Children.map(children, (child) => {
        if (isIconComponent(child)) {
          return cloneElement(child, {
            size: ICON_SIZE[size],
          });
        }

        return child;
      })}
    </button>
  );
};
```
