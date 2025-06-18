---
title: 자바스크립트 개발자를 위한 Go 가이드
description:
date: 2025-06-18
lastUpdated: 2025-06-18
tags: [번역, Typescript]
---

> [원문: A JavaScript Developer's Guide to Go](https://prateeksurana.me/blog/guide-to-go-for-javascript-developers/)

저는 5년간 자바스크립트 개발자로 프런트엔드와 백엔드 시스템을 구축한 후, 지난 1년 동안 서버 사이드 코드를 위해 Go로 전환하는 시간을 보냈습니다. 그 기간 동안 저는 두 언어 간의 문법, 기본 개념, 관행, 런타임 환경의 차이점과 이것이 실제 런타임 성능과 개발자 생산성에 미치는 영향을 자연스럽게 알게 되었습니다.

최근 마이크로소프트가 [공식 타입스크립트 컴파일러를 Go로 포팅한다고](https://devblogs.microsoft.com/typescript/typescript-native-port/) 발표하며 기존 컴파일러보다 최대 10배 빠른 속도를 약속했을 때, Go는 자바스크립트 커뮤니티의 주목을 받기도 했습니다.

따라서 이 블로그의 목적은 Go에 대해 궁금해하거나 더 배우고 싶어 하는 자바스크립트 개발자들을 위한 시작점을 제공하는 것입니다. 저는 Go의 필수적인 기본 개념을 다루면서 자바스크립트/타입스크립트의 유사한 개념과 비교하고, 제 자바스크립트에 익숙한 뇌가 적응해야 했던 몇 가지 함정들을 공유하려고 합니다.

이 블로그는 언어의 다양한 측면을 탐색하고 비교하는 섹션으로 나뉩니다.

자바스크립트에는 여러 런타임이 있으므로, 혼동을 피하기 위해 저는 주로 백엔드에 사용되는 Go를 Node.js와 비교할 것이며, 요즘은 타입스크립트가 표준이므로 대부분 타입스크립트 예제를 사용할 것입니다.

## 기본 사항

### 컴파일 및 실행

가장 먼저 이해해야 할 근본적인 차이점은 코드가 실행되는 방식입니다. Go는 컴파일 언어이므로 먼저 네이티브 머신 코드 바이너리로 컴파일된 후 실행될 수 있습니다. 반면 자바스크립트는 인터프리터 언어이므로 컴파일 단계 없이 실행됩니다(v8이 JIT(Just-In-Time) 컴파일을 통해 [핫 패스(hot path)를 식별하고 머신 코드를 생성하는 등](https://sujeet.pro/post/deep-dives/v8-internals/) 특정 최적화를 수행하지만, 이는 이 글의 범위를 벗어납니다).

예를 들어, Node.js에서는 자바스크립트 파일을 만든 다음 `node` CLI를 사용하여 직접 실행할 수 있습니다.

```js
// hello.js

console.log('Hello, World!');
```

그리고 직접 실행할 수 있습니다.

```
> node hello.js
  Hello, World!
```

Go를 시작하려면 [https://go.dev/dl/](https://go.dev/dl/)에서 여러분의 시스템에 맞는 Go 바이너리 릴리스를 다운로드해야 합니다.

Go에서의 hello, world 프로그램은 다음과 같습니다.

```go
// hello.go

package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/VRAOHHr3xO4)

(위에서 사용된 문법의 세부 사항은 다음 섹션에서 다룰 것입니다)

이 프로그램을 실행하려면, 먼저 빌드한 다음 결과 바이너리를 실행해야 합니다.

```go
> go build hello.go

> ./hello
  Hello, World!
```

또는 `run` 명령을 사용하여 컴파일과 실행을 한 번에 할 수도 있습니다.

```go
> go run hello.go
  Hello, World!
```

Go는 네이티브 머신 코드로 컴파일되므로, 다른 플랫폼에서 코드를 실행하려면 다른 아키텍처에 맞는 바이너리를 각각 컴파일해야 합니다. 다행히 Go는 [`GOOS`와 `GOARCH` 환경 변수](https://www.digitalocean.com/community/tutorials/building-go-applications-for-different-operating-systems-and-architectures)를 통해 이 과정을 상당히 간단하게 만듭니다.

### 패키지

모든 Go 프로그램은 패키지로 구성되며, main 패키지를 실행하는 것으로 시작됩니다. main 패키지 안에는 반드시 `main`이라는 함수가 있어야 하며, 이 함수가 프로그램의 진입점 역할을 합니다. main 함수가 반환되면 프로그램은 종료됩니다.

```go
// main.go

package main

import (
  "fmt"
)

func main() {
  fmt.Println("Hello world")
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/VRAOHHr3xO4)

> 💡 이 블로그의 나머지 예제에서는 간결함을 위해 `package main`과 `func main()`이 생략될 수 있습니다. 코드 조각 옆에 있는 ▶️ 플레이 그라운드 링크를 사용하여 예제를 실행해 볼 수 있습니다.

Go의 패키지는 자바스크립트의 모듈과 유사하며, 관련된 소스 파일의 모음입니다. 자바스크립트에서 모듈을 가져오는 것처럼 패키지를 만들고 가져올 수 있습니다. 위의 코드 조각에서도 Go의 표준 라이브러리에서 `fmt` 패키지를 가져왔습니다.

> 💡 `fmt`(format의 약자)는 Go의 핵심 패키지 중 하나입니다. C의 `printf`와 `scanf`에서 영감을 받아 형식화된 입출력에 사용됩니다. 위의 `Println` 함수는 인자를 기본 형식으로 출력하고 끝에 줄 바꿈 문자를 추가합니다.
>
> 이 글 전반에 걸쳐 기본 지정자(specifier)를 사용하여 형식화된 출력을 인쇄하는 `Printf`도 보게 될 것입니다(사용 가능한 지정자에 대한 자세한 내용은 [공식 문서](https://pkg.go.dev/fmt)에서 읽을 수 있습니다).

`package.json`과 유사하게, Go 프로그램에는 Go 모듈의 설정 파일 역할을 하는 `go.mod` 파일이 있으며, 여기에는 모듈과 그 의존성에 대한 정보가 포함됩니다. 일반적인 Go 모듈 파일은 다음과 같습니다.

```go
module myproject

go 1.16

require (
    github.com/gin-gonic/gin v1.7.4
    golang.org/x/text v0.3.7
)
```

첫 번째 줄은 모듈을 고유하게 식별하는 모듈의 가져오기 경로를 선언하고, 두 번째 줄은 모듈에 필요한 최소 Go 버전을 나타냅니다. 마지막으로 특정 버전의 직접 및 간접 의존성들이 나열됩니다.

Go에서 패키지를 만들려면 패키지 이름으로 새 디렉터리를 만들어야 하며, 해당 디렉터리의 모든 Go 파일은 파일 상단에 패키지 이름을 선언함으로써 그 패키지의 일부가 됩니다.

패키지에서 무언가를 내보내는 방식도 Go에서는 흥미롭습니다. 자바스크립트에서 ESModule을 사용하는 경우 `export` 키워드를 사용하여 모듈 외부에서 사용할 수 있도록 합니다. 하지만 Go에서는 이름이 대문자로 시작하면 내보내집니다.

다음 예제는 위에서 논의한 모든 것을 보여줍니다.

```go
// go.mod

module myproject

go 1.24

// main.go

package main

import (
  "fmt"
  "myproject/fib"
)

func main() {
  sequence := fib.FibonacciSequence(10)

  // 이것은 에러를 발생시킵니다
  // firstFibonacciNumber := fib.fibonacci(1)

  fmt.Println("Fibonacci sequence of first 10 numbers:")
  fmt.Println(sequence)
}

// fib/fib.go

package fib

// 이 함수는 대문자로 시작하지 않으므로 내보내지지 않습니다 (not exported)
func fibonacci(n int) int {
    if n <= 0 {
        return 0
    }
    if n == 1 {
        return 1
    }

    return fibonacci(n-1) + fibonacci(n-2)
}

// 이 함수는 대문자로 시작하므로 내보내집니다 (exported)
func FibonacciSequence(n int) []int {
    sequence := make([]int, n)

    for i := 0; i < n; i++ {
        sequence[i] = fibonacci(i)
    }

    return sequence
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/N_t92lh9TVZ)

위 예제에서는 `fib`라는 이름의 디렉터리를 만들어 같은 이름의 다른 패키지를 만들었습니다. 또한 자세히 보면 `FibonacciSequence` 함수만 대문자로 시작하기 때문에 내보내져 패키지 외부에서 접근할 수 있습니다.

### 변수

Go는 정적 타입 언어입니다. 즉, 모든 변수의 타입을 선언(또는 추론)하며 이 타입들은 컴파일 단계에서 확인됩니다. 이는 변수가 어떤 타입의 값이든 가질 수 있고 프로그램이 실행될 때만 평가되는 자바스크립트와 다릅니다.

그래서 예를 들어, 자바스크립트에서는 다음과 같은 작업을 문제없이 할 수 있습니다.

```js
let x = 5;
let y = 2.5;
let sum = x + y; // 문제없이 작동: 7.5
let weird = x + '2'; // 이것도 "작동"함: "52" (하지만 원했던 결과가 아닐 수 있음!)
```

하지만 Go에서는 타입을 매우 명시적으로 다루어야 합니다. 여기에서 모든 [기본 타입](https://go.dev/tour/basics/11)을 찾을 수 있으며, `var`는 최신 자바스크립트의 `let`과 동일합니다.

```go
var x int = 5
// 또는 x := 5 는 암시적 타입의 var 선언을 대체할 수 있는 짧은 할당문입니다.

var y float64 = 2.5

// 이것은 컴파일되지 않습니다.
sum := x + y  // 에러: mismatched types int and float64

// 반드시 명시적으로 변환해야 합니다.
sum := float64(x) + y
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/pcBQ1yzifU2)

> 💡 타입스크립트가 타입 문제를 해결하는 데 도움이 된다는 점은 언급해야 하지만, 그것은 결국 자바스크립트로 컴파일되는 자바스크립트의 구문적 상위 집합일 뿐입니다.

자바스크립트의 `const`와 유사하게, Go에도 상수를 선언하는 데 사용되는 `const`가 있습니다. `var`와 유사하게 선언하지만 `const` 키워드를 사용합니다.

```go
const pi float64 = 3.14

// 또는 타입을 명시하지 않고 직접 추론하도록 선언
const s = "hello"
```

하지만 자바스크립트의 `const`와 달리 Go는 기본 값(문자, 문자열, 불리언 또는 숫자 값)에만 사용할 수 있으며 다른 복합 타입에는 사용할 수 없습니다.

> 💡 Go에서는 변수를 선언하고 사용하지 않으면 자바스크립트나 타입스크립트의 일부 린터가 경고를 보내는 것과 달리 컴파일 에러가 발생합니다.

### 구조체(Structs)와 타입

자바스크립트 객체를 사용하여 필드의 집합을 나타내는 것처럼, Go에서는 구조체를 사용하여 필드의 집합을 나타낼 수 있습니다.

```go
type Person struct {
  Name string
  Age  int
}

p := Person{
  Name: "John",
  Age: 32,
}

// 또는 복합 구조체 생성

type User struct {
  Person Person
  ID     string
}

u := User{
  Person: p,
  ID:     "123",
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/Ts4lLCOVenj)

> 💡 Go에서는 구조체 필드 이름도 대문자로 시작해야 내보내기(다른 패키지에서 접근하거나 JSON 마샬링을 위해)가 가능합니다. 소문자 구조체 필드는 내보내지지 않으며 패키지 전용입니다.

처음에는 문법이 타입스크립트의 타입/인터페이스와 비슷해 보일 수 있지만, 동작 방식은 다릅니다. 타입스크립트에서 타입은 값의 형태(shape)만 지정하므로, 다른 타입의 상위 집합을 전달해도 작동합니다. Go에서 구조체는 구체적인 데이터 타입이며, 할당 호환성은 구조적이 아닌 이름 기반입니다. 그래서 다음 코드는 타입스크립트에서는 작동하지만,

```ts
interface Person {
  name: string;
  age: number;
}

interface User {
  name: string;
  age: number;
  username: string;
}

function helloPerson(p: Person) {
  console.log(p);
}

helloPerson({
  name: 'John',
  age: 32,
});

const x: User = {
  name: 'John',
  age: 32,
  username: 'john',
};

helloPerson(x);
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?#code/JYOwLgpgTgZghgYwgAgArQM4HsTIN4BQyyIcAthAFzIZhSgDmANEcnA1SQK5kBG0BAL4ECoSLEQoAqhmj5WpCtVr0QzVu04ge-KC2JdZURZxWMhImFxAIwwHMgAWEADYus6KNhAAKAA7Unt4AlPLECDjYLhAAdO4M-sEWBM5uHpg4PoTEJtQARABSWI4gefpsHNQAzABMQkkEESC0yAAe1DJyALxhJOSchcWl5ZrVNeWG0LnIeQBWQ2XJqe5Bma3BQA)

이 예제는 아래 Go 코드에서 작동하지 않습니다.

```go
type Person struct {
    Name string
    Age  int
}

type User struct {
    Name     string
    Age      int
    Username string
}

func HelloPerson(p Person) {
    fmt.Println(p)
}

func main() {
    // 이것은 잘 작동합니다
    HelloPerson(Person{
        Name: "John",
        Age:  32,
    })

    // 이것은 작동하지 않습니다
    x := User{
        Name:     "John",
        Age:      32,
        Username: "john",
    }

    // 에러: cannot use x (type User) as type Person in argument to HelloPerson
    HelloPerson(x)

    // 작동하게 하려면 명시적으로 변환해야 합니다.
    // HelloPerson(Person{Name: x.Name, Age: x.Age})
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/0xrXOeygwd2)

Go의 타입은 구조체뿐만 아니라, 변수가 가질 수 있는 모든 종류의 값에 대한 타입을 정의할 수 있습니다.

```go
type ID int

var i ID
i = 2
```

일반적인 사용 사례는 문자열 기반 열거형을 만드는 것입니다.

```go
type Status string

const (
  StatusPending  Status = "pending"
  StatusApproved Status = "approved"
  StatusRejected Status = "rejected"
)

type Response struct {
  Status Status
  Meta   string
}

res := Response{
  Status: StatusApproved,
  Meta:   "Request successful",
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/RTqn_jvfbs9)

하지만 타입스크립트의 구별된 유니언과 달리, Go의 커스텀 타입(`Status`와 같은)은 기본 타입의 별칭일 뿐입니다. 컴파일러는 `Status` 변수에 아무 문자열이나 할당하는 것을 막지 않습니다.

```go
var s Status
s = "hello" // 이것은 문제없이 컴파일됩니다
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/KqOpDOvsMUv)

타입스크립트의 타입 시스템은 튜링 완전(Turing complete)하여, 기존 타입을 확장하거나 조작하여 새로운 타입을 만들고 타입 레벨에서 완전히 복잡한 계산을 수행할 수 있습니다. 이를 통해 고급 타입 유효성 검사 및 안전한 타입의 추상화가 가능합니다.

```ts
type Person = {
  firstName: string;
  lastName: string;
  age: number;
};

// Person의 모든 속성을 가지면서 추가 속성을 갖는 확장된 타입
type Doctor = Person & {
  speciality: string;
};

type Res =
  | { status: 'success'; data: Person }
  | { status: 'error'; error: string };

// Res는 status에 따라 다른 속성에 접근할 수 있게 하는 구별된 유니언입니다
function getData(res: Res) {
  switch (res.status) {
    case 'success':
      console.log(res.data);
      break;
    case 'error':
      console.log(res.error);
      break;
  }
}

// 모든 속성이 선택적인 타입
type OptionalDoctor = Partial<Doctor>;

// firstName과 speciality 속성만 있는 타입
type MinimalDoctor = Pick<Doctor, 'firstName' | 'speciality'>;
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAChBOBnA9gOygXigbwFBSgDMBLJYAOQEMBbCALikWHmNQHMBufKAG0qaq0GTFuy4FKbelFQBXagCMEXAL65cAeg1QAogA9gEVABMIxqKEhQA7gAtiAY1tRb-KJR48oYeMkjxgYghEKGRCWAQUVE1ta2JgZ0pjY3jiNA9vX39A4NxLaAARZAdgZHhMCKQ0KAAyHG5ESAdiD3iQYWZWTlw1PPBoACVgiuxGYEpgWUQGACJEWQcHYMQZgBooYwnKBjgq9BUoAB8cMYmp2YRfeDWoS7KO0TYoXq0oIZDiEMoNz4cWalYEzMUFkqDS6A8PGQcXYUBAyFkFmQLkoADcIDF3ItlkifoRCAgjMBMn4EDkQgp+MDqgloEwzohcIRQSVwVApMAClsABTwYIMd4ASnqBEQcWATigvOCADp6ZNEMK8AQCA4qVA5gslogVnRuCqoA40CgeBAZVC2NLEDLNuNBfqVQo+ZQANbiFVqxDQGZ3a56g2q43IU3m5CWvnW332gNQJ0QV3utQvbQAQQs-SgrBs9klkJJ2SCXz5oTAgXSPD6VgA8qXwR4iiUyhUYJQAi0eAAeBuleAAPnUrzT+Rs8WcaB4ICIpAENGglBMjCa7ba+bJhcr0AAsqxiNR68Ue83HC6uweyusZiQyIIIDMjhrGhBmq1QDNe0A)

Go의 구조체는 주로 데이터 컨테이너이며 타입스크립트 타입과 같은 조작 기능이 없습니다. 가장 가까운 것은 구조체 임베딩이며, 이는 Go에서 컴포지션과 일종의 상속을 달성하는 방법입니다.

```go
type Person struct {
  FirstName string
  LastName  string
}

type Doctor struct {
  Person
  Speciality string
}

d := Doctor{
  Person: Person{
    FirstName: "Bruce",
    LastName:  "Banner",
  },
  Speciality: "gamma",
}

fmt.Println(d.Person.FirstName) // Bruce

// 임베드된 구조체의 키는 상위로 올라갑니다 (promoted)
// 그래서 이것도 작동합니다
fmt.Println(d.FirstName) // Bruce
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/_LJbGUj9-S1)

### 제로 값

초기에 여러분의 자바스크립트 뇌를 혼란스럽게 할 수 있는 또 다른 개념은 Go의 제로 값입니다. 자바스크립트에서는 변수를 정의하면 기본적으로 그 값은 `undefined`가 됩니다.

```ts
let x: number | undefined;

console.log(x); // undefined

x = 3;

console.log(x); // 3
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?#code/DYUwLgBAHgXBB2BXAtgIxAJwgHwo+AJiAGYCW8IBA3AFA0DGA9vAM6OgB0wjA5gBRQAlFQgB6UXkIlylOlAgBeCAGY6TVuxBdeAwWInKgA)

하지만 Go에서는 명시적인 값 없이 변수를 초기화하면 해당 타입의 제로 값이 할당됩니다. 몇 가지 기본 타입의 기본값은 다음과 같습니다.

```go
var i int // 0
var f float64 // 0
var b bool // false
var s string // ""

x := i + 7 // 7
y := !b // true
z := s + "string" // string
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/NXPb9UiWj0z)
마찬가지로 구조체도 필드에 대한 제로 값을 기본적으로 가집니다.

```go
type Person struct {
    name string  // ""
    age  int     // 0
}

p := Person{} // 빈 문자열 이름과 0의 나이를 가진 Person 생성
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/-Qj1pxeMWkR)

Go에는 자바스크립트의 `null`과 유사한 `nil`이 있지만, 참조 타입 변수만 `nil` 값을 가질 수 있습니다. 이것이 무엇인지 이해하기 위해 Go의 포인터를 살펴볼 필요가 있습니다.

### 포인터

Go에는 C나 C++와 같은 언어와 유사한 포인터가 있으며, 포인터는 값의 메모리 주소를 가집니다.

`*T` 구문을 사용하여 타입 `T`에 대한 포인터를 선언할 수 있습니다. Go에서 모든 포인터의 제로 값은 `nil`입니다.

```go
var i *int

i == nil // true
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/QEpRTztXggP)

`&` 연산자는 피연산자에 대한 포인터를 생성하고, `*` 연산자는 포인터의 기본 값을 가져오며, 이를 포인터 역참조라고도 합니다.

```go
x := 42
i := &x
fmt.Println(*i) // 42

*i = 84
fmt.Println(x) // 84
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/VjT8Pafk3xN)

하지만 포인터가 `nil`일 때 역참조를 시도하면, 유명한 ['null pointer dereference'](https://www.youtube.com/watch?v=bLHL75H_VEM) 에러가 발생한다는 점을 명심해야 합니다.

```go
var x *string

fmt.Println(*x) // panic: runtime error: invalid memory address or nil pointer dereference
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/DdJGZo9cpkp)

이는 자바스크립트 개발자에게 중요한 차이점으로 이어집니다. 자바스크립트에서는 기본 값을 제외한 모든 것이 암시적으로 참조에 의해 전달되지만, Go는 포인터를 통해 이를 명시적으로 만듭니다. 예를 들어, 자바스크립트의 객체는 참조로 전달되므로 함수 내부에서 객체를 수정하면 원본 객체가 수정됩니다.

```js
let obj = { value: 42 };

function modifyObject(o) {
  o.value = 84; // 원본 객체가 수정됨
}

modifyObject(obj);
console.log(obj.value); // 84
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?#code/DYUwLgBA9gRgVhAvBA3hAbgQ2AVxALggBYAmCAXwChKAzHAOwGMwBLKeiAWygBMWaAngHl4IZgAooASlSUI86ADosuEEggAOIvID0OiEIBOLAOYt62aKOYQWAZy69+LED0pVK3PoJFwxYSXgpSkZ2OyhQRWAoE0C4ZWw8GQg9TSIgA)

Go에서는 포인터를 사용하지 않는 한 거의 모든 것이 값에 의해 전달되므로 (슬라이스, 맵, 채널 제외. 이는 다음 섹션에서 다룸), 다음 코드는 Go에서 작동하지 않습니다.

```go
type Object struct {
  Value int
}

func modifyObject(o Object) {
  o.Value = 84
}

o := Object{Value: 42}
modifyObject(o)
fmt.Println(o.Value) // 42
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/-nt_ZN68xMx)

다음과 같이 포인터를 사용하지 않는 한 말이죠.

```go
func modifyObjectPtr(o *Object) {
    o.Value = 84  // Go는 구조체에 대해 이 축약형을 허용합니다
    // (*o).Value 대신에
}

o := Object{Value: 42}
modifyObjectPtr(&o)
fmt.Println(o.Value) // 84
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/v4wI6_cRoOz)

포인터를 전달할 때 원본 객체의 메모리 주소를 전달하기 때문에, 기본 값을 직접 수정할 수 있기 때문입니다. 그리고 이것은 구조체에만 국한되지 않고, 기본 타입을 포함한 모든 타입에 대한 포인터를 생성할 수 있습니다.

```go
func modifyValue(x *int) {
    *x = 100
}

y := 42
modifyValue(&y)
fmt.Println(y) // 100
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/3jXZoqLjHpe)

### 함수

지난 섹션에서 함수를 간단히 살펴봤는데, 이미 짐작하셨겠지만 자바스크립트에서의 작동 방식과 매우 유사합니다. 함수의 시그니처도 `function` 대신 `func` 키워드를 사용하는 것을 제외하고는 자바스크립트와 매우 비슷합니다.

```go
func greet(name string) string {
  if name == "" {
    name = "there"
  }
  return "Hello, " + name
}
```

자바스크립트와 마찬가지로 함수는 일급(first-class) 시민이므로, 변수에 할당하고 전달할 수 있으며, 따라서 고차 함수(higher-order functions)와 클로저(closures)도 지원합니다. 예를 들면 다음과 같습니다.

```go
func makeMultiplier(multiplier int) func(int) int {
  return func(x int) int {
    return x * multiplier
  }
}

double := makeMultiplier(2)

double(2) // 4
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/I50FbD-qkr9)

또한 Go는 함수에서 여러 값을 반환하는 기능을 지원합니다. 이 패턴은 나중에 살펴볼 에러 처리에서 매우 유용합니다.

```go
func parseName(fullName string) (string, string) {
    parts := strings.Split(fullName, " ")
    if len(parts) < 2 {
        return parts[0], ""
    }
    return parts[0], parts[1]
}

firstName, lastName := parseName("Bruce Banner")

fmt.Printf("%s, %s", lastName, firstName) // Banner, Bruce
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/jaC8_4Xbckl)

## 배열과 슬라이스

Go에서 배열은 자바스크립트와 달리 고정된 용량을 가집니다. 길이는 타입의 일부이므로 크기를 조절할 수 없습니다. 이것이 제한적으로 들릴 수 있지만, 잠시 후에 배열을 다루는 더 나은 방법을 알아볼 것입니다.

먼저 자바스크립트에서 배열이 어떻게 작동하는지 복습해 보겠습니다.

```ts
let s: Array<number> = [1, 2, 3];

s.push(4);

s[1] = 0;

console.log(s); // [1, 0, 3, 4]
```

Go에서는 다음과 같이 크기를 지정하여 배열을 선언합니다.

```go
var a [3]int
// ^ 이것은 제로 값으로 채워진 3개의 아이템을 가진 배열을 생성합니다. [0 0 0]

a[1] = 2 // [0 2 0]

// 또는 초기 값을 가진 배열을 정의할 수도 있습니다.
b := [3]int{1,2,3}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/N7dS0pJ_UCL)

배열의 길이가 고정되어 있기 때문에 push 메서드가 없다는 것을 주목하세요. 바로 이 지점에서 슬라이스가 등장합니다. 슬라이스는 배열에 대한 동적 크기의 유연한 뷰입니다.

```go
c := [6]int{1,2,3,4,5,6}

d := c[1:4] // [2 3 4]
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/dER8L-Fw4h9)

언뜻 보기에는 자바스크립트의 `slice`와 비슷해 보일 수 있지만, 자바스크립트의 `slice`는 얕은 복사(shallow copy)를 반환하는 반면, Go의 슬라이스는 기본 배열에 대한 참조를 유지한다는 점을 명심해야 합니다. 그래서 자바스크립트에서는 다음과 같이 작동합니다.

```ts
let x: Array<number> = [1, 2, 3, 4, 5, 6];

let y = x.slice(1, 4);

y[1] = 0;

console.log(x, y); // x = [1, 2, 3, 4, 5, 6] y = [2, 0, 4]
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?ssl=7&ssc=57&pln=1&pc=1#code/DYUwLgBAHgXBCCAnRBDAngHgHYFcC2ARiIgHwQC8EA2gIwA0ATHQMx0AsdArHQGwC6AbgBQQ0JDQVoAOgDOwAJYBjEAAp6bAJQi0tPpIAMIxQHssM46CnBjAcxVQ6aDRAD0L6JNp0ITCKwgcENwQ-BASlFS++t5sfEA)

Go에서 슬라이스를 수정하면 기본 배열이 변경되므로, 위 예제의 경우 다음과 같이 작성할 수 있습니다.

```go
d[0] = 0

fmt.Println(c) // [1 0 3 4 5 6]
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/ytJ5UotV5t2)

이제 상황이 흥미로워지는 부분은 슬라이스 리터럴입니다. 배열에서 길이 부분을 생략하여 슬라이스 리터럴을 만들 수 있습니다.

```go
var a []int

// 또는

b := []int{1,2,3}

a == nil // true
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/72k43lVxRwl)

