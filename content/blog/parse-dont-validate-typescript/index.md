---
title: (번역) 검증하지 말고 파싱하세요 — 그렇게 하라고 이끌어 주지 않는 언어에서
description:
date: 2026-05-18
lastUpdated: 2026-05-18
tags: [Typescript, 번역]
---

> 원문: [Parse, Don't Validate — In a Language That Doesn't Want You To](https://cekrem.github.io/posts/parse-dont-validate-typescript/)

업데이트: 이 글이 마음에 들었다면, 후속 글인 [Effect-TS 없이 Effect 다루기: 순수 타입스크립트에서 대수적으로 생각하기](https://cekrem.github.io/posts/effect-without-effect-ts/)에서 여기서 멈춘 지점을 이어 받아 아이디어를 더 밀고 나갑니다.

요즘 Alexis King의 [검증하지 말고 파싱하기](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)를 다시 생각하고 있습니다. 사실 꽤 자주 그럽니다. 보통은 `if (user.email)` 검사들이 따개비처럼 조용히 들러붙고 있는 타입스크립트 코드베이스를 한참 바라본 뒤입니다. 그 글은 2019년에 나왔고, 그 조언, 아니 원칙은 그보다 훨씬 오래되었습니다. 그런데도 제가 읽는 타입스크립트 코드 대부분은, 민망하게도 제가 쓴 코드 상당수까지 포함해서, 여전히 파싱 대신 검증을 하고 있습니다.

요지를 정리하면 이렇습니다(아직 읽지 않았다면, 꼭 읽어보세요). 검증기(validator)는 "이건 괜찮으니 계속 진행하세요"라고 말합니다. 파서는 "덩어리 하나를 주면 더 정확한 타입으로 만들어주거나, 왜 안되는지 이유를 알려드리겠습니다"라고 말합니다. 이 차이는 별 것 아닌 학술적인 이야기처럼 들리지만, 검증기는 실행을 마치는 순간 자신이 알아낸 정보를 버리고, 파서는 알아낸 것을 타입에 인코딩하여 보존한다는 사실을 깨닫는 순간 완전히 달라집니다. 문자열을 `EmailAddress`로 파싱하고 나면, 프로그램의 나머지 부분은 다시는 그 값을 의심할 필요가 없습니다.

마음이 편해지고, 재미있는 일에 집중할 여유가 더 생깁니다.

Haskell, Elm, F#에서는 이런 방식이 그냥 코드를 작성하는 방식입니다. 언어가 당신을 그쪽으로 끌어당깁니다. 타입스크립트는... 그렇지 않습니다. 타입스크립트는 올바른 일을 할 수 있게 기꺼이 허용하지만, 강제하지도 않고, 가볍게 등을 떠밀어 주지도 않습니다. 오히려 구조적 타이핑(structural typing)이 이 게임 전체를 적극적으로 방해한다고 봐도 됩니다.

무슨 뜻인지 보여드리겠습니다.

## 우리 모두가 작성해 본 검증기

제가 늘 보고, 또 직접 쓰기도 하는 코드는 대략 이런 모습입니다.

```ts
interface User {
  id: number;
  email: string;
  age: number;
}

// 실제 검증 과정은 다소 단순하지만, 요지는 이해하셨을 겁니다.
function isValidUser(user: User): boolean {
  if (!user.email.includes("@")) return false;
  if (user.age < 0 || user.age > 150) return false;
  return true;
}

function sendWelcome(user: User) {
  if (!isValidUser(user)) {
    throw new Error("invalid user");
  }
  // ...나중에, 호출 스택의 더 깊은 곳에서
  emailService.send(user.email, `Welcome, age ${user.age}`);
}
```

거짓말이 보이나요? `User.email`은 그냥 `string`입니다. `User.age`는 그냥 `number`입니다. 검증은 일어났습니다. 축하합니다. 하지만 타입 시스템은 `isValidUser`가 반환되는 즉시 그 사실을 잊어버렸습니다. 함수 호출을 세 단계쯤 더 내려간 곳에서 누군가 `user.email`을 건드릴 때, 진짜 이메일을 기대하는 함수에 그 값을 넘기지 못하게 막아 주는 것은 아무것도 없습니다. 타입스크립트가 보기에는 그냥 문자열이기 때문입니다. `""`와 같고, `"hello"`와 같고, `"definitely not an email"`과도 같습니다.

그래서 우리는 어떻게 할까요? 다시 검증합니다. `if`를 하나 더 추가합니다. 단위 테스트를 작성합니다. 그리고 희망합니다. King은 원문에서 여기에 훨씬 더 좋은 표현을 붙였습니다. "shotgun parsing"입니다. 검증이 여기저기 흩어져 있고, 그중 어느 것도 기억되지 않는 상태 말입니다.

## 우리가 실제로 원하는 것

우리가 원하는 것은 이것입니다.

```ts
function sendWelcome(user: ValidUser) {
  emailService.send(user.email, `Welcome, age ${user.age}`);
}
```

그리고 파서를 거치지 않은 어떤 값으로도 `sendWelcome`을 호출할 수 없기를 바랍니다. 재검사나 "방어적 프로그래밍"은 필요 없습니다. 말하자면 타입 자체가 증거 역할을 하는 것입니다.

Elm이라면 저는 불투명 타입(opaque type)과 스마트 생성자(smart constructor)를 꺼내 들고 네 줄쯤 만에 끝냈을 것입니다. 타입스크립트에서는, 음, 적어도 가능은 합니다. 조금 덜 유쾌할 뿐입니다.

## 브랜디드 타입, 또는 구조적 타입 시스템에 일부러 거짓말하기

타입스크립트는 구조적 타입을 사용합니다. 즉 모양이 같은 두 타입은 같은 타입입니다. `string`은 `string`이고, 또 `string`입니다. `newtype`은 없습니다. 하스켈처럼 진짜로 구분되는 타입을 만드는 `type EmailAddress = String` 같은 것도 없습니다.

커뮤니티가 정착시킨 우회 방법은 _브랜딩_입니다. _태깅_이라고도 하고, _인터섹션을 통한 명목 타이핑_이라고도 부릅니다. 저렴한 버전은 문자열 리터럴 팬텀(`{ readonly __brand: "Email" }`)이고, 곳곳에서 보게 될 것입니다. 조금 덜 저렴한 버전은 모듈에서 내보내지 않는 `unique symbol`을 사용합니다. 그러면 외부에서는 브랜드를 위조하려 해도 그 이름조차 쓸 수 없습니다.

```ts
declare const EmailBrand: unique symbol;
declare const AgeBrand: unique symbol;

type Email = string & { readonly [EmailBrand]: true };
type Age = number & { readonly [AgeBrand]: true };
```

런타임에는 브랜드 필드가 존재하지 않습니다. 이것은 "팬텀(phantom)"입니다. 타입 레벨의 표시자로, 컴파일타임에 `Email`과 `string`을 호환되지 않게 만듭니다. `Email`을 얻는 유일한 방법은 그것을 만드는 방법을 아는 함수를 통하는 것입니다. 이 모듈 밖에서는 심지어 기호 이름조차 댈 수 없으니 가짜로 만들 수도 없습니다.

TS 5에서는 템플릿 리터럴 타입(template literal types)에 잠깐 눈길을 줄 수도 있습니다. `` type Email = `${string}@${string}` `` 같은 식입니다. 데모로는 재미있지만, 그 자체로 충분하지는 않습니다. 이 움직임이 언어를 떠나지 않고도 불가능한 상태를 표현할 수 없게 만드는 방법입니다.

참고로 브랜드는 한 방향입니다. `Email`은 여전히 `string`에 할당할 수 있습니다. 도메인 안으로 들어올 때는 명목적으로, 밖으로 나갈 때는 구조적으로 동작합니다. 대체로 바로 우리가 원하는 형태입니다.

그 함수가 바로 파서입니다.

```ts
type ParseError = { kind: "ParseError"; message: string };
type Parsed<T> = { kind: "ok"; value: T } | { kind: "err"; error: ParseError };

function parseEmail(raw: string): Parsed<Email> {
  if (!raw.includes("@")) {
    return { kind: "err", error: { kind: "ParseError", message: "missing @" } };
  }
  // we've checked, now we lie to the type system on purpose
  return { kind: "ok", value: raw as Email };
}

function parseAge(raw: unknown): Parsed<Age> {
  if (
    typeof raw !== "number" ||
    !Number.isInteger(raw) ||
    raw < 0 ||
    raw > 150
  ) {
    return { kind: "err", error: { kind: "ParseError", message: "bad age" } };
  }
  return { kind: "ok", value: raw as Age };
}
```

`parseEmail` 조건식은 민망할 정도로 얇습니다. 실제 구현이라면 앞뒤 공백을 자르고, 소문자로 바꾸고, 도메인 부분을 검증하는 척이라도 해야겠죠. 하지만 블로그 글에서 이메일 파서를 쓰고 싶지는 않습니다(!). `as Email`은 조금 아픕니다. 그리고 아파야 합니다. 이곳은 규칙을 깰 수 있도록 허용된 단 하나의 지점입니다. 파서는 신뢰할 수 있는 경계입니다. 코드베이스의 다른 모든 곳에서는 `string`에서 `Email`을 불러낼 수 없습니다. `parseEmail`을 호출하고 두 분기를 모두 처리해야 합니다.

저는 일부러 불리언 판별자 대신 `kind: "ok" | "err"`를 쓰고 있습니다. 불리언은 누군가 세 번째 경우를 추가하기 전까지는 깔끔해 보입니다. 그러고 나면 완전성 검사(exhaustiveness)가 조용히 작동하지 않습니다. 문자열은 정직하게 좁혀집니다.

처음에 보았던 던지고 기도하는 검증기와 비교해 보세요. 검증기의 실패 모드는 예외이고, 예외는 타입 시스템에 보이지 않습니다. 파서의 시그니처는 일어날 수 있는 모든 일을 알려줍니다. 호출 스택 어딘가에 숨어 있는 세 번째 선택지는 없습니다.

이제 도메인 타입입니다. 저는 보통 하나로 뭉뚱그려지는 두 가지를 따로 이름 붙이고 싶습니다. 네트워크에서 막 넘어온 원시 덩어리와, 신뢰할 권리를 얻은 값입니다.

```ts
declare const UserIdBrand: unique symbol;
type UserId = number & { readonly [UserIdBrand]: true };

type UnvalidatedUser = {
  id: unknown;
  email: unknown;
  age: unknown;
};

type ValidUser = {
  readonly id: UserId;
  readonly email: Email;
  readonly age: Age;
};

function parseUserId(raw: unknown): Parsed<UserId> {
  if (typeof raw !== "number" || !Number.isInteger(raw) || raw < 0) {
    return { kind: "err", error: { kind: "ParseError", message: "bad id" } };
  }
  return { kind: "ok", value: raw as UserId };
}

function parseUser(raw: unknown): Parsed<ValidUser> {
  if (typeof raw !== "object" || raw === null) {
    return {
      kind: "err",
      error: { kind: "ParseError", message: "not an object" },
    };
  }
  if (!("id" in raw) || !("email" in raw) || !("age" in raw)) {
    return {
      kind: "err",
      error: { kind: "ParseError", message: "missing fields" },
    };
  }
  if (typeof raw.email !== "string") {
    return {
      kind: "err",
      error: { kind: "ParseError", message: "email not a string" },
    };
  }

  const id = parseUserId(raw.id);
  if (id.kind === "err") return id;

  const email = parseEmail(raw.email);
  if (email.kind === "err") return email;

  const age = parseAge(raw.age);
  if (age.kind === "err") return age;

  return {
    kind: "ok",
    value: { id: id.value, email: email.value, age: age.value },
  };
}
```

`UnvalidatedUser`를 `ValidUser`와 별도로 이름 붙이는 것은 작은 DDD식 선택이지만, 충분히 보답합니다. 들어올 때는 원시 값이고, 나올 때는 신뢰할 수 있는 값이며, 그 경계는 함수입니다. `id`도 브랜딩되어 있습니다. 도메인 안의 모든 원시 타입은 놓친 대화 하나입니다. `OrderId`가 필요한 곳에 넘길 수 없는 `UserId`는 이 기법 전체에서 가장 저렴하게 얻을 수 있는 승리 중 하나입니다. `as Record<string, unknown>`도 더는 없습니다. 타입 시스템에 거짓말하지 말자는 글을 쓰고 있다면, 저부터 타입 시스템에 거짓말하지 않아야 하니까요.

이 방식은 F#이나 Elm의 동등한 코드보다 훨씬 못생겼습니다. 그렇지 않은 척하지 않겠습니다. 에러가 나면 일찍 반환하는 패턴은 라이브러리를 끌어오지 않고 타입스크립트에서 `Result` 모나드에 가장 가까이 다가가는 방식이고, 반복적입니다. [Effect](https://effect.website/)나 [neverthrow](https://github.com/supermacro/neverthrow) 또는 fp-ts를 사용하면 이 부분을 정리할 수 있고, 장난감보다 큰 일이라면 저도 그렇게 할 것입니다. 하지만 저는 언어가 기본으로 제공하는 것만 보여주고 싶습니다. 원칙은 문법이 버티지 못해도 살아남기 때문입니다.

보상은 `sendWelcome(user: ValidUser)`가 이제 정말 안전하다는 점입니다. 코드베이스 어디를 지나도 `parseUser`를 통하지 않고 `ValidUser`를 만드는 경로는 없습니다. 타입이 증거입니다. 검증 결과는 버려지지 않았습니다.

## 타입스크립트가 당신과 싸우는 지점

아직 거슬리는 부분이 몇 가지 있습니다.

첫 번째는 `parseEmail` 안의 `as Email` 캐스트입니다. 진짜 명목 타입 언어라면 스마트 생성자는 거짓말할 필요가 없습니다. 새 타입이 실제로 다른 타입이므로 새 타입을 반환하면 됩니다. 타입스크립트에서 브랜드는 허구이기 때문에, 단언으로 지나가야 합니다. 여기서 필요한 규율은 이것입니다. 오직 파서만 그 단언을 할 수 있습니다. 코드베이스의 다른 곳으로 캐스트가 새어 나가면, 전체 방식이 무너집니다.

저는 파서를 별도 모듈에 두고, 그 모듈 밖의 모든 `as Brand<...>`를 버그로 취급하는 편입니다. 커스텀 ESLint 규칙이 도움이 됩니다.

두 번째는 완전성입니다. 판별 유니언(discriminated unions)은 이런 스타일에서 타입스크립트의 킬러 기능입니다. 언어가 Elm의 커스텀 타입에 가장 가까이 다가가는 지점이기도 합니다. 타입스크립트는 `never` 좁히기를 통해 완전성 검사를 하기는 합니다. 다만 전용 `match` 표현식이 없어서, `never` 트릭을 직접 작성하고 그것을 작성해야 한다는 사실도 기억해야 합니다.

```ts
function describe(result: Parsed<ValidUser>): string {
  switch (result.kind) {
    case "ok":
      return `user ${result.value.id}`;
    case "err":
      return `failed: ${result.error.message}`;
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}
```

`Parsed`에 세 번째 변형을 추가하면 `never` 할당이 실패하고, 컴파일러는 정확히 어디를 봐야 하는지 알려줍니다. Elm에서 분기를 하나 빠뜨리면 말 그대로 무시할 수 없는 컴파일 에러가 나는 것과 비교해 보세요.

이왕 이야기하는 김에, `satisfies`는 알아 둘 만한 또 다른 현대적 우회 경로입니다. `const x = { ... } satisfies Config`는 타입에 맞는지 검사하되 넓히지는 않으므로, 정확한 리터럴 타입을 유지하면서도 안전성을 얻을 수 있습니다. 캐스트의 예의 바른 버전입니다.

세 번째로 거슬리는 것은 `JSON.parse`입니다. `JSON.parse`는 `any`를 반환합니다. `any`는 이 언어에서 최악의 타입이고, 이 글 전체가 존재하는 이유입니다. 곧바로 `unknown`으로 주석을 붙이세요. `const raw: unknown = JSON.parse(input)`처럼요. 그리고 그 다음은 파서에게 맡기면 됩니다. `JSON.parse`는 검증기의 사악한 사촌이 아닙니다. 디시리얼라이저(deserializer)입니다. 바이트를 JS 값으로 바꿉니다. 그 값이 `User`인지 아닌지는 완전히 별개의 질문이고, 바로 그 질문에 답하려고 파서가 존재합니다.

## Zod는 어떤가요?

Zod는 훌륭합니다. io-ts도 그렇습니다. valibot도 그렇습니다. 사용하세요. 이들은 제가 방금 작성한 모든 것을 더 쓰기 좋게 만든 버전입니다. 하나의 정의에서 파서와 타입스크립트 타입을 함께 얻는 스키마 우선 DSL입니다.

```ts
import { z } from "zod";

const ValidUserSchema = z.object({
  id: z.number().int(),
  email: z.string().email().brand<"Email">(),
  age: z.number().int().min(0).max(150).brand<"Age">(),
});

type ValidUser = z.infer<typeof ValidUserSchema>;

const result = ValidUserSchema.safeParse(rawInput);
```

`safeParse`는 `{ success: true, data }` 또는 `{ success: false, error }`를 반환합니다. 제가 위에서 만든 것과 같은 모양이고 필드 이름만 다릅니다. `.brand()` 호출은 손으로 만든 심볼 트릭과 정확히 마찬가지로 순수하게 타입 레벨에서만 존재합니다. 런타임에서는 아무 일도 일어나지 않습니다. 하나의 정의에서 파서와 타입을 얻는 것이고, 이 몇 섹션 앞에서 제가 직접 강제하라고 했던 파서와 타입을 같은 위치에 두는 경계를 구조적으로 강제해 줍니다. 그것만으로도 의존성을 추가할 가치가 있습니다.

하지만, 제가 계속 돌아오게 되는 부분은 이것입니다. Zod는 사고방식의 문제를 바꾸지 않습니다. 올바른 일을 더 쉽게 만들 뿐입니다. 여전히 모든 경계에서 사용하겠다고 선택해야 합니다. 여전히 에러 메시지를 피하려고 타입 단언으로 빠져나가고 싶은 유혹을 참아야 합니다. 여전히 네트워크에서 온 `User`는 무엇인가가 파싱하기 전까지 `User`가 아니라는 사실을 기억해야 합니다. 라이브러리는 도구입니다. 규율은 당신의 몫입니다.

이 이야기는 [왜 타입스크립트는 당신을 구해주지 못하는가](https://cekrem.github.io/posts/why-typescript-wont-save-you/)에서도 짧게 언급했습니다. 요점은 같습니다. 언어가 경계를 강제하지 않으므로, 직접 해야 합니다.

## 더 작은 원칙

King의 아이디어를 릴리스 전날 밤 11시에 실제로 떠올릴 수 있는 한 문장으로 압축한다면 이렇게 말하겠습니다. 기억이 아니라 타입 시스템이 증거를 짊어지게 하세요. 무언가를 검사하고 그 결과를 타입에 인코딩하지 않을 때마다, 미래의 자신에게 기억하라고 요구하는 셈입니다. 미래의 당신은 기억하지 못합니다. 미래의 당신은 전혀 다른 버그를, 세 시간밖에 못 잔 상태로 디버깅하고 있습니다. 그리고 이 모든 `if` 문을 보며 당연히 검증이 이미 끝났다고 생각할 것입니다. 검증기는 뚫릴 수 있지만, 파서는 뚫리지 않습니다.

타입스크립트에서 이는 언어가 마지못해라도 제공하는 세 가지에 기대는 것을 뜻합니다. 명목에 가까운 정체성을 위한 브랜디드 타입, 정직한 에러 처리를 위한 판별 유니언, 그리고 `unknown`(외부에서 온 것)과 도메인 타입(신뢰할 권리를 얻은 것) 사이의 엄격한 경계입니다. 이 중 어느 것도 Elm만큼 깔끔하지 않습니다. 하지만 전부 대안보다는 낫습니다.

저도 여전히 검증기를 쓸 때가 있습니다. 제가 만지는 모든 코드베이스를 파싱 파이프라인으로 리팩터링한다고 허세를 부리지는 않겠습니다. 그건 거짓말이고, 아마 시간도 그다지 잘 쓰는 방식이 아닐 것입니다. 하지만 서로 다른 세 파일에서 같은 것을 검사하는 세 번째 방어적 `if`를 추가하고 있는 자신을 발견하면, 무슨 일이 벌어졌는지 압니다. 파싱했어야 할 곳에서 검증한 것입니다. 정보는 거기에 있습니다. 다만 타입 안에 있지 않을 뿐입니다.

보통 그럴 때 저는 King의 글을 한 번 더 읽으러 갑니다.

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
