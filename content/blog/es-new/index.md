---
title: Ecma International, ECMAScript 2025 승인 - 새로운 기능은?
description:
date: 2025-07-06
lastUpdated: 2025-07-06
tags: [번역, Typescript]
---

> 원문: [Ecma International approves ECMAScript 2025: What’s new?](https://2ality.com/2025/06/ecmascript-2025.html)

2025년 6월 25일, 제129회 Ecma 총회는 ECMAScript 2025 언어 사양을 승인했습니다 ([보도 자료](https://ecma-international.org/news/ecma-international-approves-new-standards-11/)). 이는 이제 공식적으로 표준이 되었음을 의미합니다. 이 블로그 게시물은 새로운 기능에 대해 설명합니다.

## 1. ECMAScript 2025의 편집자들

이 릴리스의 편집자들은 다음과 같습니다.

- Shu‑yu Guo
- Michael Ficarra
- Kevin Gibbons

## 2. ECMAScript 2025의 새로운 기능은?

### 2.1 `import` 속성과 JSON 모듈

[`import` 속성](https://exploringjs.com/js/book/ch_modules.html#import-attributes)은 자바스크립트가 아닌 아티팩트를 가져오기 위한 구문적 기반을 제공합니다. 지원되는 첫 번째 아티팩트는 [JSON 모듈](https://exploringjs.com/js/book/ch_modules.html#json-modules)입니다.

```javascript
// 정적 임포트
import configData1 from './config-data.json' with { type: 'json' };

// 동적 임포트
const configData2 = await import(
  './config-data.json',
  { with: { type: 'json' } }
);
```

`with` 뒤의 객체 리터럴 구문은 임포트 속성을 지정하는 데 사용됩니다. `type`은 임포트 속성입니다.

### 2.2 이터레이터 헬퍼 메서드

[이터레이터 헬퍼 메서드](https://exploringjs.com/js/book/ch_sync-iteration.html#class-iterator)를 사용하면 이터레이터로 더 많은 작업을 할 수 있습니다.

```javascript
const arr = ['a', '', 'b', '', 'c', '', 'd', '', 'e'];

assert.deepEqual(
  arr
    .values() // 이터레이터 생성
    .filter((x) => x.length > 0)
    .drop(1)
    .take(3)
    .map((x) => `=${x}=`)
    .toArray(),
  ['=b=', '=c=', '=d=']
);
```

일부 이터레이터 헬퍼 메서드는 동일한 이름의 배열 메서드처럼 작동합니다.

- 이터레이터를 반환하는 메서드:
  - `iterator.filter(filterFn)`
  - `iterator.map(mapFn)`
  - `iterator.flatMap(mapFn)`
- 불리언을 반환하는 메서드:
  - `iterator.some(fn)`
  - `iterator.every(fn)`
- 다른 값을 반환하는 메서드:
  - `iterator.find(fn)`
  - `iterator.reduce(reducer, initialValue?)`
- 값을 반환하지 않는 메서드:
  - `iterator.forEach(fn)`

그 외에는 이터레이터의 고유한 헬퍼 메서드입니다.

- `iterator.drop(limit)`
  `iterator`의 처음 `limit`개 요소를 제외한 이터레이터를 반환합니다.
- `iterator.take(limit)`
  `iterator`의 처음 `limit`개 요소만 포함하는 이터레이터를 반환합니다.
- `iterator.toArray()`
  `iterator`의 나머지 모든 요소를 배열에 모아 반환합니다.

#### 2.2.1 이터레이터 메서드가 배열 메서드보다 나은 점은 무엇인가요?

- 이터레이터 메서드는 모든 이터러블 데이터 구조와 함께 사용할 수 있습니다. 예를 들어, `Set` 및 `Map` 데이터 구조를 필터링하고 매핑할 수 있습니다.
- 이터레이터 메서드는 중간 배열을 생성하지 않고 데이터를 점진적으로 계산합니다. 이는 대량의 데이터에 유용합니다.
  - 이터레이터 메서드를 사용하면 모든 메서드가 첫 번째 값에 적용된 다음 두 번째 값에 적용되는 식입니다.
  - 배열 메서드를 사용하면 첫 번째 메서드가 모든 값에 적용된 다음 두 번째 메서드가 모든 결과에 적용되는 식입니다.

### 2.3 새로운 Set 메서드

여러 새로운 `Set` 메서드가 있습니다.

- [Set 결합](https://exploringjs.com/js/book/ch_sets.html#combining-sets)
  - `Set.prototype.intersection(other)`
  - `Set.prototype.union(other)`
  - `Set.prototype.difference(other)`
  - `Set.prototype.symmetricDifference(other)`
- [Set 관계 확인](https://exploringjs.com/js/book/ch_sets.html#checking-set-relationships)
  - `Set.prototype.isSubsetOf(other)`
  - `Set.prototype.isSupersetOf(other)`
  - `Set.prototype.isDisjointFrom(other)`

예시는 다음과 같습니다.

```javascript
assert.deepEqual(
  new Set(['a', 'b', 'c']).union(new Set(['b', 'c', 'd'])),
  new Set(['a', 'b', 'c', 'd'])
);

assert.deepEqual(
  new Set(['a', 'b', 'c']).intersection(new Set(['b', 'c', 'd'])),
  new Set(['b', 'c'])
);

assert.deepEqual(
  new Set(['a', 'b']).isSubsetOf(new Set(['a', 'b', 'c'])),
  true
);

assert.deepEqual(
  new Set(['a', 'b', 'c']).isSupersetOf(new Set(['a', 'b'])),
  true
);
```

### 2.4 `RegExp.escape()`

[`RegExp.escape()`](https://exploringjs.com/js/book/ch_regexps.html#RegExp.escape)는 정규식 내에서 사용할 수 있도록 텍스트를 이스케이프 처리합니다. 예를 들어, 다음 코드는 따옴표로 묶이지 않은 `str` 내의 모든 `text` 발생을 제거합니다.

```javascript
function removeUnquotedText(str, text) {
  const regExp = new RegExp(`(?<!“)${RegExp.escape(text)}(?!”)`, 'gu');
  return str.replaceAll(regExp, '•');
}

assert.equal(
  removeUnquotedText('“yes” and yes and “yes”', 'yes'),
  '“yes” and • and “yes”'
);
```

### 2.5 정규식 패턴 수정자 (인라인 플래그)

[정규식 패턴 수정자(인라인 플래그)](https://exploringjs.com/js/book/ch_regexps.html#regexp-pattern-modifiers)를 사용하면 정규식의 전체가 아닌 일부에 플래그를 적용할 수 있습니다. 예를 들어, 다음 정규식에서 `i` 플래그는 "HELLO"에만 적용됩니다.

```javascript
> /^x(?i:HELLO)x$/.test('xHELLOx')
true
> /^x(?i:HELLO)x$/.test('xhellox')
true
> /^x(?i:HELLO)x$/.test('XhelloX')
false
```

### 2.6 중복된 이름의 캡처 그룹

[중복된 이름의 캡쳐 그룹:](https://exploringjs.com/js/book/ch_regexps.html#duplicate-named-capture-groups) 이제 동일한 그룹 이름을 두 번 사용할 수 있습니다. 단, 다른 대안에 나타나는 경우에 한합니다.

```javascript
const RE = /(?<chars>a+)|(?<chars>b+)/v;

assert.deepEqual(RE.exec('aaa').groups, {
  chars: 'aaa',
  __proto__: null,
});

assert.deepEqual(RE.exec('bb').groups, {
  chars: 'bb',
  __proto__: null,
});
```

### 2.7 `Promise.try()`

[`Promise.try()`](https://exploringjs.com/js/book/ch_promises.html#Promise.try)를 사용하면 순수하게 비동기적이지 않은 코드로 Promise 체인을 시작할 수 있습니다.

```javascript
function computeAsync() {
  return Promise.try(() => {
    const value = syncFuncMightThrow();
    return asyncFunc(value);
  });
}
```

### 2.8 16비트 부동 소수점 숫자(float16) 지원

이 지원은 다음 기능을 제공합니다.

- [`Math.f16round()`](https://exploringjs.com/js/book/ch_math.html#rounding-floats)
- [Typed Arrays API를 위한 새로운 요소 타입](https://exploringjs.com/js/book/ch_typed-arrays.html#typed-array-element-types):
  - `Float16Array`
  - `DataView.prototype.getFloat16()`
  - `DataView.prototype.setFloat16()`

### **ECMAScript 2025에 대한 무료 책**

제 책 ["Exploring JavaScript (ES2025 Edition)"](https://exploringjs.com/js/)은 온라인에서 무료로 읽을 수 있습니다. 특히 두 장이 관련이 있습니다:

- ["History and evolution of JavaScript"](https://exploringjs.com/js/book/ch_history.html): ECMAScript 대 JavaScript, TC39, TC39 프로세스, ECMAScript 제안 등.
- ["New JavaScript features"](https://exploringjs.com/js/book/ch_new-javascript-features.html#ch_new-javascript-features): 각 ECMAScript 버전의 새로운 기능은 무엇인가?

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