`b`의 경우 이전에 본 것과 동일한 배열을 생성하지만, b는 그것을 참조하는 슬라이스를 저장합니다. 또한 이전 섹션에서 제로 값을 기억하신다면, 슬라이스의 제로 값은 `nil`이므로 위 경우 `a`는 `nil`이 됩니다. 이는 기본 배열에 대한 포인터가 `nil`이기 때문입니다.

기본 배열 외에도 슬라이스는 길이와 용량을 가집니다. 길이는 슬라이스가 현재 가지고 있는 아이템의 수이고, 용량은 기본 배열에 있는 요소의 수입니다. `len`과 `cap` 메서드를 사용하여 슬라이스의 길이와 용량에 접근할 수 있습니다.

```go
s := []int{1,2,3,4,5,6}

t := s[0:3]

fmt.Printf("len=%d cap=%d %v\n", len(t), cap(t), t)
// len=3 cap=6 [1 2 3]
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/23Y5XwkkC2J)

위 예제에서 슬라이스 `t`는 원래 배열에서 슬라이싱된 방식 때문에 길이가 3이지만, 기본 배열의 남은 용량은 6입니다.

내장 함수 `make`를 사용하여 슬라이스를 만들 수도 있습니다. `make([]T, len, cap)` 구문을 사용합니다. 이것은 0으로 채워진 배열을 할당하고 그 배열을 참조하는 슬라이스를 반환합니다.

```go
a := make([]int, 5)  // len(a)=5, cap(a)=5

