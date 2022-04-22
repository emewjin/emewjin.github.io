---
title: 'Type Challenge'
date: 2021-12-29
lastUpdated: 2021-12-30
description: '타입 챌린지 문제 풀이 기록'
tags: [Typescript]
---

# Type Challenge

타입스크립트가 익숙하지 않던 차에 네이버 FE 뉴스레터 21년 12월 호에서 타입 챌린지를 소개해주어서 이제서야 조금씩 해보고 있다!
전체적으로 타입스크립트에서 제공하는 유틸 타입을 직접 구현해봄으로써 익히는 문제들이 많은 것 같다. 실제로 유틸 타입들을 처음 써본다 ㅎㅎ;;

- [type-challenges 한국어](https://github.com/emewjin/type-challenges/blob/master/README.ko.md)
- [해설 사이트](https://ghaiklor.github.io/type-challenges-solutions/ko/)

## 🥉 easy

### 4. Pick

타입스크립트 내장 유틸 [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)을 직접 구현하기.  
보통 `Pick<Type, Keys>`로 쓰는데 `T`에서 특정 `K`만을 뽑아 타입으로 쓰는 것이다.

```ts
type MyPick<T, K extends keyof T> = {
  [key in K]: T[key];
};
```

### 7. Readonly

타입스크립트 내장 유틸 [`Readonly<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype)를 구현한다. 모든 프로퍼티를 읽기 전용으로 바꾼다.

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

### 11. Tuple To Object

```ts
type TupleToObject<T extends readonly string[]> = {
  [K in T[number]]: K;
};
```

원래 코드는 `any[]`로부터 확장하는 거였는데 요 케이스를 통과하기 위해 `string[]`으로 수정했다.

```ts
// @ts-expect-error
type error = TupleToObject<[[1, 2], {}]>;
```

### 14. First of Array

배열(튜플)의 첫 번째 원소 타입을 반환하는 제네릭 구현하기

처음엔 완전 단순하게 0번째 인덱스를 이용했는데,

```ts
type First<T extends any[]> = T[0];
```

요기서 걸렸다.

```ts
Expect<Equal<First<[]>, never>>,
```

그래서 이걸 예외처리라고 불러야 하는 건진 잘 모르겠는데, 다음과 같이 수정했다.

```ts
type First<T extends any[]> = T extends [] ? never : T[0];
```

다른 사람들은 다음과 같이 풀었더라.

```ts
//
type First<T extends any[]> = T['length'] extends 0 ? never : T[0];

//
type First<T extends any[]> = T extends [first: infer First, ...rest: any[]]
  ? First
  : never;
type First<T extends unknown[]> = T extends [infer First, ...infer Rest]
  ? First
  : never;
type First<T extends any[]> = T extends [infer F, ...infer L] ? F : never;

//
type First<T extends any[]> = T[number] extends never ? never : T[0];
type First<T extends any[]> = T[0] extends T[number] ? T[0] : never;
```

#### 📝 Infer 키워드

주로 `infer R`과 같이 많이 쓰인다. **조건문에 쓰이는 타입 중 하나를 이름 붙여서** 삼항연산자의 true 절이나 false절에 사용하기 위한 키워드이다. 그러니까 위의 코드를 예시로 들면, 배열의 첫번째 요소의 타입을 First라고 이름붙여서 삼항연산자의 true / false 절에서 사용하고 있는 것이다.

### 18. Length of Tuple

배열(튜플)의 길이를 나타내는 타입 구현하기

이번에도 역시 완전 간단하게 다음과 같이 작성했다가, 엣지케이스에서 걸렸다.

```ts
type Length<T extends any> = T['length']

// 엣지케이스
  // @ts-expect-error
  Length<5>,
  // @ts-expect-error
  Length<'hello world'>,
```

배열의 길이를 나타내는 것이 문제였으니, `any`가 아니라 `any[]`로 수정했다.

```ts
type Length<T extends readonly any[]> = T['length'];
```

### 43. Exclude

역시 타입스크립트에서 지원하는 유틸 [Exclude](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion)를 직접 구현하는 문제이다.

> `Exclude<Type, ExcludedUnion>` : `Type`에서 `ExcludedUnion`에 할당할 수 있는 타입을 제외한다.

`extends`가 무슨 의미인지 안다면 (하위 집합 개념) 쉽게 풀 수 있다.

```ts
type MyExclude<T, U> = T extends U ? never : T;
```

### 189. Awaited 🔥

문제 : "Promise와 같은 타입에 감싸인 타입이 있을 때, 안에 감싸인 타입이 무엇인지 어떻게 알 수 있을까요? 예를 들어 `Promise<ExampleType>`이 있을 때, `ExampleType`을 어떻게 얻을 수 있을까요?"

> 문제의 출처는 [Advanced TypeScript Exercises - Question 1](https://dev.to/macsikora/advanced-typescript-exercises-question-1-45k4) 라고 한다.

문제의 원 출처에서 제시하는 답은 다음과 같은데, `infer` 키워드를 핵심으로 설명한다.

```ts
type Transform<A> = A extends Promise<infer Inner> ? Inner : never;
type Result = Transform<Promise<string>>; // Result is string type
```

따라서 위의 케이스를 참고해 다음과 같이 답을 쓰면.. **Promise가 겹쳐있는** 엣지케이스를 통과하지 못한다.

```ts
type MyAwaited<T> = T extends Promise<infer U> ? U : never;
```

Promise 안에 Promise가 계속 있어도 문제가 없게끔 재귀 형식으로 다음과 같이 작성해준다. 그리고 Promise가 아닐 경우도 체크해준다.

```ts
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer U>
  ? U extends Promise<unknown>
    ? MyAwaited<U>
    : U
  : never;
```

### 898. Includes

`type Include <T,U>`는 U가 T에 속하는지를 확인하는 것으로, 자바스크립트의 includes 메소드와 동일한 기능을 구현해야 한다.  
처음엔 이렇게 구현했는데 아니나 다를까 튜플 안에 타입이 오는 경우의 테스트 케이스를 통과하지 못했다.

```ts
type Includes<T extends readonly any[], U> = U extends T[number] ? true : false;
```

해서 수정해보면 다음과 같다. 앞선 문제에서 만들었던 Equal 타입을 활용한다.

```ts
type Includes<T extends readonly any[], U> = T extends [infer F, ...infer R]
  ? Equal<F, U> extends true
    ? true
    : Includes<R, U>
  : false;
```

### 3312. Parameters 🔥

내장 제네릭 [`Parameters<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)구현하기

## 🥈 medium

### 2. Get Return Type

내장 제네릭 [`ReturnType<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype) 구현하기.  
`ReturnType` 공식 문서도 그렇고 타입 챌린지 문제도 그렇고 보면 타입으로 함수를 받는다. 함수에서 반환하는 값의 타입을 infer 키워드로 잡으면 구현할 수 있다.

```ts
type MyReturnType<T extends (...args: any[]) => unknown> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;
```

### 3. Omit

내장 제네릭 [`Omit<T, K>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) 구현하기. Type에서 특정 Key 프로퍼티만 제거해 새로운 오브젝트 타입을 만든다. `Exclude`를 이용하여 다음과 같이 구현할 수 있다.

```ts
type MyOmit<T, K> = {
  [key in Exclude<keyof T, K>]: T[key];
};
```

### 8. Readonly 2

K가 주어지지 않으면 T의 모든 프로퍼티를 읽기 전용으로, K가 주어지면 T에서 K 프로퍼티만 읽기 전용으로 설정하는 제네릭을 구현하기.

## 🥇 hard
