---
  title: 코어자바스크립트 - 콜백함수
  description: 코어자바스크립트 스터디 4장
  date: 2021-08-17
  lastUpdated: 2021-08-17
  tags: [Javascript, Book]
---

> 📖 이 글은 코어자바스크립트를 읽고 책을 바탕으로 이해한 내용을 작성한 글입니다.

코어자바스크립트 4장은 앞, 뒤로 다른 장에서 다루는 내용들이 많아서인지 다른 장에 비해 쉬어가는 느낌이 있었다...가 아니라, 폭풍전야의 느낌이었다. 특히 곧 다가올 5장이 클로저라는 무서운😈 친구여서 더욱 더.

이 글에서는 책을 읽고 배운 내용을 간단하게 정리해보고 대신 콜백함수 하면 빼놓을 수 없는 Promise, async, await에 대해 톺아보려고 한다.

## 콜백함수의 제어권

앞서 3장 포스팅에서 콜백함수의 정의를 간략하게 이야기했었다.

> 코어자바스크립트에서는 콜백함수란 **제어권을 다른 함수에게 넘겨준 함수**라고 말하고 있다. 정확하게는 함수 A의 제어권을 다른 함수(메소드 포함) B에게 넘겨주었을 때 이 A함수를 콜백함수라고 한다는 것이다. 때문에 A함수는 B함수의 내부 로직에 따라 실행되며 this도 B함수 내부 로직에 의해 결정된다. 만약 B함수에서 A함수의 this를 별도 지정한다면 그게 A함수의 this가 된다.

때문에 4장에서는 콜백함수의 제어권에 대한 이야기가 주가 되었다. 로마에 가면 로마의 법을 따르라는 말처럼, 콜백함수의 제어권을 넘긴다는 것은 꽤 많은 부분 콜백함수의 제어권을 쥐고 있는 함수의 정책을 따라야 하는 것이었다.

- 콜백 함수 A의 호출 시점은 함수 B가 결정한다.
- 콜백 함수 A의 인자로 넘겨줄 값과 그 순서도 함수 B가 결정한다.
- 콜백 함수 A의 this 또한 함수 B가 결정할 수 있다.

## 콜백함수도 함수다 🧐

이 부분이 특히 인상깊었는데, 저자 스스로도 '당연한 말일 수도 있겠지만' 하면서도 이 부분을 강조한 것은 this 때문이다. 객체의 메소드로 실행할 때와 함수로 실행할 때 this가 달라진다는 것을 3장에서 공부했었다. 때문에 콜백함수로 객체의 메소드를 넘긴다면 this가 여전히 그 객체일 것이라고 오해하기 쉽다.

그러나 콜백함수는 함수이지, 객체의 메소드가 아니기 때문에 객체의 메소드를 콜백함수로 넘겼다 해도 그건 메소드가 아니라 함수로 실행된다. 즉, this를 따로 명시적 바인딩을 해주지 않는 이상 this는 전역객체를 가리키게 된다는 것이다.

### 그게 싫으면 🤔?

역시나 그게 싫은 개발자들이 여러 대안을 마련했었다.

객체의 메소드를 콜백으로 넘기더라도 여전히 this가 객체를 가리키게 하고 싶다면 결국 this를 바인딩해줘야 한다. 하지만 위에서도 이야기했듯 콜백함수의 권한은 호출하는 함수가 갖는다. 때문에 원래는 개발자 마음대로 콜백함수의 this를 설정할 수 없다.

<div align="center">
<img src="https://t1.daumcdn.net/cfile/tistory/99A96C395C7230FC10">
</div>

하지만 인간은 답을 찾는다. 늘 그랬듯이. (ㅋㅋ)

전통적 방식은 함수 안에서 this를 변수에 담아 그 변수를 this로 이용하는 것이다. 그후 함수를 리턴하면 클로저가 되기 때문에 this를 개발자 마음대로 설정하고 유지할 수 있다. 하지만 이 방법은 불필요하게 복잡하고 번거롭다. 메모리를 낭비시킨다는 문제도 있다 (정확하게는, 메모리 낭비는 의도한 것이지만 이는 추후 5장 클로저에서 다룰 것이다).