b := make([]int, 0, 5) // len(b)=0, cap(b)=5
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/sSlO_jyvkoT)

또한 내장된 `append` 메서드가 있어 슬라이스의 길이와 용량에 대해 걱정하지 않고 아이템을 추가할 수 있습니다.

```go
a := []int{1,2,3}

a = append(a,4) // [1 2 3 4]
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/MemMp3lI9_A)

`append`는 항상 원본 슬라이스의 모든 요소와 제공된 값을 포함하는 슬라이스를 반환합니다. 만약 기본 배열이 값을 담기에 너무 작으면, `append`는 더 큰 배열을 만들고 그 배열을 가리키는 슬라이스를 반환합니다 (Go 팀은 이것이 내부적으로 어떻게 작동하는지에 대한 [훌륭한 블로그 글](https://go.dev/blog/slices-intro)을 작성했습니다).

자바스크립트와 달리 Go에는 `map`, `reduce`, `filter` 등과 같은 내장된 선언적 함수형 헬퍼가 없습니다. 따라서 슬라이스나 배열을 순회하기 위해 평범한 `for` 루프를 사용할 수 있습니다.

```go
for i, num := range numbers {
  fmt.Println(i, num)
}

// 또는 숫자만 원한다면 이렇게
// for _, num := range numbers
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/iEpJOHjTMmN)

