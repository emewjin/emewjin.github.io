---
title: 타입스크립트 - 팬텀 타입이란 무엇인가
description: 하스켈과 같은 언어에서는 팬텀 타입이라는 것이 있는데, 이게 무엇이고 타입스크립트에서는 어떻게 구현할 수 있는지 알아보자
date: 2023-02-10
lastUpdated: 2023-02-10
tags: [Typescript]
---

어느덧 타입스크립트를 사용한지 1년이 넘어가면서 단순히 자동완성에 우와 하던 때를 지나 좀 더 안전한 코드를 위해 타입스크립트의 활용을 고민하게 되었다.  
최근에도 시간 값을 안전하게 다루기 위한 고민을 하고 있었는데, [같이 일하는 분](https://wiki.lucashan.space/)께서 **팬텀 타입**이라는 새로운 개념을 알려주셨다.

## 발단

모든 프론트엔드 개발자를 대변할 수는 없지만 적어도 우리 팀원들의 의견을 물어보았을 때, 그리고 우리가 사용하는 라이브러리를 확인했을 때 시간 값의 기본 단위를 ms로 생각하는 것이 여러모로 적절했다.  
하지만 회사에서 백엔드 개발자와 api 명세를 논의하다보면 여러가지의 이유로 프론트엔드에 전달되는 시간 값들의 단위가 하나로 통일되지 않을 때가 있다. api 응답값으로부터 얻는 시간 값은 그 단위가 분이기도 하고, 초이기도 하고, ms일 때도 있기 때문에 여러가지 문제가 발생했다.

- 서로 단위가 다른 상태에서 계산
- 이 값이 무슨 단위인지 알 수 없음
- 작업하는 프론트엔드 개발자의 심리적 불안함

이를 해결하기 위해 백엔드에서 무슨 값을 넘겨주든 프론트엔드에서는 우선 ms로 변환하여 사용하기로 합의했다.  
이에 따라 ms로 변환시켜주는 DTO가 필요했고, 코드에서 jsdoc과 같은 주석없이도 ms단위임을 드러내줄 수 있는 방법도 필요했다.  
타입스크립트를 활용하고 있으니 가장 바람직한 방법은 타입을 강하게 사용하여 컴파일 단계에서 잡는 것일테다.

## 팬텀 타입이란?

그래서 만나게 된 **팬텀 타입 (Phantom Type)** 이란 유령 타입이라고도 불리는데, 타입스크립트에서 정식으로 존재하는 스펙은 아닌듯 하다.  
구글링해보면 하스켈, rust, swift등 다른 언어에 존재한다. 그중에서도 대표적으로 하스켈 위키를 보자.

> "A phantom type is a parametrised type whose parameters do not all appear on the right-hand side of its definition..."
>
> [Haskell Wiki, PhantomType](https://wiki.haskell.org/Phantom_type)

모든 타입 매개변수가 타입 정의의 **왼쪽에만** 존재하는 것을 팬텀 타입이라고 부른다고 한다.  
이렇게만 읽었을 때는 뭔소린지 모르겠었는데 팀원이 작성하신 아티클과 구글링을 통해 발견한 글을 보고, **"값은 그대로이지만 특정 타입으로 변화시키는 것"** 이라고 조금이나마 이해할 수 있었다.

- [잊기 전에 정리한 유령 타입](https://wiki.lucashan.space/programming/phantom-type/)
- [Notes on TypeScript: Phantom Types](https://dev.to/busypeoples/notes-on-typescript-phantom-types-kg9)

이 포스트에서는 팀원들에게 보여주려고 두 번째 영문 아티클을 의역했던 내용을 담으려고 한다.

## Notes on TypeScript: Phantom Types

> 이 글은 19년에 작성된 [Notes on TypeScript: Phantom Types](https://dev.to/busypeoples/notes-on-typescript-phantom-types-kg9)를 의역한 문서로 이해를 돕기 위한 글 순서 변경, 코드 예제 변경 등 원문과 다른 점이 있습니다. 잘못 번역된 부분이 있다면 편하게 알려주세요! 🤗
>
> 글의 저자는 팬텀 타입을 더 잘 이해하기 위해, 팬텀 타입이 어떻게 쓰일 수 있는지를 설명하기 위해 간단한 타입스크립트 예제와 함께 이 글을 작성했습니다.

### 소개

이 노트는 TypeScript를 더 잘 이해하는 데 도움이 될 것이며, 특정 상황에서 TypeScript를 활용하는 방법을 찾아야 할 때 유용할 수 있습니다. 모든 예제는 TypeScript 3.2를 기반으로 합니다.

### 팬텀 타입

팬텀 타입을 더 잘 이해하기 위해, 팬텀 타입을 사용하면 어떤 경우에 유용할 수 있는지 보여주는 예제를 길게 작성하겠습니다.

> "A phantom type is a parametrised type whose parameters do not all appear on the right-hand side of its definition..."
>
> [Haskell Wiki, PhantomType](https://wiki.haskell.org/Phantom_type)

위의 하스켈 위키 정의를 살펴보면 팬텀 타입은 모든 파라미터가 정의의 오른쪽에 나타나지 않는 파라미터화된 타입이라는 것을 알 수 있습니다. 비슷한 예제를 타입스크립트로 구현할 수 있는지 살펴봅시다.

```ts
type FormData<A> = string;
```

`FormData`는 A 매개변수가 왼쪽에만 표시되므로 팬텀 타입입니다.

다음으로 우리가 지금 라이브러리를 만들고 있고, 라이브러리 유저가 `FormData` 타입의 값을 만들 수 있게 해보겠습니다.  
이때 원하는 것은 라이브러리의 특정 부분에서 (예를 들면 라이브러리가 제공하는 함수의 인자) 타입을 제한하는 것입니다.  
예를들어, Validated 폼 데이터와 Unvalidated 폼 데이터를 구분하고 싶은 상황이라고 생각해봅시다.

> 역: 최종적으로 구현할 내용을 먼저 보았을 때 글이 더 잘 이해가 되었습니다. 라이브러리의 `makeFormData`함수를 통해 생성된 값만을 다른 함수에서 쓸 수 있게 하고싶은 상황입니다.

```ts
import { makeFormData, validate, upperCase, process } from './phantomTypes';

const initialData = makeFormData('test'); // Unvalidated
const validatedData = validate(initialData); // Validated

// validate("hello") // Type '"hello"' is not assignable to type '{value: never}'
// validate({value: "hello"}) // Type 'string' is not assignable to type 'never'

if (validatedData !== null) {
  // validate(validatedData); // Error! Type '"Validated"' is not assignable to Type '"Unvalidated"'
  upperCase(initialData);
  // upperCase(validatedData) // Error! Type '"Validated"' is not assignable to Type '"Unvalidated"'
  process(validatedData);
  // process(initialData); // Error! Type '"Unvalidated"' is not assignable to Type '"Validated"'
}
```

이런 동작을 구현하기 위해, 우선 Validated 와 Unvalidated 두 가지 타입을 만드는 것에서 시작합시다.

```ts
type Unvalidated = {\_type: "Unvalidated"};
type Validated = {\_type: "Validated"};
```

다음으로 라이브러리 유저들이 `value`의 타입 정의를 오버라이딩 할 수 없도록 `FormData` 타입을 구현합시다. 이를 위해 `value`를 `never`로 정의합니다.

```ts
type FormData<T, D = never> = { value: never } & T;
```

이제 라이브러리에서 제공하는 함수들의 타입을 먼저 만들 것입니다. string을 매개변수로 받고, unvalidated `FormData` 를 리턴하는 함수 `makeFormData`의 타입을 선언할 것입니다.

```ts
type makeFormData = (a: string) => FormData<Unvalidated>;
```

unvalidated `FormData` 를 받아 똑같이 unvalidated `FormData`를 리턴하는 `upperCase`함수의 타입도 작성합니다.

```ts
type upperCase = (a: FormData<Unvalidated>) => FormData<Unvalidated>;
```

다음으로 unvalidated `FormData`를 받아 validated input 또는 null을 리턴하는 `validate`함수 타입을 작성합니다.

```ts
type Validate = (a: FormData<Unvalidated>) => FormData<Validated> | null;
```

마지막으로 validated data를 처리하는 `process`함수 타입을 작성합니다.

```ts
type Process = (a: FormData<Validated>) => FormData<Validated>;
```

이렇게 라이브러리에서 제공할 helper function들에 대한 타입 정의가 끝났습니다. 이제 이 타입 정의를 따라, 실제 form의 값이 항상 개발자로부터 숨겨지도록 구현하는 방법을 살펴보겠습니다.

```ts
type FormData<T, D = never> = { value: never } & T;
type makeFormData = (a: string) => FormData<Unvalidated>;

export const makeFormData: MakeFormData = (value) => {
  return { value } as FormData<Unvalidated>;
};
```

makeFormData 함수가 문자열을 받아들이고 FormData<Unvalidated>를 반환한다는 점을 상기하면, 이 유형을 생성하는 유일한 방법은 이것뿐이라는 점에 유의해야 합니다. 이 유형은 절대 유형으로 정의되어 있기 때문에 개발자가 값을 정의할 수 없습니다.
이 유형이 생성되면 개발자는 반환된 값을 사용하여 값의 유효성을 검사하거나 대문자를 사용할 수 있습니다.

`makeFormData`함수를 통해 문자열을 받아 `FormData<Unvalidated>` 를 리턴하는 것은 곧 `FormData<Unvalidated>` 타입의 값을 만드는 유일한 방법입니다.

> 역: `FormData<Unvalidated>` 타입을 input으로 요구하는 함수는 모두 `makeFormData`를 통해 생성한 값만을 사용해야 한다.

value에 대한 타입을 `never`로 정의해두었기 때문에, 라이브러리의 유저는 value의 타입을 재정의할 수 없습니다.
일단 이 타입이 생성되고나면, 개발자들은 리턴된 값을 `upperCase` 함수나 `validate` 함수에서 사용할 수 있습니다.

> 역: `FormData<Unvalidated>`를 매개변수로 받을 수 있게 구현된 함수는 둘 뿐이기 때문

`upperCase`함수와 `validate`함수의 내부 구현을 살펴봅시다.

```ts
type upperCase = (a: FormData<Unvalidated>) => FormData<Unvalidated>;
export const upperCase: UpperCase = (data) => {
  const internalData = data as InternalUnvalidated;
  return { value: internalData.value.toUpperCase() } as FormData<Unvalidated>;
};

type Validate = (a: FormData<Unvalidated>) => FormData<Validated> | null;
export const validate: Validate = (data) => {
  const internalData = data as InternalUnvalidated;
  if (internalData.value.length > 3) {
    return { value: internalData.value } as FormData<Validated>;
  }
  return null;
};
```

한 가지 중요한 부분을 찾을 수 있을 것인데, 바로 인자로 받은 값을 내부적으로 캐스팅해야 한다는 점입니다. 그런데 `InternalUnvalidated`는 무엇일까요?

```ts
type InternalUnvalidated = Unvalidated & {
  value: string;
};

type InternalValidated = Validated & {
  value: string;
};
```

이 코드에서 우리가 한 일은 라이브러리를 사용하는 개발자에게는 숨겨진 데이터의 내부 표현을 정의하는 것입니다. 우리는 이 케이스에서 값이 문자열이라고 가정할 것입니다.

`process`함수도 지금까지 보았던 함수들과 같은 방식으로 구현할 수 있습니다. 다만 한 가지 다른 점은 내부에서 인자로 받은 값을 `InternalValidated`으로 캐스팅한다는 것입니다. 왜냐하면 이 함수는 `FormData<Validated>` 타입을 리턴해야 하기 때문입니다.

```ts
type Process = (a: FormData<Validated>) => FormData<Validated>;

export const process: Process = (data: FormData<Validated>) => {
  const internalData = data as InternalValidated;
  // do some processing...
  return data; // cast to FormData<Validated>
};
```

여기까지 우리는 팬텀 타입을 구현해서, 팬텀 타입을 통해 라이브러리가 우리가 원하는대로 동작함을 확인할 수 있습니다.

```ts
import { makeFormData, validate, upperCase, process } from './phantomTypes';

const initialData = makeFormData('test'); // Unvalidated
const validatedData = validate(initialData); // Validated

// validate("hello") // Type '"hello"' is not assignable to type '{value: never}'
// validate({value: "hello"}) // Type 'string' is not assignable to type 'never'

if (validatedData !== null) {
  // validate(validatedData); // Error! Type '"Validated"' is not assignable to Type '"Unvalidated"'
  upperCase(initialData);
  // upperCase(validatedData) // Error! Type '"Validated"' is not assignable to Type '"Unvalidated"'
  process(validatedData);
  // process(initialData); // Error! Type '"Unvalidated"' is not assignable to Type '"Validated"'
}
```

이제 지금까지 구현한 것을 바탕으로, 타입스크립트에서 Phantom Type을 추상화 할 수 있습니다.

```ts
type PhantomType<Type, Data> = {\_type: Type} & Data;

// use this type helper to create an UnvalidatedData type
type UnvalidatedData = PhantomType<"Unvalidated", {value: string}>
```

이쯤 되면 이제 타입스크립트에서 팬텀 타입을 어떻게 구현할 수 있는지에 대해 기본적으로 이해했을 것입니다. 전체 예제는 [여기 -타입스크립트 플레이그라운드-](<https://www.typescriptlang.org/play#src=type%20FormData_%3CT%2C%20D%20%3D%20never%3E%20%3D%20%7B%20value%3A%20never%20%7D%20%26%20T%3B%0D%0A%0D%0Atype%20Unvalidated%20%3D%20%7B_type%3A%20%22Unvalidated%22%7D%3B%0D%0Atype%20Validated%20%3D%20%7B%20_type%3A%20%22Validated%22%20%7D%3B%0D%0A%0D%0Atype%20MakeFormData%20%3D%20(a%3A%20string)%20%3D%3E%20FormData_%3CUnvalidated%3E%3B%0D%0Atype%20UpperCase%20%3D%20(a%3A%20FormData_%3CUnvalidated%3E)%20%3D%3E%20FormData_%3CUnvalidated%3E%3B%0D%0Atype%20Validate%20%3D%20(a%3A%20FormData_%3CUnvalidated%3E)%20%3D%3E%20FormData_%3CValidated%3E%20%7C%C2%A0null%3B%0D%0Atype%20Process%20%3D%20(a%3A%20FormData_%3CValidated%3E)%20%3D%3E%20FormData_%3CValidated%3E%3B%0D%0A%0D%0Atype%20InternalUnvalidated%20%3D%20Unvalidated%20%26%20%7B%0D%0A%20%20value%3A%20string%3B%0D%0A%7D%3B%0D%0A%0D%0Atype%20InternalValidated%20%3D%20Validated%20%26%20%7B%0D%0A%20%20value%3A%20string%3B%0D%0A%7D%3B%0D%0A%0D%0Aconst%20makeFormData%3A%20MakeFormData%20%3D%20value%20%3D%3E%20%7B%0D%0A%20%20return%20%7B%20value%20%7D%20as%20FormData_%3CUnvalidated%3E%3B%0D%0A%7D%3B%0D%0A%0D%0Aconst%20upperCase%3A%20UpperCase%20%3D%20data%20%3D%3E%20%7B%0D%0A%20%20const%20internalData%20%3D%20data%20as%20InternalUnvalidated%3B%0D%0A%20%20return%20%7B%20value%3A%20internalData.value.toUpperCase()%20%7D%20as%20FormData_%3CUnvalidated%3E%3B%0D%0A%7D%3B%0D%0A%0D%0Aconst%20validate%3A%20Validate%20%3D%20data%20%3D%3E%20%7B%0D%0A%20%20const%20internalData%20%3D%20data%20as%20InternalUnvalidated%3B%0D%0A%20%20if%20(internalData.value.length%20%3E%203)%20%7B%0D%0A%20%20%20%20return%20%7B%20value%3A%20internalData.value%20%7D%20as%20FormData_%3CValidated%3E%3B%0D%0A%20%20%7D%0D%0A%20%20return%20null%3B%0D%0A%7D%3B%0D%0A%0D%0Aconst%20process%20%3A%20Process%20%3D%20(data%3A%20FormData_%3CValidated%3E)%20%3D%3E%20%7B%0D%0A%20%20const%20internalData%20%3D%20data%20as%20InternalValidated%3B%0D%0A%20%20internalData.value.toLowerCase()%3B%0D%0A%20%20%2F%2F%20do%20some%20processing...%0D%0A%20%20return%20data%3B%0D%0A%7D%0D%0A%0D%0Aconst%20initialData%20%3D%20makeFormData(%22test%22)%3B%0D%0Aconst%20validatedData%20%3D%20validate(initialData)%3B%0D%0A%0D%0A%0D%0A%2F%2F%20validate(%22hello%22)%20%2F%2F%20Type%20'%22hello%22'%20is%20not%20assignable%20to%20type%20'%7Bvalue%3A%20never%7D'%0D%0A%2F%2F%20validate(%7Bvalue%3A%20%22hello%22%7D)%20%2F%2F%20Type%20'string'%20is%20not%20assignable%20to%20type%20'never'%0D%0A%0D%0Aconst%20upperCasedValue%20%3D%20upperCase(initialData)%3B%0D%0A%0D%0A%20%20%2F%2F%20process(initialData)%3B%20%2F%2F%20Error!%20Type%20'%22Unvalidated%22'%20is%20not%20assignable%20to%20Type%20'%22Validated%22'%0D%0A%0D%0Aif%20(validatedData%20!%3D%3D%20null)%20%7B%0D%0A%20%20%2F%2F%20validate(validatedData)%3B%20%2F%2F%20Error!%20Type%20'%22Validated%22'%20is%20not%20assignable%20to%20Type%20'%22Unvalidated%22'%20%20%0D%0A%20%20%2F%2F%20upperCase(validatedData)%20%2F%2F%20Error!%20Type%20'%22Validated%22'%20is%20not%20assignable%20to%20Type%20'%22Unvalidated%22'%0D%0A%20%20process(validatedData)%3B%0D%0A%7D%0D%0A>)에서 확인하세요.