그러나 별 대안이 없었기 때문에 계속 이용했었는데, 현재는 bind 메소드가 등장했기 때문에 이를 이용하면 쉽게 콜백함수에도 this를 설정할 수 있다.

```js
btn.addEventListener('click', test.bind(obj));
```

## 콜백함수는 지옥을 만든다 😈

콜백 지옥. Callback Hell.

<figure align="center">
<img src="https://user-images.githubusercontent.com/76927618/129585419-29c4ab36-621e-42d2-a27b-b931c7d29154.png">
<figcaption>구글에 검색만 해봐도 어마무시한 코드들이 보인다</figcaption>
</figure>

자바스크립트는 기본적으로 동기적으로 동작하지만 싱글 스레드 언어이기 때문에 수많은 비동기적 핸들링이 함께한다. 때문에 자바스크립트의 비동기 함수를 얼마나 잘 다루느냐가 관건인데, 가장 대표적으로 신경쓰는 부분이라고 한다면 역시 비동기 함수를 동기적으로 핸들링하는 것일테다.

비동기 함수들을 동기적으로 다루기 위해서, 즉 실행 순서를 보장하기 위해서, 개발자가 원하는 순서에 비동기 함수의 값을 이용하기 위해서 ! 콜백 함수가 이용되어 왔었다. 하지만 이 콜백 함수로 익명함수를 계속 전달하다보니 **indent가 끝도 없이 깊어져** 가독성이 💩망진창이 되어버렸다. 또한, **값이 전달되는 순서가 아래에서 위**이므로 (가장 안쪽 콜백부터 시작될테니까), 위에서 아래로 읽는 것에 익숙한 우리 인간들은 최악의 가독성에 골머리를 앓았다.

### 전통적 해결책

**처음의 해결책**은 익명함수가 아니라 기명함수를 쓰는 것이었다. 다음은 책의 예시코드이다.

```js
var coffeeList = "";

var addEspresso = function (name) {
  coffeeList = name;
  setTimeout(addAmericano, 500, "아메리카노");
};

var addAmericano = function (name) {
  coffeeList += ", " + name;
  setTimeout(addMocha, 500, "카페모카");
};

...

이런식으로 계속 이어진다.
```

기명함수를 이용해서 넘겨주고, 넘겨주고 하다보면 깊어지는 indent도 사라지고 코드를 위에서 아래로 읽을 수 있게 되었지만 썩 쿨한 방법은 아니다. 왜냐하면 불필요하게 일회성 함수를 변수에 계속 할당해야 하고, 읽을 때 `addAmericano`가 뭐지? 하고 보러가고 그런식으로 **코드를 따라다녀야 해서** 오히려 헷갈릴 수 있기 때문이다. (필자는 다른 상황에 같은 이유로 이건 절차지향적인 코드라 다르게 수정하는 것이 훨씬 보기 좋을 것 같다는 코드리뷰를 받은 적 있었다)

다행스럽게도 이것보다 훨씬 쿨🧚🏻하게 콜백지옥을 해결해줄 수 있는 Promise와 제네레이터가 es6에서 등장했다.

### Promise

프로미스는 비동기 동작을 값으로 다룰 수 있게 **도와준다**.  
값으로 반환하는 것이 아니라 다룰 수 있게 도와준다고 표현하는 이유는, 프로미스는 비동기 작업의 처리가 완료된 **그 상태 그대로 홀딩**된 객체이기 때문이다. 즉, 프로미스를 리턴받았다고 해서 그거 콘솔에 찍어보면 값이 나오지 않는다는 이야기이다. 값을 보고싶다면 소비 메소드를 사용해야 한다. 좀 더 비유해서 이야기하자면 프로미스는 비동기 작업과 개발자 사이의 연결고리이다. 개발자는 프로미스를 통해 언제 도착할지 모르는 비동기 작업을 개발자가 원하는 시점에 다룰 수 있게 된다.