마지막으로, 자바스크립트에서 배열은 기본 타입이 아니므로 항상 참조로 전달됩니다.

```js
function modifyArray(arr) {
  arr.push(4);
  console.log('Inside function:', arr); // Inside function: [1, 2, 3, 4]
}

const myArray = [1, 2, 3];
modifyArray(myArray);
console.log('Outside function:', myArray); // Outside function: [1, 2, 3, 4]
```

Go에서는 배열은 값으로 전달됩니다. 이전 섹션에서 보았듯이 슬라이스는 배열 세그먼트의 기술자이며 배열에 대한 포인터를 포함하므로, 이 기술자를 전달하면 슬라이스 요소에 대한 변경이 기본 배열에 영향을 미칩니다.

```go
func modifyArray(arr [3]int) {
    arr[0] = 100
    fmt.Println("Array Inside:", arr) // Array Inside: [100, 2, 3]
}

func modifySlice(slice []int) {
    slice[0] = 100
    fmt.Println("Slice Inside:", slice) // Slice Inside: [100, 2, 3]
}


myArray := [3]int{1, 2, 3}
mySlice := []int{1, 2, 3}

modifyArray(myArray)
fmt.Println("Array After:", myArray) // Array After: [1, 2, 3]

modifySlice(mySlice)
fmt.Println("Slice After:", mySlice) // Slice After: [100, 2, 3]
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/EkXXRTBKYzh)

## 맵

Go의 맵은 키-값 쌍을 저장하는 데 훨씬 더 흔하게 사용되는 자바스크립트 객체(JSON)보다는 자바스크립트의 `Map`과 실제로 매우 유사합니다.

복습을 위해 자바스크립트에서 맵이 어떻게 작동하는지 살펴보겠습니다.

```ts
const userScores: Map<string, number> = new Map();

// 키-값 쌍 추가
userScores.set('Alice', 95);
userScores.set('Bob', 82);
userScores.set('Charlie', 90);

// 사용자 나이 객체에 대한 인터페이스 정의
interface UserAgeInfo {
  age: number;
}

// 인터페이스를 사용하여 초기 값으로 대체 생성
const userAges: Map<string, UserAgeInfo> = new Map([
  ['Alice', { age: 28 }],
  ['Bob', { age: 34 }],
  ['Charlie', { age: 22 }],
]);

// 값 가져오기
console.log(userScores.get('Alice')); // 95

