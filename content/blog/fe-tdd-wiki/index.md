---
title: '프론트엔드 TDD 스터디 위키'
date: 2021-12-15
lastUpdated: 2021-12-27
description: '프론트엔드 TDD를 공부하며 새롭게 알게된 것들을 짧막하게 기록하는 위키'
tags: [Javascript, TestCode]
---

> 이 글의 내용은 짧막하게 토막글 기록용으로, 내용은 계속 추가 혹은 삭제될 수 있습니다.

## 컴포넌트 테스트

### 컴포넌트 테스트의 목적

- 궁극적으로, 각 컴포넌트의 관심사를 테스트한다. 따라서 컴포넌트 내부의 하위 컴포넌트들의 세부 구현 사항, 기능 등은 테스트하지 않는다. 왜냐면 그들은 하위 컴포넌트의 관심사이지 현재 컴포넌트의 관심사가 아니기 떄문.
- 의미없는 테스트를 지양한다. 커버리지 100%가 무조건 좋은 것만은 아니다. 진짜로 테스트 해야하는지, **즉 테스트의 필요성과 목적과 의미가 명확해야 한다**
- 완벽한 테스트를 짤 수는 없다. 진짜로 검증하고 싶은 작은 것부터 시작해 커버리지를 늘려나간다.

## React Testing Library (RTL)

### 컨셉

세부적인 구현사항 보다 실제 사용자 경험과 유사한 흐름의 테스트를 목표. 따라서 이 데이터가 h1 태그로 렌더링 되었는지 보다는 이 데이터가 (ex.텍스트) 그대로 잘 렌더링 되었는지를 확인한다

```js
expect(container).toHaveTextContent(
  '이렇게 특정 텍스트가 렌더링 되었는지를 확인'
);
```

### 쉽게 변하지 않는 식별자

class, id, text, placeholder, label 등등, DOM의 특정 요소를 식별할 수 있는 커맨드는 많다. 중요한 것은 기획이나 css 등이 변해도 쉽게 깨지지 않는 테스트를 작성하는 것이다. 따라서 최대한 변하지 않을 식별자를 사용하는 것이 좋다.

- role : getByRole

### container vs screen

### 리액트 테스트에서 이벤트를 발생시키는 방법들

1. HTML element event vs fireEvent
   IDE의 지원을 받아 click 메소드가 있음을 알게되었다. 이걸 이용해서 테스트를 해보니 실제로도 잘 동작하고 잘 통과되었다. 다른 점이라면 전자는 말 그대로 HTML 요소에 대해 DOM 이벤트를 편하게 발생시키기 위한 API이고, 후자는 리액트 테스트를 위해 테스팅 라이브러리에서 제공하는 API이다. 즉, '테스트'라는 목적을 위해서는 후자가 더 다양한 편의성을 지원한다. fireEvent가 두 번째 인자로 이벤트 프로퍼티를 받는 것처럼 말이다.
2. fireEvent vs userEvent
   우선 기본적으로 userEvent는 fireEvent를 바탕으로 한다. fireEvent는 가장 베이직한 api이다. 다만 다른 점은 userEvent가 좀 더 진짜 유저 행동같이 테스트할 수 있다. 예를 들어, fireEvent로 버튼을 클릭하면 버튼에 포커스가 잡히지 않지만 userEvent는 잡힌다.

### 테스트를 작성하는 전략

- 컴포넌트를 개발할 때에도 최상위 컴포넌트부터 하위 컴포넌트 순으로 개발하듯, 테스트도 그러한 접근으로 작성할 수 있다

### 통합테스트?

- App은 통합테스트가 되어야 한다. 단위테스트로 해서 모킹을 해버리면 전체에서 통합 테스트를 할 수 있는 구간이 e2e테스트밖에 없어진다. App은 모든 일의 시작점인데 여길 단위테스트로 짜버리면 다른 테스트랑 중복이 생겨버린다.
- 단위테스트와 통합테스트의 컨벤션이 다르다
  - 단위테스트 : 메세지에 기능의 명세를 쓴다.
  - 통합테스트 : 비즈니스 용어를 쓴다 (개발 요구 사항)
- 더 알아보자

### 무엇에 대해 테스트 할 것인가?

#### Public!

- 비즈니스 로직 관점으로 생각하기
  - 예시 ) 조회하면 조회수가 1 올라가는 api가 있다. GET POST PUT... 무엇인가?
  - 정답은 없지만 GET이라고 한다. 왜냐면 조회수가 1이 올라가든 2가 올라가든 그건 내부의 로직이지 외부에서 알 필요는 없기 때문. 본질은 조회수라는 데이터를 조회하는 것이기 때문에 GET이다.
  - 결과적으로 테스트코드도, public만 테스트를 작성한다.

### 리팩토링 내성

코드 수정을 했더니 테스트코드를 얼마나 많이 수정해야 하는지를 말한다. 만약 테스트코드를 다 바꿔야 한다? 그러면 내성이 없는 것이고 좋지않은 테스트코드인 것.

### getByRole과 getByText의 차이

- role을 가지고 테스트를 작성했을 때의 장점
  - 웹표준을 준수하여 코드를 작성하게된다. div로도 버튼을 만들 수 있지만 그러면 role을 가지고 테스트가 불가능하고 test id를 가지고 테스트를 작성해야 한다.
