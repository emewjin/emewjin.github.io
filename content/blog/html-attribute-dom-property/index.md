---
title: (번역) HTML 속성 vs DOM 프로퍼티
description: 더 낮은 수준에서 DOM을 파헤쳐야 하는 경우 알아두면 도움이 될, HTML 속성(attribute)과 DOM 프로퍼티(property)의 차이점에 대해 알아보아요.
date: 2024-05-01
lastUpdated: 2024-05-01
tags: [HTML, 번역]
---

> 원문: [HTML attributes vs DOM properties](https://jakearchibald.com/2024/attributes-vs-properties/)

속성(attribute)과 프로퍼티(property)는 **근본적으로** 다른 개념입니다. 같은 이름의 속성과 프로퍼티를 서로 다른 값으로 설정할 수 있습니다. 예를 들면 다음과 같습니다.

```html
<div foo="bar">…</div>
<script>
  const div = document.querySelector('div[foo=bar]');

  console.log(div.getAttribute('foo')); // 'bar'
  console.log(div.foo); // undefined

  div.foo = 'hello world';

  console.log(div.getAttribute('foo')); // 'bar'
  console.log(div.foo); // 'hello world'
</script>
```

프레임워크 덕분에 이 사실을 아는 개발자가 점점 더 줄어들고 있는 것 같습니다.

```html
<input className="..." type="..." aria-label="..." value="..." />
```

프레임워크의 템플릿 언어에서 위의 작업을 수행하는 경우 속성과 유사한 구문을 사용하지만 내부적으로 프로퍼티를 대신 설정하는 경우가 있으며, 프레임워크마다 다르게 동작합니다. 경우에 따라서는 부수 효과로 속성과 프로퍼티를 _모두_ 설정하는 경우도 있지만 이는 프레임워크의 문제가 아닙니다.

대부분의 경우 이를 구분하는 것은 중요하지 않습니다. 저는 개발자가 프로퍼티와 속성의 차이를 신경 쓰지 않고도 오랫동안 행복한 커리어를 쌓을 수 있는 것은 좋은 일이라고 생각합니다. 하지만 더 낮은 수준에서 DOM을 파헤쳐야 하는 경우 알아두면 도움이 됩니다. 차이점을 알고 있다고 생각하시더라도 미처 생각하지 못했을 몇 가지 세부 사항에 대해 말씀드리겠습니다. 그럼 시작해 보겠습니다...

## 핵심 차이점

이 흥미로운 내용을 살펴보기 전에 몇 가지 기술적 차이점을 먼저 알아보겠습니다.

### HTML 직렬화

속성은 HTML로 직렬화되지만 프로퍼티는 그렇지 않습니다.

```js
const div = document.createElement('div');

div.setAttribute('foo', 'bar');
div.hello = 'world';

console.log(div.outerHTML); // '<div foo="bar"></div>'
```

따라서 브라우저 개발자 도구의 요소 패널에선 프로퍼티가 아닌 요소의 속성만 볼 수 있습니다.

### 값(value)의 타입

직렬화된 형식으로 작업하기 위해 속성 값은 항상 문자열이지만 프로퍼티는 모든 타입이 가능합니다.

```js
const div = document.createElement('div');
const obj = { foo: 'bar' };

div.setAttribute('foo', obj);
console.log(typeof div.getAttribute('foo')); // 'string'
console.log(div.getAttribute('foo')); // '[object Object]'

div.hello = obj;
console.log(typeof div.hello); // 'object'
console.log(div.hello); // { foo: 'bar' }
```

### 대소문자 구분

속성의 이름은 대소문자를 구분하지 않지만 프로퍼티의 이름은 대소문자를 구분합니다.

```html
<div id="test" HeLlO="world"></div>
<script>
  const div = document.querySelector('#test');

  console.log(div.getAttributeNames()); // ['id', 'hello']

  div.setAttribute('FOO', 'bar');
  console.log(div.getAttributeNames()); // ['id', 'hello', 'foo']

  div.TeSt = 'value';
  console.log(div.TeSt); // 'value'
  console.log(div.test); // undefined
</script>
```

그러나 속성의 _값은_ 대소문자를 구분합니다.

자, 여기서부터 상황이 모호해지기 시작합니다.

## 반영

이 코드를 좀 보세요.

```html
<div id="foo"></div>
<script>
  const div = document.querySelector('#foo');

  console.log(div.getAttribute('id')); // 'foo'
  console.log(div.id); // 'foo'

  div.id = 'bar';

  console.log(div.getAttribute('id')); // 'bar'
  console.log(div.id); // 'bar'
</script>
```

이 글의 첫 번째 예제와 모순되는 것처럼 보이지만, 위의 예제가 작동하는 이유는 `Element`에 `id` 속성을 '반영'하는 `id` getter 및 setter가 있기 때문입니다.

프로퍼티가 속성을 반영할 때, _속성_ 이 데이터의 원천입니다. 프로퍼티를 설정하면 속성이 업데이트됩니다. 프로퍼티를 읽으면 속성을 읽는 것입니다.

편의를 위해 대부분의 스펙은 정의된 모든 속성에 해당하는 프로퍼티를 생성합니다. 이 글의 시작 부분에 있는 예제는 동작하지 않는데, `foo`가 스펙에 정의된 속성이 아니므로 이를 반영하는 스펙에 정의된 `foo` 프로퍼티도 없기 때문입니다.

[여기 `<ol>`에 대한 스펙이 있습니다.](https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element) "콘텐츠 속성" 섹션은 속성을 정의하고 "DOM 인터페이스"는 프로퍼티를 정의합니다. DOM 인터페이스에서 `reversed`를 클릭하면 다음으로 이동합니다.

> `reversed`와 `type` IDL 속성들은 반드시 같은 이름의 콘텐츠 속성을 [반영](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflect)해야 합니다.

하지만 일부 반영자(reflector)들은 더 복잡합니다...

### 작명의 차이

비교적 사소한 문제이지만 프로퍼티가 반영하는 속성과 다른 이름을 가진 경우가 있습니다.

경우에 따라서는 프로퍼티에서 사용하는 표기법을 반영합니다.

- `<img>`에서 `el.crossOrigin`은 `crossorigin` 속성을 반영합니다.
- 모든 요소에서 `el.ariaLabel`은 `aria-label` 속성을 반영합니다. (2023년 말에 모든 브라우저가 aria 반영자를 적용했습니다. 그전에는 속성만 사용할 수 있었습니다.)

오래된 자바스크립트 예약어와 겹치는 경우에는 이름을 변경해야 했습니다.

- 모든 요소에서 `el.className`은 `class` 속성을 반영합니다.
- `<label>`에서 `el.htmlFor`는 `for` 속성을 반영합니다.

### 유효성 검증, 형 변환, 그리고 기본값

속성과 달리 프로퍼티들은 유효성 검증과 기본값이 있습니다.

```js
const input = document.createElement('input');

console.log(input.getAttribute('type')); // null
console.log(input.type); // 'text'

input.type = 'number';

console.log(input.getAttribute('type')); // 'number'
console.log(input.type); // 'number'

input.type = 'foo';

console.log(input.getAttribute('type')); // 'foo'
console.log(input.type); // 'text'
```

이 경우 `type` getter에 의해 유효성 검사가 수행됩니다. setter가 유효하지 않은 값 `'foo'`를 허용했더라도 getter가 값이 유효하지 않거나 없다는 것을 확인하면 `'text'`를 반환합니다.

일부 프로퍼티는 형 변환을 수행합니다.

```html
<details open>…</details>
<script>
  const details = document.querySelector('details');

  console.log(details.getAttribute('open')); // ''
  console.log(details.open); // true

  details.open = false;

  console.log(details.getAttribute('open')); // null
  console.log(details.open); // false

  details.open = 'hello';

  console.log(details.getAttribute('open')); // ''
  console.log(details.open); // true
</script>
```

이 경우 `open` 프로퍼티는 속성의 존재 여부를 반환하는 불리언입니다. setter는 타입을 강제로 변환합니다. setter에 `'hello'`가 주어지더라도 속성으로 바로 할당되지 않고 불리언으로 바뀝니다.

`img.height`와 같은 프로퍼티는 속성 값을 숫자로 강제로 변환합니다. setter는 들어오는 값을 숫자로 변환하고 음수 값은 0으로 처리합니다.

### input의 `value`

`value`또한 흥미롭습니다. 여기 `value` 프로퍼티와 `value` 속성이 있습니다. 그러나 `value` 프로퍼티는 `value` 속성을 반영하지 않습니다. 대신 `defaultValue` 프로퍼티가 `value` 속성을 반영합니다.

알아요, 알아요.

사실 `value` 프로퍼티는 _어떤_ 속성도 반영하지 않습니다. 이는 드문 일이 아니며, 이러한 속성은 수없이 많습니다 (`offsetWidth`, `parentNode`, 어떤 이유로의 체크박스의 `indeterminate` 등).

처음에 `value` 프로퍼티는 `defaultValue` 프로퍼티를 참조합니다. 그런 다음 자바스크립트 또는 사용자 상호작용을 통해 `value` 프로퍼티가 설정되면 내부 값으로 전환됩니다. _대략_ 다음과 같이 구현되는 것처럼 보입니다.

```js
class HTMLInputElement extends HTMLElement {
  get defaultValue() {
    return this.getAttribute('value') ?? '';
  }

  set defaultValue(newValue) {
    this.setAttribute('value', String(newValue));
  }

  #value = undefined;

  get value() {
    return this.#value ?? this.defaultValue;
  }

  set value(newValue) {
    this.#value = String(newValue);
  }

  // 관련 폼이 재설정될 때 발생합니다.
  formResetCallback() {
    this.#value = undefined;
  }
}
```

그래서,

```html
<input type="text" value="default" />
<script>
  const input = document.querySelector('input');

  console.log(input.getAttribute('value')); // 'default'
  console.log(input.value); // 'default'
  console.log(input.defaultValue); // 'default'

  input.defaultValue = 'new default';

  console.log(input.getAttribute('value')); // 'new default'
  console.log(input.value); // 'new default'
  console.log(input.defaultValue); // 'new default'

  // 전환점입니다.
  input.value = 'hello!';

  console.log(input.getAttribute('value')); // 'new default'
  console.log(input.value); // 'hello!'
  console.log(input.defaultValue); // 'new default'

  input.setAttribute('value', 'another new default');

  console.log(input.getAttribute('value')); // 'another new default'
  console.log(input.value); // 'hello!'
  console.log(input.defaultValue); // 'another new default'
</script>
```

`value` 속성 이름을 `defaultvalue`로 지정했다면 훨씬 더 이해가 쉬웠을 것입니다. 지금은 너무 늦었습니다.

## 구성을 위한 속성

제 생각에는 속성은 구성을 위한 것이어야 하고, 반면 프로퍼티는 상태를 포함할 수 있습니다. 또한 light-DOM 트리에는 단일 소유자가 있어야 한다고 생각합니다.

그런 의미에서 `<input value>`가 (이름만 빼고) 옳다고 생각합니다. `value` 속성은 기본값을 구성하는 반면, `value` 프로퍼티는 현재 상태를 제공하니까요.

또한 유효성 검증이 프로퍼티를 가져오거나 설정할 때는 수행되지만 속성을 가져오거나 설정할 때는 수행되지 않는다는 점도 이해가 됩니다.

'제 생각에는'이라고 말하는 이유는 최근 몇 가지 HTML 요소에서는 다르게 처리되었기 때문입니다.

`<details>` 및 `<dialog>` 요소는 `open` 속성을 통해 열린 상태를 나타내며, 브라우저는 사용자 상호 작용에 따라 이 속성을 스스로 추가/제거합니다.

이것은 설계 실수라고 생각합니다. 이렇게 되면 속성은 구성을 위한 것이라는 개념이 깨집니다. 더 중요한 것은 DOM을 유지 관리하는 시스템(프레임워크 또는 바닐라 JS)이 DOM 자체가 변경될 수 있다는 것에 대비해야 함을 의미합니다.

저는 이렇게 되어야 한다고 생각합니다.

```html
<details defaultopen>…</details>
```

그리고 `details.open` 프로퍼티로 현재 상태를 가져오거나 설정하고, 해당 상태를 타겟팅하는 CSS 의사 클래스가 있어야 합니다.

업데이트: [Simon Peters](https://twitter.com/zcorpan)가 [이와 관련된 초기 설계 논의](https://lists.whatwg.org/pipermail/whatwg-whatwg.org/2007-August/054532.html) 일부를 발굴했습니다.

제 생각에는 `contenteditable` 도 이 계약을 깨뜨리겠지만... 음... 많은 결함을 선택적으로 수용하는 것이죠.

## 프레임워크가 차이점을 처리하는 방법

다시 이 예제로 돌아가봅시다.

```html
<input className="…" type="…" aria-label="…" value="…" />
```

프레임워크들은 어떻게 처리할까요?

### Preact와 VueJS

속성을 선호하는 정해진 경우를 제외하고는 `요소에 propName이 있으면` prop을 프로퍼티로 설정하고, 그렇지 않으면 속성으로 설정합니다. 기본적으로 속성보다 프로퍼티를 선호합니다. render-to-string 메서드는 그 반대의 작업을 수행하며 프로퍼티 전용인 것은 무시합니다.

- [Preact의 `setProperty`.](https://github.com/preactjs/preact/blob/aa95aa924dd5fe28798f2712acdabdc2e9fa38c9/src/diff/props.js#L37)
- [VueJS의 `shouldSetAsProp`.](https://github.com/vuejs/core/blob/958286e3f050dc707ad1af293e91bfb190bdb191/packages/runtime-dom/src/patchProp.ts#L69)

### 리액트

리액트는 그 반대입니다. 프로퍼티를 선호하는 정해진 경우 외에도 속성을 설정합니다. 따라서 render-to-string 메서드의 로직이 비슷해집니다.

이것이 리액트에서 커스텀 요소가 작동하지 않는 이유를 설명해줍니다. 커스텀 엘리먼트는 커스텀이기 때문에 프로퍼티가 리액트의 '미리 정의된 목록'에 있지 않으므로 대신 속성으로 설정됩니다. 커스텀 요소에 프로퍼티만 있는 것은 작동하지 않습니다. 이 문제는 리액트 19에서 수정되어 커스텀 요소에 대해서는 Preact/VueJS 모델로 전환될 예정입니다.

재미있는 점은 리액트가 속성 _처럼 보이는 것_ 에 `class` 대신 `className`을 사용하는 것이 대중화되었다는 것입니다. 그러나 속성 이름이 아닌 프로퍼티 이름을 사용하더라도 [리액트는 내부적으로 `class` 속성을 설정합니다.](https://github.com/facebook/react/blob/699d03ce1a175442fe3443e1d1bed14f14e9c197/packages/react-dom-bindings/src/client/ReactDOMComponent.js#L388-L389)

- [리액트의 `setProp`](https://github.com/facebook/react/blob/699d03ce1a175442fe3443e1d1bed14f14e9c197/packages/react-dom-bindings/src/client/ReactDOMComponent.js#L349)

### lit-html

Lit는 조금 다르게 처리합니다.

```html
<input type="…" .value="…" />
```

속성과 프로퍼티를 구분하기 위해 속성 대신에 프로퍼티를 설정하고 싶다면 이름 앞에 `.` 를 붙여야 합니다.

- [Lit의 Expression 문서](https://lit.dev/docs/templates/expressions/)

## 그리고 그게 다입니다

프로퍼티와 속성의 차이에 대해 제가 아는 거의 모든 것을 알려드렸습니다. 제가 놓친 부분이 있거나 궁금한 점이 있으면 아래 댓글로 알려주세요!

[팟캐스트 남편](https://offthemainthread.tech/)인 [Surma](https://surma.dev/)의 검토에 감사드립니다.