// 항목 삭제
userScores.delete('Bob');

// 맵의 크기
console.log(userScores.size); // 2
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBArhApgJwMqmYiAuGBZAQwAcAeaZASzAHMAaGMOAWwCMUA+GAXgcQHd8xABQBKANwAoCQHppMAIIATRVWowA1ogCeAWgBuBADZxEMIgQrIIEhCnQhMEAHRIoQgOTzDFYInf0ATgBWcRskNAwsF0Q3dwAhEBZ-GAAOACZQ2wiHKNcPAGEACwJkbz9AgAZQmTkAEUQAMypTAjAYKigUBoJfGAaHGChC0yyYAmpTRIArRGAoCQ6untMAVXD5CYBJMH6YAG8JGDGJ3EZWFEkAXylZBUNO5DACKAo9U2BMZ4pwGD4KIfaYH+FCMMAMxiw8AgqkGw0BD26vgkoEgsCyGywuEIpHIqnoaxQGO2-U4PDA-EERCEAG1DjBqZ5vL5kntjohcGkUjBLgBdWh0hkJJL0VnjdkwADMABZuXyBe4iiUyiy2Ry0rKJDzqrcAOIxF40MFGEzWFEQECGRBOQwgahCLL2RxOCaxLw+PwicQwW7BG51RCWg1qVowRBgKDILRhOyRZyKAMxRAeIXubVyVAUABekwasNMTGIyPA5st1tt9vCjtyWcQXtuaSAA)

그리고 매우 유사하게 Go에서도 맵이 작동합니다.

```go
// 맵 생성
userScores := map[string]int{
    "Alice":   95,
    "Bob":     82,
    "Charlie": 90,
}

type UserAge struct {
    age int
}

// 다른 생성 방법
userAges := make(map[string]UserAge)
userAges["Alice"] = UserAge{age: 28}
userAges["Bob"] = UserAge{age: 34}
userAges["Charlie"] = UserAge{age: 22}

// 값 가져오기
aliceScore := userScores["Alice"]
fmt.Println(aliceScore) // 95

// 항목 삭제
delete(userScores, "Bob")

// 맵의 크기
fmt.Println(len(userScores)) // 2
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/SC0q91MPMrd)

한 가지 주목할 점은, 맵에 존재하지 않는 키에 접근하려고 하면 해당 값 타입의 제로 값을 얻게 된다는 것입니다. 그래서 위 예제에서 `davidScore`는 자바스크립트의 `undefined`와 달리 0으로 설정될 것입니다.

```go
davidScore := userScores["David"] // 0
```

그렇다면 항목이 실제로 맵에 있는지 없는지는 어떻게 알 수 있을까요? 맵에서 값을 검색하면 두 개의 값을 반환합니다. 첫 번째는 위에서 본 것처럼 값 자체이고, 두 번째는 값이 실제로 맵에 존재했는지를 나타내는 불리언입니다.

```go
davidScore, exists := userScores["David"]
if !exists {
    fmt.Println("David not found")
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/Pr2bOa4ofQi)

마지막으로, 이전에 본 슬라이스와 마찬가지로 맵 변수도 기본 데이터 구조에 대한 포인터이므로 슬라이스와 유사하게 참조로 전달됩니다.

```go
func modifyMap(m map[string]int) {
    m["Zack"] = 100  // 이 변경 사항은 호출자에게 보입니다
}

scores := map[string]int{
    "Alice": 95,
    "Bob":   82,
}

fmt.Println("Before:", scores)  // Before: map[Alice:95 Bob:82]

modifyMap(scores)

fmt.Println("After:", scores)   // After: map[Alice:95 Bob:82 Zack:100]
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/jNykGSnUQOx)

## 비교

자바스크립트에서는 엄격한 동등성 검사를 할 때 때때로 혼란스러워질 수 있습니다. 기본 타입은 값으로 비교할 수 있지만, 그 외 모든 것은 참조로 비교되고 전달됩니다.

```js
let a = 5;
let b = 5;
console.log(a === b); // true - 값으로 비교됨

let str1 = 'hello';
let str2 = 'hello';
console.log(str1 === str2); // true - 값으로 비교됨

let a1 = { name: 'Hulk' };
let a2 = { name: 'Hulk' };
let a3 = a1;

console.log(a1 === a2); // false - 내용이 동일해도 다른 참조
console.log(a1 === a3); // true - 같은 참조
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?#code/DYUwLgBAhhC8EFYBQpICM6KQYwPYDsBnXUAOmFwHMAKGWeiNASggHpWIwAnAVxAgC0EPAFsADlC4gAJowCeEAG5RgfJCnARC3AIyYARAAsQwCvo2RtXAEwHjp3ObxESIclWpW99eFest2Tl5+IVEJKVk0BWVVEHVUaG8IAG8IfCgREAAuCH0ACR5gAGt9CABfC2hbeFT0zJz8wpLyyqgAZkwoHXVnYjIKGi64Bih-Ng4AMxVCEIhpAEsJiZApfEgpCdXsEEI5nbF5sH556RA1+ewVYQIjtZwCPrcB2m8RtqYAbnGgvkEtDP4GxWZ22QA)

하지만 Go에서는 그렇지 않습니다. 비교 불가능한 타입(슬라이스, 맵 등)을 포함하지 않는 한, 구조체나 배열과 같은 복합 타입조차도 거의 모든 것이 값으로 비교됩니다. 예를 들면 다음과 같습니다.

```go
type Person struct {
    Name string
    Age  int
}


p1 := Person{Name: "Alice", Age: 30}
p2 := Person{Name: "Alice", Age: 30}

fmt.Println("p1 == p2:", p1 == p2) // true - 내용은 같지만, 다른 인스턴스

// 배열은 값으로 비교됨
arr1 := [3]int{1, 2, 3}
arr2 := [3]int{1, 2, 3}

fmt.Println("arr1 == arr2:", arr1 == arr2) // true - 내용은 같지만, 다른 인스턴스

// 하지만 슬라이스는 비교할 수 없음
tasks := []string{"Task1", "Task2", "Task3"}
tasks2 := []string{"Task1", "Task2", "Task3"}

// 이것은 컴파일되지 않음:
// fmt.Println(tasks == tasks2) // invalid operation: tasks == tasks2

// 하지만 이것은 허용됨
fmt.Println(tasks == nil) // false

// 그러나 구조체가 비교 불가능한 타입을 포함하면, 그것도 비교 불가능해짐
type Container struct {
    Items []int // 슬라이스는 비교 불가능함
}

c1 := Container{Items: []int{1, 2, 3}}
c2 := Container{Items: []int{1, 2, 3}}

// 이것은 컴파일되지 않음:
// fmt.Println("c1 == c2:", c1 == c2) // error: struct containing slice cannot be compared

// 포인터는 참조(주소)로 비교됨
pp1 := &Person{Name: "Bob", Age: 25}
pp2 := &Person{Name: "Bob", Age: 25}
pp3 := pp1

fmt.Println("pp1 == pp2:", pp1 == pp2) // false - 다른 인스턴스
fmt.Println("pp1 == pp3:", pp1 == pp3) // true - 같은 인스턴스
fmt.Println("*pp1 == *pp2:", *pp1 == *pp2) // true - 역참조하면 값을 비교함
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/DMRAkVXJ-MY)

## 메서드와 인터페이스

자바스크립트에서는 클래스 객체를 사용하여 현실 세계의 개념을 모델링하는 관련 속성과 메서드를 단일 엔티티로 묶습니다. 클래스를 사용하여 객체를 만들 수 있으며, 여기서 클래스는 자바스크립트의 프로토타입 기반 상속 시스템에 대한 문법적 설탕일 뿐입니다 (이에 대해 더 배우고 싶다면 [이 글을](https://prateeksurana.me/blog/how-javascript-classes-work-under-the-hood/) 확인해 보세요).

```ts
class Rectangle {
  length: number;
  width: number;

  constructor(length: number, width: number) {
    this.length = length;
    this.width = width;
  }

  area() {
    return this.length * this.width;
  }
}