프로미스 객체를 만들고 그 안에 작성되는 코드는 즉시 실행되지만<sub>(그래서 조심해야 한다. 왜냐면 사용자가 요구하지도 않았는데 불필요한 네트워크 통신이 일어날 수 있기 때문이다.)</sub> 실제 그 값이 유효하게 사용되려면 프로미스가 기본적으로 갖고 있는 두 인자, resolve/reject 콜백함수를 사용해 처리하고 값을 consumer에게 넘겨줘야 한다. 이들을 이용해 성공 또는 실패 값을 뽑아내야 프로미스의 consumer(소비 메소드)인 then,catch를 이용해 개발자가 원하는 작업을 이어나갈 수 있다.

```js
const promise = new Promise(function (resolve, reject) {
  executor; // Promise가 처리할 비동기 동작 코드
});
```

<figure align="center">
<img src="https://mdn.mozillademos.org/files/8633/promises.png
">
</figure>

- resolve, reject 둘 중 하나는 무조건 사용해야 consumer를 사용할 수 있다
- 프로미스는 대기(pending), 이행(fulfilled), 거부(rejected) 셋 중 하나의 상태(state)를 가진다.
- 이행, 거부된 상태를 처리된(settled) 프로미스라고 한다.
- resolve : 정상 수행 후 최종 결과 반환한다. then으로 받아서 원하는 일을 할 수 있다.
- reject : 문제발생시 호출. Error object를 반환한다. catch로 받는다.
- then : 첫 번째 인수는 프로미스 성공시의 결과를, 두 번째 인수는 실패시의 에러를 받는다. 인수를 하나만 전달하면 성공시의 결과만 다룬다.
- catch : 에러가 발생한 경우만 다룬다.
- finally : 성공,실패와 상관없이 무조건 마지막에 호출된다.

이를 이용해 개발자는 비동기 동작을 동기적으로 다룰 수 있게 되었다. 하지만 프로미스가 완벽한 것은 아니었는데, 이에 대해서는 후술한다.

### 제네레이터

