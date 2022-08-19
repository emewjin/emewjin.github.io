---
title: vsc에서 리액트 컴포넌트 작성을 위한 타이핑을 최소화하기
date: 2022-07-31 16:07:54
lastUpdated: 2022-07-31 16:07:54
description: '더 좋은 방법 알려주실 분 구함'
tags: [React]
---

개인적으로 리액트 컴포넌트를 작성할 때 타이핑을 최소화하기 위해 사용하고 있는 방법들을 소개합니다 🤗  
언제나 이것보다 더 좋은 방법들을 찾아 헤매고 있습니다.

## 1. 스니펫 사용하기

vsc extension 검색창에 'react snippet'으로 검색해보면 여러 extension이 등장하는데, 저는 아래 extension을 사용하고 있습니다.

<img src="https://user-images.githubusercontent.com/76927618/182015397-2a2d6d0f-e1d8-4ad9-a7d8-d7fc9d4c8359.png" alt="스니펫" style="width: 80%;" />

스니펫의 종류를 다 외울 수는 없기 때문에 `커맨드+shift+P` 로 액션을 열고 `Snippet Search`를 입력하거나, `커맨드+shift+R` 로 다음과 같이 스니펫 목록을 열어 필요한 걸 찾아 이용하면 됩니다.

![image](https://user-images.githubusercontent.com/76927618/182015451-24dcb69c-a0d4-473c-984c-38e3e99c040f.png)

주로 사용하는 것은 컴포넌트 보일러 플레이트를 위한 스니펫으로, `rfc` 를 가장 많이 사용합니다.

![screencast 2022-07-31 16-46-44](https://user-images.githubusercontent.com/76927618/182015641-19a133d7-60b1-45e1-a95b-97e6911ddb49.gif)

props의 타입까지 같이 작성해주는 `tsrfc`도 있긴 한데 인터페이스를 더 좋아해서 쓰지 않고 있습니다. 대신 인터페이스 선언은 리팩토링 기능으로 작성하고 있습니다.

물론 extension을 설치하지 않고도 직접 스니펫을 만들어 사용할 수도 있습니다.

<img style="width: 80%;" alt="유저스니펫" src="https://user-images.githubusercontent.com/76927618/182016547-3755cd4b-a22d-47a5-b7fd-503741e447f0.png">

## 2. 리팩토링 기능 사용하기

시작하기 전에 : 모든 리팩토링의 단축키는 `커맨드 + .` 또는 `컨트롤 + 커맨드 + R`입니다.

### 2-1. 인터페이스 추출하기

컴포넌트 prop의 타입 인터페이스는 일단 그냥 작성하고, vsc의 리팩토링 기능인 `Extract to interface`로 추출하고 있습니다.

![screencast 2022-07-31 16-50-32](https://user-images.githubusercontent.com/76927618/182015730-ef2c562f-444c-4f6d-b7c4-7831710047aa.gif)

### 2-2. 컴포넌트 추출하기

가끔 컴포넌트의 일부분을 별도의 컴포넌트로 분리해야할 때가 있는데요.  
기본적으로 vsc 리팩토링에서 함수나 변수로 추출하는 기능을 제공하고 있지만, 다음의 예제처럼 리팩토링의 결과가 1% 부족하다는 약간의 불편함이 있습니다.

```tsx
// 리팩토링 전
export default function MyApp({ name }: MyAppProps) {
  return <div>MyApp</div>;
}

// 리팩토링 후
export default function MyApp({ name }: MyAppProps) {
  return Test();
}
function Test() {
  return <div>MyApp</div>;
}
```

`Vscode react refactor` 라는 extension을 쓰면 그 약간의 불편함을 해소할 수 있습니다.

![image](https://user-images.githubusercontent.com/76927618/182015992-3a957acc-11fa-4aa6-8df0-443d402655e4.png)

![screencast 2022-07-31 16-58-37](https://user-images.githubusercontent.com/76927618/182015978-83d4ae31-d19f-43af-a3a9-16c5eaf17988.gif)

만약 분리한 컴포넌트를 새 파일로 만들고 싶다면 기본으로 제공하는 리팩토링 기능인 `move to a new file`을 이용하면 됩니다.

![screencast 2022-07-31 17-01-52](https://user-images.githubusercontent.com/76927618/182016050-650186cb-98ef-40d6-9619-d8b01fde1831.gif)

## 3. Auto all missing import 이용하기

컴포넌트를 작성할 때 제일 많이 하는 일 중에 하나가 `import`일 것입니다.  
이 귀찮은 작업을 쉽고 빠르게 대신해주기 위해 대부분의 IDE에는 missing import를 한 번에 다 해주는 기능이 있습니다.  

VSC의 경우에도 import 되지 않은 모듈은 에러 표시가 뜨는데, 거기서 `커맨드 + .` 리팩토링 단축키로 `Add all missing import`를 선택하면 모든 모듈에 대해 import 문이 작성됩니다.

<img width="340" alt="image" src="https://user-images.githubusercontent.com/76927618/185619466-600734a9-f18f-45b4-a88e-a36577d5a1ed.png">

여기서 문제는 type 정의에 대해서도 그냥 `import`로 그친다는 것입니다. 아무런 ts 에러도 발생하지 않구요.  
만약 팀에서 type only import를 strict하게 가져간다면, 습관적으로 하는 `Add all missing import`는 type only import까지는 신경써주지 않아 여러모로 번거로움을 느끼게 될 것입니다.

`Add all missing import`이 type only import까지 신경써 줄 수 있게 하려면, tsconfig에 다음 설정을 추가하면 됩니다.

```json
"importsNotUsedAsValues": "error",
```
위 설정(플래그)은 다음 세 가지 중 하나를 선택할 수 있는데, 저는 `"error"`를 이용했습니다.

- **remove**: this is today’s behavior of dropping these imports. It’s going to continue to be the default, and is a non-breaking change.
- **preserve**: this preserves all imports whose values are never used. This can cause imports/side-effects to be preserved.
- **error**: this preserves all imports (the same as the preserve option), but will error when a value import is only used as a type. This might be useful if you want to ensure no values are being accidentally imported, but still make side-effect imports explicit.

이 설정을 추가하면 두 가지를 기대할 수 있습니다.

1. type이지만 type only import가 아닌 경우 타입 에러 발생
    ![image](https://user-images.githubusercontent.com/76927618/185620308-1a95b98c-ebfc-47aa-bdca-acf34517552b.png)


2. `Add all missing import`시 type이면 type only import로 적용됩니다. 이걸로 개발자가 신경써야 하는 영역이 줄어들 수 있습니다.
   ![screencast 2022-08-19 21-43-17](https://user-images.githubusercontent.com/76927618/185621332-59dc3bb6-98c7-4654-8145-58a64d4030c8.gif)


조금 더 행복하게 코딩할 수 있어졌습니다.  
위의 설정에 대한 내용은 [Typescript 깃허브 issue](https://github.com/microsoft/TypeScript/pull/36412#issuecomment-707221008)에서 찾았습니다.