const r = new Rectangle(4, 5);
console.log(r.area()); // 20
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?ssl=17&ssc=29&pln=1&pc=1#code/MYGwhgzhAEBKCmwAuYB2BzE9oG8BQ00WGSAFgFzSoCuAtgEbwBOA3AdAO4CWAJmZTQbM27dsAD2qCEibVk4pgApi6flTqMmAGk681gzQEpc7QmS4QAdCrLQAvEXglSbQmdIXL3PqXu6frtAAvnjsYEzwYIrG+G7QEUjUTKjQ5lY2vgBUqR5W3mSBISF4ElJI8X6o8BxwiCgYWIoALDoArIZspRDiWNbi6IpMluGR0R3QAPQT0ABMAAxAA)

Go는 다른 많은 언어와 달리 클래스가 없지만, 타입에 직접 메서드를 정의할 수 있는 기능을 가지고 있습니다. 메서드는 `func` 키워드와 메서드 이름 사이에 오는 특별한 리시버 인수를 가진 특수 함수입니다. 예를 들면 다음과 같습니다.

```go
type Rectangle struct {
  length float64
  width  float64
}

func (r Rectangle) Area() float64 {
  return r.length * r.width
}

func main() {
  r := Rectangle{
    length: 4,
    width:  5,
  }
  fmt.Println(r.Area()) // 20
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/HWQk6JXotK8)

메서드는 리시버 인수를 가진 함수일 뿐이므로, 위 예제는 기능상의 변화 없이 다음과 같이 다시 작성할 수 있습니다.

```go
func Area(r Rectangle) float64 {
  return r.length * r.width
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/EzhF-H_375x)

위의 코드는 값 리시버의 예로, 리시버 변수에서 타입의 복사본을 받습니다. 하지만 대부분의 경우 포인터 리시버를 사용하여 메서드를 선언하게 될 것입니다. 포인터 리시버가 있는 메서드는 리시버가 가리키는 값을 수정할 수 있습니다.

```go
type Rectangle struct {
  length float64
  width  float64
}

func (r Rectangle) Area() float64 {
  return r.length * r.width
}

func (r *Rectangle) Double() {
  r.length = r.length * 2
  r.width = r.width * 2
}

func main() {
  r := Rectangle{
    length: 4,
    width:  5,
  }

  r.Double()
  fmt.Println(r.Area()) // 80
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/hoakk7i4sGJ)

> 💡 편의상 Go는 `Double()` 메서드가 포인터 리시버를 가지므로 `r.Double()` 문장을 자동으로 `(&r).Double()`로 해석합니다.

포인터 리시버를 사용하는 또 다른 이점은 메서드 호출 시마다 값을 복사하는 것을 피할 수 있다는 것인데, 이는 구조체가 클 경우 효율적일 수 있습니다.

## 인터페이스

우리가 알다시피 타입스크립트는 `type`과 `interface`를 사용하여 객체의 시그니처를 정의하지만, 다른 언어처럼 `implements` 키워드를 사용하여 클래스와 함께 시그니처 변수 및 메서드를 정의하는 데에도 사용할 수 있습니다.

```ts
interface Shape {
  area(): number;
  perimeter(): number;
}

class Circle implements Shape {
  #radius: number;

  constructor(radius: number) {
    this.#radius = radius;
  }

  area(): number {
    return Math.PI * this.#radius * this.#radius;
  }

  perimeter(): number {
    return 2 * Math.PI * this.#radius;
  }
}

function printArea(s: Shape) {
  console.log(s.area());
}

let c = new Circle(3);

printArea(c);
```

[링](https://www.typescriptlang.org/play/?#code/JYOwLgpgTgZghgYwgAgMoAs4AcUG8BQyycUEcAFAJQBcyIArgLYBG0A3IcjlMIxJFCq0GLdvgC++fAgA2cAM7zkAYWBRZKXlhkQ+4JRmx5OyAMRQ4AE2D15wpqyhSiCAPYh5YKPQRhXgi2tbe1EoSmQCIiIwdGB5ADpzKxslAF5kQJTOSSJOEjIhOgdoCJMM-nooEGQAWTgY+IAFAElkACpkGLjEzNt2ztiEpKD5DiIc5E5uXn5oQpFHUqjysErqgCZ+uoaW-q6h3tHsiSkYehBfYHcuHnAAQVIKOzRMHHDIqLcPVx14mVcAObkBL5CiUSgnfA6MDIBDIdIgCAAdxUag05AAzBD8FhbmAHgUEJQgA)크

Go의 인터페이스도 비슷한 목적을 수행합니다. Go에서 인터페이스 타입은 메서드 시그니처의 집합으로 정의되며, 해당 메서드를 구현하는 값을 가질 수 있습니다. 예를 들면 다음과 같습니다.

```go
package main

import (
  "fmt"
  "math"
)

type Shape interface {
  area() float64
  perimeter() float64
}

type Rectangle struct {
  length float64
  width  float64
}

func (r *Rectangle) area() float64 {
  return r.length * r.width
}

func (r *Rectangle) perimeter() float64 {
  return 2 * (r.length + r.width)
}

type Circle struct {
  radius float64
}

func (c *Circle) area() float64 {
  return math.Pi * c.radius * c.radius
}

func (c *Circle) perimeter() float64 {
  return 2 * math.Pi * c.radius
}

func printArea(s Shape) {
  fmt.Println(s.area())
}

func main() {
  r := &Rectangle{
    length: 4,
    width:  5,
  }

  c := &Circle{
    radius: 3,
  }

  fmt.Println("Rectangle area:")
  printArea(r)

  fmt.Println("Circle area:")
  printArea(c)
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/EjS07cGLbxs)

위 예제에서 Rectangle에 implements 키워드가 없음에도 불구하고 `Shape` 타입을 요구하는 함수에 전달할 수 있다는 점을 주목하세요. Go에서는 타입이 명시적인 implements 키워드 없이 메서드를 구현함으로써 인터페이스를 구현합니다.

이것이 처음에는 이상하게 보일 수 있지만, 인터페이스의 정의와 구현을 분리할 수 있게 해주는 Go 디자인의 매우 강력한 기능이며, 이는 기존 타입에 대한 인터페이스를 만들 수 있음을 의미합니다.

내부적으로 Go의 인터페이스는 값과 구체적인 타입을 포함하는 튜플로 생각할 수 있습니다. 그래서 위 예제의 경우 다음과 같이 작성할 수 있습니다.

```go
var r Shape

r = &Rectangle{
    length: 4,
    width:  5,
}

fmt.Printf("%v, %T", r, r) // &{4 5}, *main.Rectangle
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/CKfcPbcQiZX)

마찬가지로 nil 인터페이스는 값이나 구체적인 타입을 가지지 않으며, 인터페이스의 속성에 접근하면 nil pointer exception이 발생합니다.

```go
var r Shape

fmt.Printf("(%v, %T)\n", r, r) // <nil>, <nil>

r.Area() // Runtime error: nil pointer exception
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/3qH1bG6wchL)

빈 인터페이스 타입의 변수는 어떤 값이든 가질 수 있으며, 이는 타입스크립트의 `any`와 같습니다.

```go
var r interface{}

r = 42

r = "Bruce Banner"
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/y9eGnKoRluB)

> 💡 Go 1.18에서는 `any`라는 타입도 도입되었는데, 이는 빈 인터페이스의 별칭일 뿐이므로 위 예제에서 `var r any`도 작동합니다.

마지막으로 Go에는 타입 단언도 있으며, 이를 사용하여 인터페이스의 기본 구체적인 값을 얻을 수 있습니다. 예를 들어, 위 경우에는 다음과 같습니다.

```go
var s Shape

s = &Circle{
  radius: 3,
}

c, ok := s.(*Circle) // c는 *Circle 타입이 됩니다
fmt.Println(c, ok) // &{3} true

r, ok := s.(*Rectangle) // r은 *Rectangle 타입이 됩니다
fmt.Println(r, ok) // <nil> false
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/awYt73mK5iZ)

그리고 이것은 구조체 타입에만 국한되지 않고, 타입 단언은 기본 타입에도 작동합니다.