자바스크립트의 제네레이터는 이터러블을 쉽게 만들 수 있도록 도와주는 함수이자, 이터레이터이다.  
제네레이터를 이용해 비동기 동작을 동기적으로 다룰 수 있는데, 필자는 아직 자세하게는 모르고 코어자바스크립트에 소개된 내용에 대해서만 알고 있다. 보다 자세한 활용방법은 유인동님의 함수형 프로그래밍 강의에서 다뤄지고 있다.  
이터러블과 이터레이터, 많이 낯설다. 제네레이터를 이해하기 위해(?) 잠깐만 훑고 지나가겠다. 레퍼런스는 유인동님의 함수형 프로그래밍 강의, 그리고 [이 글](https://gist.github.com/qodot/ecf8d90ce291196817f8cf6117036997)이다.

**이터러블**

- 이터러블은 **이터레이터 객체를 반환**하는 객체이다.
- `Symbol.iterator`는 대표적인 상용 심볼로, 이터러블한 객체를 정의하기 위한 심볼이다. `@@iterator`로 표기할 수도 있다.
- 이터러블은 `Symbol.iterator` 심볼을 속성으로 가지고 있고, 이런 스펙을 이터러블 프로토콜 이라고 하고 이 프로토콜을 지킨 객체를 이터러블 객체라고 한다.
- 다른 말로는 `[Symbol.iterator]()`를 가진 값이다.
- `Symbol.iterator`은 key로 쓰일 수 있는데 `이터러블[Symbol.iterator]`를 콘솔에 찍어보면 함수가 나온다. **이를 실행했을 때 이터레이터를 리턴**한다. 그러니까 대충 아래와 같이 생긴 것이다.
  ```js
  const iterable = {
    [Symbol.iterator]() {
      return {
        next() {
          return { value, done };
        },
      };
    },
  };
  ```
- 핵심은 이터러블은, **진행하다가 순회할 수 있다**는 것이다. 어느정도 진행하고, 잠시 중단된 그 부분부터 다시 순회할 수 있다. 이게 가능하려면 이터러블이 반환하는 이터레이터가 `Symbol.iterator`를 가지고 있어야 한다. 이걸 well formed iterator라고 한다. 그리고 그 결과는 이터레이터 자기 자신이다. `이터레이터[Symbol.iterator]() == 이터레이터 // true`

**이터레이터**

- 이터러블의 `[Symbol.iterator]()`로 이터레이터가 만들어진다.
- 이터레이터는 `{value, done}` 객체를 리턴하는 `next()` 메소드를 가진 객체이다.
- 이런 스펙을 이터레이터 프로토콜이라고 한다.
- next 메소드를 실행하면 `{value, done}`을 리턴한다.

그러니까 이터러블은 next() 메소드를 구현하고 done과 value 속성을 가진 **객체를 반환하는 객체를 반환하는 객체**인 것이다.

<p align="center">
<img src="http://file3.instiz.net/data/file3/2019/09/28/c/6/f/c6f268b978bc685dabedfe2fd92609b4.gif">
</p>

이터러블과 이터레이터가 뭔지 얕게나마 훑어보았으니 다시 이 글의 본 목적의 세부항목인 제네레이터로 돌아온다.  
제네레이터는 이렇게 생길 수 있는데,

```js
function* gen() {
  let i = 3;
  while (i > 0) {
    yield i--;
  }
}
```

저 yield 키워드가 핵심이다. yield는 제네레이터를 **중지하거나 재개하는데** 사용되는 키워드로, 키워드 뒤에 오는 표현식이 반환되고 만약 없다면 undefined가 반환된다. 제네레이터는 이터레이터이자 이터러블을 만들기 때문에 개발자는 yield를 이용해 비동기 동작을 수행한 후 다음 동작을 부르는 등, 원하는 순서에 비동기 동작들을 순서대로 이용할 수 있다.

이렇게 promise와 제네레이터는 비동기 관련 코드를 위에서 아래로 읽을 수 있게 하는 것은 물론이고 전통적인 해결 방법의 단점들도 해결한다.

### async, await

<div align="center">
<img src="https://pics.me.me/es7-promise-async-await-es6-promise-es5-callback-hell-async-27790051.png">
</div>

그러나 promise의 then 체이닝이나, promise를 여러번 중첩해서 사용해야 하는 경우 콜백지옥과 똑같은 문제가 발생하기 때문에 es7에서는 async, await이 추가되었다.

- 프로미스를 기반으로 하는 syntax sugar의 일종이다
- then이 **거의** 필요하지 않다
- 프로미스를 따로 만들지 않아도 async 키워드가 붙은 함수는 항상 프로미스를 반환한다. 캐치되지 않은 예외가 발생해도 마찬가지이다.
- **때문에 async 함수를 호출했을 때의 반환값은 반드시 프로미스이다.**
- await은 프로미스의 result값을 얻게 해주는 역할을 하며 aysnc안에서만 사용할 수 있다.
- promise 앞에 await을 붙이면 그 프로미스가 settled될 때까지 기다린다.
- await은 키워드 뒤의 내용을 프로미스로 자동 전환하고 프로미스가 resolved 된 후 다음 코드를 실행하게 한다.
- 이를 이용해 함수 내부에서 실질적인 비동기 작업이 필요한 위치마다 await을 표기하여 비동기적 동작들을 동기적으로 핸들링할 수 있다.

> await은 이터러블, 제네레이터를 이용한 함수형 프로그래밍과 연관이 있다고 한다.  
> 자세한 것은 강의를 끝까지 듣게 되면 이 글에 다시 추가하겠다. 우선은 코어자바스크립트 책 내용을 보고 알게된 내용부터 !

🚨**async, await, try-catch를 함께 사용할 때 주의할 점이 있다.**

프로미스가 성공할 때에는 프로미스를 리턴할 때 await을 붙이든 안 붙이든 차이가 없지만, 만약 실패하여 에러 객체를 catch로 다뤄야 하는 경우에는 리턴할 때 await을 붙여야 한다. 왜냐하면 try-catch에서 `catch(error) {...}`는 오직 await 처리된 rejected promise 만을 받기 때문이다. 이에 대한 더 자세한 내용과 데모 코드는 [이 글](https://dmitripavlutin.com/return-await-promise-javascript/)에서 확인할 수 있다.