- getByText는 깨져도 되는 거, 즉 개발자가 실수했을 가능성이 있는 텍스트에 대해 사용. getByRole은 기획적으로 중요해서 만약 테스트가 꺠졌다면 그건 기획적으로 문제가 있다는 거를 증명할 수 있는 상황에 사용. 바꿀 때 정말 신중해야 하는 것을 쉽게 바꿨다? 그에 대해 경고하는 역할을 한다.

### query와 get의 차이

- query: 못찾으면 Null 반환
- get: error throw

### 디버거 공부하자

- 의도한대로 테스트 결과가 안나왔을 때 디버거를 활용하자. 콘솔로그 말고.

### RTL 잘 쓰기

- RTL에서 제공하는 쿼리는 우선순위가 있는데, 이에 익숙해지기 위해 [testing-playground.com](www.testing-playground.com)를 활용하면 좋다. [크롬 익스텐션](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano/related)도 있어서 바로 설치했다.
- RTL을 보다 잘 알고 사용하기 위해선 공식문서 외에도 [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)을 꼭 읽어야 하는 것 같다. RTL 개발자가 쓴 글인듯 한데, RTL을 사용하며 많이 하는 실수들에 대한 글이다. 한국어 번역 글도 있는데 상당히 유명한 글인듯 하다.

### 매번 mock을 초기화 하는 세 가지 방법

일단 초기화 해야 하는 이유는 각 테스트케이스가 독립적이기 때문이다. mock을 초기화 할 수 있는 방법으로는 세 가지가 있는 것 같다.

1. 하나하나 다 초기화 하는 코드를 작성한다
2. beforeEach를 활용한다
3. jest.config.js 에 설정을 추가한다 (Reference. [Jest에서 Mock을 정리하는 방법](https://haeguri.github.io/2020/12/21/clean-up-jest-mock/))

1번을 사용할 일은 없고, 보통 2번 아니면 3번을 사용할 것 같다. 2번과 3번을 비교해보면, 3번의 경우에는 '초기화 하지 않음'이 필요할 때 특정 케이스만 예외처리 하기에 곤란하겠단 생각이 들었다.

때문에 **통제권** (코드리뷰에선 통제권이라고 표현하셨는데 좋은 것 같다)을 갖기 위해서는 3번보다 2번을 활용함이 더 적절할 것 같다. 다만 이번 과제에서는 그런 예외케이스가 존재하지 않아 3번을 이용했다.

### Hook과 컨테이너의 관계

Reference. [React Hook VS Container Component](https://yujonglee.com/socwithhooks.html)

리액트에서 Container-Presenter 패턴이 유명해진 본격적인 계기가 된 유~명한 글에서는 훅의 등장 이후로 이 패턴을 쓰지 말라고 말하고 있다.  
왜냐하면 훅의 등장 이후로 컨테이너 역할을 훅이 대신해줄 수 있기 때문인데, 이와 관련해 팀 내부에서 이야기가 있었다.  
논의 과정에서 내가 생각했던 바는 커스텀 훅으로 로직을 분리했고, 해당 훅이 컨테이너의 역할을 해주기 때문에, 커스텀 훅과 presenter 컴포넌트를 묶는 별도의 컨테이너 컴포넌트가 필요하지 않을 것이니 컨테이너를 없애거나, 아니면 다른 이름으로 변경하는 것이었다.  
그 과정에서 위의 글을 공유받았는데, 내용이 아주 타당하다는 생각을 했고 트레이너 분께도 문의해보았는데 같은 생각이셨다.  
자세한 내용은 위 글을 직접 읽어보는 것이 좋고, 요약하자면 다음과 같다.

1. 뷰를 책임지는 Presenter 컴포넌트를 여러 비즈니스 로직과 함께 사용하고 싶다면, **즉 재사용할 일이 있다면** 컨테이너 컴포넌트를 따로 만들어 사용할 수 있다.

   ```jsx
   function Container() {
     const data = useData(); // 커스텀 훅이 반환하는 것이 뭐든간에

     return <Presenter data={data} />; // Presenter를 재활용 할 수 있다
   }
   ```

2. 그럴일이 없다면 커스텀 훅으로 컨테이너를 대체할 수 있다.

   ```jsx
   function Component() {
     const data = useData(); // Container 역할을 함

     return <div>{data}</div>; // Presenter
   }
   ```

### 대표적인 케이스만 테스트해도 된다

이번 과제에서 3개의 input을 핸들링 해야해서, input의 name을 활용해 하나의 이벤트 핸들러만으로 처리를 했고, 테스트는 3개의 input 모두에 대해 작성했었다.
근데 어차피 같은 로직을 쓰는 것이기 때문에 3개 중 1개만 대표적으로 테스트해도 된다고 한다.

### 이벤트 객체는 어디서 다루어야 할까?

presenter 컴포넌트에서 다루는 것이 좋다. 이벤트 객체를 이용해서 상태를 업데이트하기 때문에 상태를 다루는 이벤트 핸들러를 container 컴포넌트에 작성하고, 이벤트 객체도 거기서 다루게 했었다. 하지만 의존성 관리 측면에서, 이벤트 객체는 presenter 컴포넌트에서 처리하는 것이 더 적절하다.

### 읽을 아티클들

- [[번역] 초보자를 위한 React 어플리케이션 테스트 심층 가이드 (2)](https://blog.rhostem.com/posts/2020-10-15-beginners-guide-to-testing-react-2)
- [Inside a dev's mind - Refactoring and debugging a React test](https://jkettmann.com/refactoring-and-debugging-a-react-test)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [jest mock 초기화](https://haeguri.github.io/2020/12/21/clean-up-jest-mock/)