```go
var i interface{} = "hello"

s, ok := i.(string)
fmt.Println(s, ok) // hello true

f, ok := i.(float64)
fmt.Println(f, ok) // 0 false
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/JysEU1GCbiS)

## 에러 처리

이것은 제가 Go에 대해 가장 좋아하는 부분 중 하나이며, 자바스크립트가 확실히 본받아야 할 점입니다. Go에서 에러를 처리하는 방식은 매우 명시적이며, 에러를 처리하지 않으면 경고를 보내는 린터도 있습니다.

자바스크립트에서 에러를 처리하는 가장 일반적인 방법 중 하나는 try-catch를 사용하는 것입니다. 다음은 일부 JSON 파일을 읽고 처리하여 JSON을 반환하는 함수의 일반적인 예입니다.

```js
async function processFiles(filePaths) {
  try {
    const fileContents = await Promise.all(
      filePaths.map((path) => fs.promises.readFile(path, 'utf-8'))
    );

    const results = fileContents.map((content) => JSON.parse(content));
    return results;
  } catch (error) {
    // 어떤 작업이 실패했는가? 파일 읽기? JSON 파싱?
    // 어떤 파일이 문제를 일으켰는가?
    console.error('Something went wrong:', error);
    return null;
  }
}
```

위 코드에서 예외를 처리하고 있지만, 예를 들어 모든 파일 읽기 및 파싱 작업을 try-catch로 감싸는 등의 추가 작업 없이는 어떤 작업이 실패할 수 있는지에 대한 세부적인 정보를 알 수 없습니다.

하지만 Go는 에러 처리에 다른 접근 방식을 취합니다. 예외를 사용하는 대신, Go 함수는 여러 값을 반환할 수 있으며, 관례적으로 마지막 반환 값은 일반적으로 error입니다. 그래서 위 예제는 Go에서 다음과 같이 보입니다.

```go
func processFiles(filePaths []string) ([]map[string]string, error) {
    var results []map[string]string

    for _, path := range filePaths {
        // 각 에러를 소스에서 개별적으로 처리
        data, err := os.ReadFile(path)
        if err != nil {
            return nil, fmt.Errorf("failed to read file %s: %w", path, err)
        }

        var result map[string]string
        err = json.Unmarshal(data, &result)

        if err != nil {
            return nil, fmt.Errorf("failed to parse JSON from file %s: %w", path, err)
        }

        results = append(results, result)
    }

    return results, nil
}
```

위의 Go 예제에서는 에러가 각 단계에서 명시적으로 처리되므로, 어디서 왜 무엇이 실패했는지 정확히 알 수 있습니다. 에러 값은 실패할 수 있는 각 작업 직후에 확인되며, 에러가 있으면 함수는 상세한 에러 메시지와 함께 조기 반환됩니다.

이 접근 방식은 개발자가 처리되지 않은 채 콜 스택을 통해 예외가 버블링되도록 두는 대신, 에러 케이스에 대해 명시적으로 생각하고 처리하도록 강제합니다.

Go는 defer 함수를 통해 주변 함수가 종료된 직후에 문장을 실행할 수 있는 기능을 제공합니다. 예를 들어보겠습니다.

```go
func main() {
  defer fmt.Println("World")
  defer fmt.Println("Go")
  fmt.Println("Hello")
}

// 출력:
// Hello
// Go
// World
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/6aLLD8qxgZo)

defer 함수는 LIFO(Last-In, First-Out) 순서로 실행되므로, "World"가 마지막에 출력됩니다.

defer 함수는 Go의 에러 처리와 잘 어울리며, 리소스 할당 바로 옆에 정리 코드를 배치할 수 있지만 함수가 종료될 때만 실행되도록 합니다. 예를 들면 다음과 같습니다.

```go
package main

import (
  "database/sql"
  "fmt"

  _ "github.com/lib/pq" // PostgreSQL 드라이버
)

func getUsername(userID int) (string, error) {
    // 데이터베이스 연결 열기
    db, err := sql.Open("postgres", "postgresql://username:password@localhost/mydb?sslmode=disable")
    if err != nil {
        return "", fmt.Errorf("failed to connect to database: %w", err)
    }
    defer db.Close() // 함수가 종료될 때 db 연결이 닫히도록 보장

    // 쿼리 실행
    var username string
    err = db.QueryRow("SELECT username FROM users WHERE id = $1", userID).Scan(&username)
    if err != nil {
        return "", fmt.Errorf("failed to get username: %w", err)
    }

    return username, nil
}
```

위 예제에서 데이터베이스 연결을 닫는 defer 문은 데이터베이스 연결을 열 때 바로 뒤에 배치됩니다. 이렇게 하면 연결을 여는 동안 에러가 없었다면 함수가 어떻게 종료되든 연결이 닫히도록 보장하며, 정리 코드를 획득 코드 바로 옆에 배치하여 어떤 리소스를 해제해야 하는지 명확한 그림을 제공합니다.

자바스크립트에서는 비슷한 목표를 달성하기 위해 `finally` 블록과 같은 것을 사용합니다. 위 예제는 자바스크립트에서 다음과 같이 보일 것입니다.

```js
const { Client } = require('pg');

async function getUsername(userId) {
  const client = new Client({
    connectionString: 'postgresql://username:password@localhost/mydb',
  });

  try {
    await client.connect();

    // 쿼리 직접 실행
    const result = await client.query(
      'SELECT username FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    return result.rows[0].username;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  } finally {
    await client.end(); // 이것이 정리(cleanup)를 위한 Go의 defer와 동일함
  }
}
```

defer 함수는 panic으로부터 복구하는 데에도 사용될 수 있습니다. panic은 자바스크립트의 런타임 에러나 예외와 동일한 Go의 개념입니다. 두 언어 모두에서 panic이나 런타임 예외가 발생하면 프로그램은 현재 함수 실행을 중지하고 스택을 풀기 시작하며, 마지막에 예외가 처리되지 않으면 프로그램을 종료합니다 (Go의 경우 스택을 따라 지연된 함수들을 여전히 실행합니다).

자바스크립트에서는 동일한 try-catch 블록을 사용하여 모든 런타임 에러를 정상적으로 처리할 수 있지만, Go에서는 defer 함수 내에서 `recover`라는 특수 함수를 사용하여 panic을 처리해야 합니다. 예를 들면 다음과 같습니다.

```go
package main

import (
  "fmt"
)

func riskyOperation() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()

    // 이것은 panic을 발생시킵니다
    var arr []int
    fmt.Println(arr[1]) // 범위를 벗어난 접근
}

func main() {
    riskyOperation()
    fmt.Println("Program continues after recovery")
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/NfqH0R3d0rA)

위 예제에서 panic이 발생하면 지연된 함수가 실행되고, `recover`를 호출하여 panic을 잡아 프로그램이 충돌하는 것을 방지합니다. 이를 통해 [에러를 정상적으로 처리하고 실행을 계속할 수 있습니다.](https://go.dev/blog/defer-panic-and-recover)

## 동시성

동시성을 처리하는 방식은 두 언어가 가장 큰 차이점을 보이는 부분입니다. 자바스크립트는 핵심적으로 싱글 스레드이지만, 이벤트 기반 아키텍처 덕분에 메인 스레드에서 실행되는 콜백, Promise 등을 이용한 논블로킹 I/O 작업을 허용합니다. 이 이벤트 기반 아키텍처는 자바스크립트가 멀티스레딩 없이 동시성을 가질 수 있게 합니다.

Go는 Go 런타임에 의해 관리되는 경량 스레드(각각 ~2KB)인 고루틴(goroutine)을 통해 진정한 동시성을 지원합니다. 자바스크립트의 싱글 스레드 이벤트 루프와 달리, Go는 여러 OS 스레드에 걸쳐 코드를 병렬로 실행할 수 있습니다. Go 코드 자체는 동기적이지만, 고루틴은 CPU 코어에 걸쳐 병렬 실행을 가능하게 합니다.

다음은 고루틴을 생성하는 방법입니다.

```go
package main

import (
  "fmt"
  "time"
)

func say(s string) {
  fmt.Println(s)
}

func main() {
  go say("world")
  say("hello")

  // 고루틴이 실행되기 전에 프로그램이 종료되는 것을 막기 위해 sleep을 추가했습니다.
  // 채널(channel)과 웨이트그룹(wait group)을 사용하여 이를 처리하는 더 좋은 방법이 있습니다.
  time.Sleep(100 * time.Millisecond)
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/4JccVK4Q0gz)

위 예제의 `go` 키워드는 함수를 현재 고루틴과 병렬로 실행되는 새로운 고루틴에서 실행합니다.

