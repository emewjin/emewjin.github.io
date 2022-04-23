---
title: [번역] Array map을 깊게 파보자
date: 2021-04-15
lastUpdated: 2021-04-15
description: '이 글의 내용은 [BENJAMIN JOHNSON의 Deep Dive into JavaScript's Array Map Method](https://www.robinwieruch.de/javascript-map-array)를 기반으로 작성되었습니다. 사실상 번역글.'
tags: [Javascript]
---

# Array map을 깊게 파보자

> 📌 이 글의 내용은 [BENJAMIN JOHNSON의 Deep Dive into JavaScript's Array Map Method](https://www.robinwieruch.de/javascript-map-array)를 기반으로 작성되었습니다. 번역글이라고 하기엔 퀄리티가 부끄럽지만 사실상 번역글.
>
> 📌 글이 굉장히 깁니다. 원본 글부터가 매우... 길기 때문이죠... 🌝

<span style="color:hotpink;">**원하는 객체와 배열을 자유자재로 만들 수 있어야 합니다.**</span> 그러기 위해서 알아두어야 할 것 중 하나가 array 메소드입니다. 그중에서도 활용도가 높은 map 메소드에 대해 깊게 파는 게시글을 보고 공부한 것을 정리해보았습니다.

> `array.map((value, index, array) => { ... });`
>
> map 메소드의 콜백함수는 세 가지를 인자로 받을 수 있습니다.
>
> - `value` : 배열의 각 요소를 나타냅니다.
> - `index` : 처리할 현재 요소의 인덱스.
> - `array` : map()을 호출한 배열.

배열 안의 모든 요소에 대해 함수를 실행하고, 그 결과로 이루어진 새로운 배열을 반환합니다. <span style="color:hotpink;">**이때 원본 배열은 변경되지 않습니다.**</span> 결과적으로 for loops를 돌리는 것과 같지만, for문 대신 map 메소드를 사용하는 것은

- 반복되는 부분만 적기 때문에 코드의 가독성이 증가합니다.
- 코드를 작성하는 양을 줄일 수 있습니다.

이 두 가지 이유 때문입니다.

## 🌳 map에서 화살표 함수를 쓰는 이유

map 메소드의 콜백함수로 화살표 함수를 주로 쓰는 이유는 syntax적으로 부담을 주지 않는 선에서 반복할 내용을 인라인으로 정의할 수 있기 때문입니다. 이름이 있는 full function syntax를 사용할 때처럼 개발자 도구의 stack trace에 함수 이름이 표시되지는 않지만, 대신 map의 콜백을 쉽게 읽을 수 있다는 장점이 있습니다.

## 🌳 다른 array 메소드와의 활용

map과 비슷한 다른 메소드들에 대해 알아보고, map과 어떻게 함께 활용할 수 있는지 알아봅니다.

먼저 알아둘 것은 다음과 같습니다. map과 filter는 `immutable operation`으로 <span style="color:hotpink;">**원본 배열은 건드리지 않고**</span> 새로운 배열로 반환합니다. 반면 <span style="color:hotpink;"> **원본 배열에 변동을 바로 반영**</span>하는 것을 `mutable operation`이라고 합니다. reverse, push 등이 있습니다.

### 🌱 forEach

forEach 메소드 또한 배열의 각 요소에 대해 한번씩 실행된다는 점에서는 map과 동일하지만, <span style="color:hotpink;">**가장 큰 차이점은 return하는 것이 없다는 것입니다.**</span> 따라서 return이 필요하지 않다면 map보다는 forEach를 사용하는 것이 적절합니다. 가장 대표적인 사례는 변경 사항이 반영된 새 배열의 리턴이 필요하냐 아니냐일 것입니다.

```javascript
const originalArray = [1, 2, 3, 4];
const newArray = [];

originalArray.forEach((number, i) => {
  newArray[i] = number * 2;
});

console.log(newArray); // [2, 4, 6, 8]
```

forEach를 사용한 위의 코드는 map을 사용하여 다음과 같이 작성할 수 있습니다. forEach를 사용할 때에는 새 배열을 만들어주고 요소들을 각각 변환해서 새 배열에 넣어줘야 하지만 map은 이를 자동으로 해줍니다.

```javascript
const originalArray = [1, 2, 3, 4];

const newArray = originalArray.map((num) => {
  return num * 2;
});

console.log(originalArray); //[ 1, 2, 3, 4 ]
console.log(newArray); //[ 2, 4, 6, 8 ]
```

### 🌱 filter

filter는 map처럼 새로운 배열을 만들어 그 안에 결과값을 담는다는 공통점이 있지만 다음의 차이점을 보입니다.

filter는 조건에 만족하는 요소들만을 담은 새로운 배열을 반환하는 것이기 때문에 원본 배열에 비하면 <span style="color:hotpink;">**length가 적어질 수 밖에 없습니다.**</span> 반면 map은 length에 있어서는 전혀 변화가 없습니다. 따라서 만일 array의 요소를 삭제할 목적이라면 map보다는 filter를 사용하는 것이 적합합니다.

filter는 map으로 배열의 요소를 변환시키기 전에 요소들을 사전 필터링하는 용도로 활용할 수 있습니다.

```javascript
const originalArray = [1, 2, undefined, 3];

//위의 배열에 다음 map 메소드를 실행하면
const newArray = originalArray.map((value) => {
  return value * 2;
});

//undefined은 숫자가 아니기 때문에 2를 곱했을 때  NaN이 반환됩니다.
console.log(newArray); // [2, 4, NaN, 6]
```

위의 코드처럼 필터링을 하지 않았더니 새로운 배열에 NaN이 포함되었습니다. NaN 때문에 추후 활용에 어려움을 겪을 수 있습니다. 아래와 같이 필터링을 하여 NaN을 사전에 차단합니다.

```javascript
const originalArray = [1, 2, undefined, 3];

const newArray = originalArray
  //filter를 통해 숫자가 아닌 요소를 먼저 제거합니다
  .filter((value) => {
    return Number.isInteger(value);
  })
  //그 후에 map 메소드를 실행합니다.
  .map((value) => {
    return value * 2;
  });

//이제 NaN이 나오지 않게 됩니다
console.log(newArray); // [2, 4, 6]
```

- 위와 같은 모습으로 여러 메소드를 함께 사용하는 것을 [함수적 프로그래밍](https://velog.io/@1703979/TIL-18-Array-%EB%A9%94%EC%86%8C%EB%93%9C-%EC%97%B0%EC%8A%B5#q10-make-a-string-containing-all-the-scores)이라고 합니다.

### 🌱 reduce

`Array.reduce(callback[, initialValue])`

reduce 메소드는 배열의 각 요소에 대해 콜백 함수(`reducer`이라고 부릅니다)를 실행하여 그 결과를 반환합니다.

콜백 함수가 반환하는 값은 accumulator에 할당되는데 accumulator는 콜백의 반환값을 누적합니다. 때문에 최종적으로 reduce 메소드가 반환하는 accumulator는 <span style="color:hotpink;">**하나의 값**</span>입니다.

새로운 <span style="color:hotpink;">**배열**</span>을 만들 때 reduce 메소드를 map 메소드처럼 사용할 수도 있습니다. 물론 권장하지는 않는데, map에 비해 다음과 같이 복잡하기 때문입니다.

```javascript
const originalArray = [1, 2, 3, 4, 5];
const newArray = originalArray.reduce((accumulator, value, index) => {
  accumulator[index] = value * 2;
  return accumulator;
}, []);

console.log(newArray); // [2, 4, 6, 8, 10]
```

위의 코드는 map을 사용하면 아래와 같이 더 간단하게 작성할 수 있습니다. map은 우리가 각 요소를 어떻게 변환할 것인지만 적어주면 되기 때문에 훨씬 깔끔하고 가독성이 좋습니다.

```javascript
const originalArray = [1, 2, 3, 4, 5];

const newArray = originalArray.map((num) => num * 2);

console.log(newArray); // [2, 4, 6, 8, 10]
```

그러나 배열을 새로운 <span style="color:hotpink;">**객체**</span>로 만들 때에는 map보다 reduce가 효과적입니다. reduce는 반환 값을 자유롭게 지정할 수 있기 때문입니다. 첫번째 인자인 콜백 다음의 두번째 인자인 `initialValue`를 통해 지정할 수 있습니다. 다음의 코드는 return의 shape을 `{}`로 지정했습니다.

```javascript
const myArray = ['a', 'b', 'c', 'd'];

const myObject = myArray.reduce((accumulator, value) => {
  //array의 string들을 object의 key로
  accumulator[value] = true;
}, {});

console.log(myObject);
// { a: true, b: true, c: true, d: true }
```

결론적으로 기존 배열에서 바뀐 값들로 이루어진 새로운 배열을 만들고자 한다면 map을, 기존 배열을 객체 등 다른 것으로 리턴하고 싶다면 reduce를 사용합니다.

### 🌱 reverse

map은 immutable이지만 reverse는 mutable입니다. 즉, reverse 메소드는 원본을 변경시킵니다. 그렇기 때문에 <span style="color:hotpink;">**map과 reverse를 함께 사용하고자 한다면 map을 먼저 실행**</span>해야 합니다.

단순히 reverse만 사용하고자 하면 map은 필요가 없습니다. 또, reverse 사용시 원본 배열과 분리하여 새롭게 만들고자 할 때도 map 대신 slice 메소드를 활용할 수 있습니다.

```javascript
const originalArray = [1, 2, 3, 4, 5];
const newArray = originalArray.slice().reverse();

console.log(newArray); // [5, 4, 3, 2, 1]
```

## 🌳 map의 복잡한 활용

map 메소드는 굉장히 활용도가 높습니다. 배열의 모든 요소에 1씩 더하는 것과 같은 간단한 작업 뿐만 아니라, 다음과 같은 조금 더 복잡한 일을 할 수 있습니다.

### 🌱 객체 value 추출

객체로 이루어진 배열을 string으로 이루어진 배열로 변형시킬 수 있습니다.

```javascript
const originalArray = [
  { a: 1, b: 'first' },
  { a: 2, b: 'second' },
  { a: 3, b: 'third' },
];

const newArray =
  //배열안의 각 객체에서 b키의 값을 가져와 새로운 배열로 반환
  originalArray.map((object) => object.b);

console.log(newArray); // ['first', 'second', 'third']
```

### 🌱 객체 내부 순회

map 메소드는 array 메소드이기 때문에 객체에 직접적으로 사용할 수는 없습니다. 따라서 `Object.entries()`를 통해 객체를 배열로 나타낸 후 map 메소드를 사용합니다.

우선 `Object.entries()`를 통해 객체를 배열로 나타내겠습니다. `Object.entries()`를 사용하면 새로운 배열이 만들어지는데 원본 객체에는 영향을 주지 않습니다.

```javascript
const object = {
  a: 1,
  b: 2,
  c: 3,
};

const array = Object.entries(object);

console.log(array);
// [['a', 1], ['b', 2], ['c', 3]]
```

객체가 배열이 되었으므로 이제 얼마든지 map 메소드를 사용하여 변형시킬 수 있습니다.

```javascript
const newArray = array.map(
  //가독성을 위해 구조 분해 할당 구문으로 표현했습니다.
  //key는 바뀌지 않지만 value는 2배가 됩니다.
  ([key, value]) => [key, value * 2]
);

console.log(newArray); // [['a', 2], ['b', 4], ['c', 6]]
```

원하는대로 변형이 끝난 후 다시 객체로 되돌려놓고 싶습니다. 위에서 보았던 reduce 메소드를 통해 할 수 있습니다.

```javascript
const newObject = newArray.reduce((accumulator, [key, value]) => {
  accumulator[key] = value;
  return accumulator;
}, {});

console.log(newObject); // { a: 2, b: 4, c: 6 }
```

이렇게 원본 객체인 `object`을 변형시키지 않은 채로 value를 변형시킨 새로운 객체를 만들 수 있습니다.

```javascript
console.log(newObject); //{ a: 2, b: 4, c: 6 }
console.log(object); //{ a: 1, b: 2, c: 3 }
```

전체코드는 아래와 같습니다.

```javascript
const object = {
  a: 1,
  b: 2,
  c: 3,
};

const array = Object.entries(object);

const newArray = array.map(([key, value]) => [key, value * 2]);

const newObject = newArray.reduce((accumulator, [key, value]) => {
  accumulator[key] = value;
  return accumulator;
}, {});

console.log(newObject);
console.log(object);
```

이 코드는 map을 사용하지 않고 아래와 같이 reduce나 forEach만으로도 작성할 수도 있습니다.

```javascript
//1. reduce를 사용
const object = {
  a: 1,
  b: 2,
  c: 3,
};

const entries = Object.entries(object);

const newObject = entries.reduce((accumulator, [key, value]) => {
  accumulator[key] = value * 2;
  return accumulator;
}, {});

console.log(newObject); //{ a: 2, b: 4, c: 6 }

// 2. forEach를 사용
const newObject = {};

entries.forEach(([key, value]) => {
  newObject[key] = value * 2;
});

console.log(newObject); // { a: 2, b: 4, c: 6 }
```

### 🌱 조건 적용하기

배열의 요소들을 map 메소드로 변경할 때 조건을 적용할 수 있습니다. <span style="color:hotpink;">**주의할 점은 변경점이 없을 값들의 return도 확인해줘야 한다는 것**</span>입니다.

조건에 맞는 배열의 요소들만 변경시킬 수도 있고,

```javascript
const originalArray = [5, 10, 15, 20];

const newArray = originalArray.map((number) =>
  number >= 10 ? number * 2 : number
);

console.log(newArray); // [5, 20, 30, 40]
```

하나의 특정 요소만 변경시킬 수도 있습니다. 모두 조건을 어떻게 주냐에 달려있습니다.

```javascript
const originalArray = [5, 10, 15, 20];

const newArray = originalArray.map((number) =>
  number === 10 ? number * 2 : number
);

console.log(newArray); // [5, 20, 15, 20]
```

### 🌱 배열 안의 배열에 적용하기

```javascript
const myArray = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
```

이렇게 생긴, 배열 안에 배열이 있는 형태를 흔히 볼 수 있습니다. 이 경우, map 메소드를 일반적인 형태로 사용한다면 겉의 배열만 다루게 됩니다. 즉, map 메소드는 `[1, 2, 3]`, `[4, 5, 6]`, `[7, 8, 9]` 이렇게 세 가지 요소를 가져옵니다.

저 세 가지 내부 배열에 map을 적용하고 싶다면 다음과같이 map을 중첩해야합니다.

```javascript
const myArray = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const newArray = myArray.map((value) =>
  //`[1, 2, 3]`, `[4, 5, 6]`, `[7, 8, 9]`에 각각 map을 또 적용
  value.map((number) => number * 2)
);

console.log(newArray); // [[2, 4, 6], [8, 10, 12], [14, 16, 18]]
```

## 🌳 map 디버깅

map 메소드에는 크게 두 가지의 위험(버그)이 기다리고 있습니다.

### 🌱 `map is not a function`

`map is not a function`은 가장 흔한 버그입니다. 객체나 null, 혹은 array가 아닌 어떤 것에라도 map 메소드를 사용하면 이런 에러를 볼 수 있습니다.

특히, 본인이 마주할 데이터가 어떤 것인지 정확하게 확신할 수 없는 상황에서 이런 에러를 자주 마주하게 됩니다. 예를들어, API에서 응답을 받아오는 상황 등이 있습니다.

이를 해결할 수 있는 trick은 `(originalArray || [])`을 추가하는 것입니다.

```javascript
// originalArray could either be [1, 2, 3, 4] or null
const newArray = (originalArray || []).map((number) => number * 2);
```

`||`은 **첫번째** `true`값이나 truthy값을 반환합니다. 만일 모두 `false`로 판단되는 경우 가장 마지막 표현이 리턴됩니다. 트릭에 대한 보다 자세한 설명은 [이곳](https://medium.com/@bretcameron/12-javascript-tricks-you-wont-find-in-most-tutorials-a9c9331f169d)을 참고하세요.

null은 falsy값이기 때문에 API로부터 전달받은 `originalArray`가 null이라면 가장 마지막 표현인 `[]`가 리턴되고, `[].map();`이 실행됩니다. 결국 null이더라도 빈 배열은 반환되게 됩니다. 이렇게 하면 null에 대응할 수 있습니다.

마찬가지로 `originalArray`가 null이 아니라면 첫번째 `true`인 `originalArray`가 리턴되어 `originalArray.map();`이 실행됩니다.

단, 이 방법은 객체나 string, non-falsy 아이템에는 사용할 수 없습니다.

### 🌱 Logging values inside of map

map 메소드를 통해 배열의 각 요소에 변화를 주기 전, 각 요소가 어떤 상황인지 파악하기 위해서 `console.log(value)`를 찍을 수 있습니다. 이것으로 변경 전의 `value`를 확인할 수 있습니다. 이것을 map 안에 작성하기 위해서는 `{}`으로 묶어주어야 하고, `{}`으로 묶었으니 return도 해줘야 합니다.

```javascript
const originalArray = [1, 2, 3];

const newArray = originalArray.map((value) => {
  console.log(value);
  return value * 2;
});
```

그러나 이런 코드는 나중에 어떤 이슈에 대해 디버깅을 깊게 할 상황에서는 살짝 복잡하게 느껴지기도 합니다. 위에서 사용했던 `||` 트릭을 사용하여 보다 간단하게 작성할 수 있습니다.

```javascript
const originalArray = [1, 2, 3];

const newArray = originalArray.map((value) => console.log(value) || value * 2);
/* 콘솔에 아래와 같이 찍힙니다.
1
2
3
*/

console.log(newArray); //[ 2, 4, 6 ]
```

이런 트릭이 가능한 이유는 `console.log`가 기본적으로 undefined를 리턴하기 때문입니다. undefined는 null처럼 falsy 값이기 때문에 마지막 표현인 `value * 2`가 실행됩니다. 하지만 `console.log`의 리턴값과는 별개로, value를 콘솔에 찍어주는 것은 진행됩니다.