고루틴이 자바스크립트의 이벤트 루프와 어떻게 비교되는지 이해하기 위해, `Promise.all`을 사용하여 병렬로 여러 API 호출을 하고 응답을 기다리는 예제를 보겠습니다.

```js
const fetchData = async () => {
  try {
    // 두 요청을 "병렬로" 시작
    const postPromise = fetch(
      'https://jsonplaceholder.typicode.com/posts/1'
    ).then((response) => response.json());

    const commentsPromise = fetch(
      'https://jsonplaceholder.typicode.com/posts/1/comments'
    ).then((response) => response.json());

    // 두 프로미스가 모두 해결될 때까지 대기
    const [post, comments] = await Promise.all([postPromise, commentsPromise]);

    console.log('Post:', post);
    console.log('Comments:', comments);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();
```

[▶️ 플레이 그라운드](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBAZgUysAFgEQIZQzAvDDCATzGBgAoBKPAPhgG8AoGGKAJyIeZZgHpeYAZWxtYAIxBQUMNggCOAVwTQIMAEQBLMDAAOGNhgA2hhIbXcWoSLB0hoABTYgAthogI88JKnIByFFBQOhAAXPwAVhDgOoYYwAgoIIYAJghsAHRQRDoaoKnpoM68tiq8AIy+lBY8mSgIYOSyELaQHrh0TS3u6ZHgVJQA3NXVVtAwhc71UBCOLm5tXsgofgFBoRFRYDFxCUmpGVk5eQgFLsV20+W8E1MQldUstfWNyl1tHa-g3b0NlIPDPD4AgA6hgNLA4CA2DAJFJdE5XO5VFAQDJlEkAG4IEZfWAAbRKUAANOMXJMwNMALqeDAAdzBsFmiJORkM5AJFyZ8xJNwpMwR80p-0BOMgSROhhAAHM-PYLiFfCTCcKeKNxelJTLfABhMm3BU8vV8lUAX3GWFQFDSTjY1CYgLVJnS1qhfgAomwbYtUFopTBklgMAaYC7bUMWCbGCahoxEEtMNgqAMgA)

그리고 다음은 고루틴을 사용하여 Go에서 비슷한 것을 구현하는 방법입니다.

```go
package main

import (
  "fmt"
  "io/ioutil"
  "net/http"
  "sync"
)

func main() {
  var wg sync.WaitGroup
  var postJSON, commentsJSON string
  var postErr, commentsErr error

  // 대기할 항목 두 개 추가
  wg.Add(2)

  // 고루틴에서 post 가져오기
  go func() {
    defer wg.Done()
    resp, err := http.Get("https://jsonplaceholder.typicode.com/posts/1")
    if err != nil {
      postErr = err
      return
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
      postErr = err
      return
    }

    postJSON = string(body)
  }()

  // 고루틴에서 comments 가져오기
  go func() {
    defer wg.Done()
    resp, err := http.Get("https://jsonplaceholder.typicode.com/posts/1/comments")
    if err != nil {
      commentsErr = err
      return
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
      commentsErr = err
      return
    }

    commentsJSON = string(body)
  }()

  // 두 고루틴이 완료될 때까지 대기
  wg.Wait()

  // 모든 에러 처리
  if postErr != nil {
    fmt.Println("Error fetching post:", postErr)
    return
  }
  if commentsErr != nil {
    fmt.Println("Error fetching comments:", commentsErr)
    return
  }

  // 결과 출력
  fmt.Println("Post JSON:", postJSON)
  fmt.Println("Comments JSON:", commentsJSON)
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/a36f7R8WqtT)

> 💡 위 예제는 Go의 기본 [동기화 프리미티브](https://pkg.go.dev/sync)를 제공하는 `sync` 패키지의 일부인 `WaitGroup`을 사용합니다.
>
> [채널(Channel)](https://gobyexample.com/channels)은 고루틴이 서로 통신할 수 있게 해주는 Go의 또 다른 강력한 기능이며, 실행을 동기화하는 데 사용될 수 있습니다. 이 가이드에서는 다루지 않지만(채널만으로도 별도의 블로그가 필요함), Go의 동시성 모델에 대해 더 배우고 싶다면 확인해 볼 가치가 있습니다.

예제들의 핵심적인 차이점은 자바스크립트는 비동기 I/O와 이벤트 루프를 통해 동시성을 달성한다는 것입니다. I/O 작업을 브라우저나 Node.js에 위임하여 메인 스레드 외부에서 이러한 작업을 수행하지만, CPU 집약적인 작업의 경우 자바스크립트는 여전히 단일 메인 스레드에서 실행되어 다른 모든 것을 차단합니다. 반면에 Go는 CPU 코어에 걸쳐 동시에 실행될 수 있는 고루틴으로 진정한 병렬성을 가능하게 합니다. 다음은 고루틴을 사용하여 CPU 집약적인 작업을 병렬로 실행하는 방법의 예입니다.

```go
package main

import (
  "fmt"
  "sync"
)

func sum(s []int, result *int, wg *sync.WaitGroup) {
  defer wg.Done() // 이 고루틴이 끝났음을 알림

  sum := 0
  for _, v := range s {
    sum += v
  }
  *result = sum
}

func main() {
  s := []int{7, 2, 8, -9, 4, 0}

  var wg sync.WaitGroup
  var x, y int

  // 웨이트 그룹에 2개의 고루틴 추가
  wg.Add(2)

  // 고루틴 실행
  go sum(s[:len(s)/2], &x, &wg)
  go sum(s[len(s)/2:], &y, &wg)

  // 두 고루틴이 완료될 때까지 대기
  wg.Wait()

  fmt.Println(x, y, x+y)
}
```

[▶️ 플레이 그라운드](https://goplay.tools/snippet/SUPwpsSM17e)

위 예제에서는 고루틴을 사용하여 슬라이스의 두 부분을 병렬로 합산하는 CPU 집약적인 작업을 수행하고 있습니다. 이런 작업은 자바스크립트에서는 [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)나 [Node.js의 worker thread](https://nodejs.org/api/worker_threads.html)를 사용하지 않는 한 네이티브로 지원되지 않습니다.

## 포매팅 및 린팅

Go는 표준 라이브러리의 Gofmt 패키지와 함께 공식 포매터를 제공합니다. 자바스크립트 생태계에서 다른 프로젝트들이 Prettier로 사용자 정의 구성을 갖는 것과 달리, [Gofmt](https://pkg.go.dev/cmd/gofmt)는 구성 옵션이 많지 않지만 [대부분의 Go 프로젝트](https://go.dev/blog/gofmt#format-your-code)에서 널리 받아들여지며, 대부분의 편집기는 이를 사용하여 Go 코드를 자동으로 포매팅하는 기본 확장 기능을 가지고 있습니다.

린팅에 관해서는, Go도 자바스크립트와 유사하게 커뮤니티에서 만든 여러 린팅 규칙이 있으며, 이는 다양한 코드 품질 문제에 대해 경고하거나 자동 수정할 수 있습니다. [`golangci-lint`](https://golangci-lint.run/welcome/install/)는 인기 있는 Go 린터 실행기 중 하나로, 여러 린터를 병렬로 실행하고 100개 이상의 구성 가능한 린터를 통합합니다.

## 결론

여기까지 오셨다면, 이 가이드가 여러분에게 Go에 대한 견고한 기초를 제공하고, Go가 언어로서 그리고 실행 방식에서 자바스크립트와 어떻게 비교되는지 이해하는 데 도움이 되었기를 바랍니다.

우리는 필수적인 기본 개념들을 다뤘지만, Go의 강력한 표준 라이브러리와 생태계의 극히 일부만을 살펴보았습니다. 더 깊이 파고들고 싶다면, 다음 단계는 직접 만들어보는 것입니다. Go는 CLI, 웹 서버, 마이크로서비스, 시스템 도구, 심지어 언어 컴파일러를 만드는 데 탁월합니다.

Go 여정을 계속하기 위한 몇 가지 자료는 다음과 같습니다.

- [https://gobyexample.com/](https://gobyexample.com/)
- [https://go.dev/doc/articles/wiki/](https://go.dev/doc/articles/wiki/)
- [https://github.com/urfave/cli](https://github.com/urfave/cli)

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
