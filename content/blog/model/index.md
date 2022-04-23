---
title: 프론트엔드 개발에서 모델을 써보자
date: 2022-02-26
lastUpdated: 2022-04-15
description: '프론트엔드 개발에서 모델을 어떻게 하면 잘 활용할 수 있을까 고민하는 글'
tags: [Typescript]
---

## 왜 필요했나?

돌이켜보면 개발을 막 처음 시작했을 때부터, 짧은 프론트엔드 개발 경험에서 마주했던 대부분의 절차는 다음과 같았다.

1. 뷰 마크업을 한다
2. 스타일을 입힌다
3. 인터랙션을 위해 필요한 로직을 추가한다
4. 로직이 복잡해지면 커스텀 훅으로 분리한다

이렇게 하다 보면 다음과 같은 문제를 마주하게 된다.

1. 이게 뷰인지 비즈니스 로직인지 구분하기 어려울 정도로 엉킨다
2. 따라서 테스트가 어려워진다
3. 규모가 커지면 여기저기 퍼지게 되어 유지보수에 상당한 어려움을 겪게 된다.

그랬었는데 입사하고 지난 21년 10월 ~ 22년 1월엔 Model을 먼저 정의하고 그 후에 UI개발에 들어가면서 위의 문제점들이 어느정도 해소되었다. 팀에서 이런 부분을 위해서 도입을 한 것인지는 잘 모르겠지만... 개인적으로 느끼기엔 그랬다.

## 뭐가 좋았나?

Class를 이용해 모델을 정의하여 사용했는데, 다음과 같은 이점이 있었다.

1. Class로 만든 모델 안에, 서버로부터 받아온 값과 (_비동기 통신을 제외한_) 로직을 모아두어 한 곳에서 관리할 수 있다.
2. 공통되는 로직의 경우 재활용할 수 있다.
3. 테스트가 용이하다.

여기에 추가로, 지난 프로젝트에서는 활용하지 못했고 프로젝트가 다 끝나가서야 깨닫게 된 것이지만 **백엔드에서 내려주는 데이터 스키마가 변경되었을 경우 모델만 수정하면 된다**는 유지보수의 용이함도 있다. 물론 이게 class만의 장점은 아닐테지만, class로 관리하면 더 수월한 건 있는거 같다.

사용 예시는 다음과 같다.

먼저, 백엔드로부터 받아온 다음과 같은 json 형태의 데이터가 있다.

```json
{
  "name": "",
  "email": "",
  "addressMain": "",
  "addressDetail": "",
  "submittedAt": ""
}
```

위의 데이터를 class로 만들어준다. 직접 만들어줄 수도 있지만 `class-transformer`를 이용했다.

```ts
import { plainToClass } from 'class-transformer';

plainToClass(Model, data);
```

객체로도 값과 함수를 함께 묶어 관리할 수 있지만, 그보다는 class를 활용하는 것이 보다 용이하다고 생각했다.

무엇보다도 `class-transformer`의 도움을 받으면 3중으로 nested된 구조여도 엄청나게 쉽게 class 인스턴스로 만들 수 있다.

또한, `class-validator`를 이용하면 데코레이터를 통해 손쉽게 유효성을 검증할 수도 있다. 이건 나중에 테스트 코드를 작성할 때에도 엄청나게 용이했다.

또 하나의 장점은 프로젝트에서 두 라이브러리를 백엔드에서도 쓰고 있기 때문에, 백엔드와 싱크를 맞추기 쉽다는 것이다. 어떤 기술적인 문제가 발생했을 때 프엔 파트끼리만 고민하는 것이 아니라 백엔드 파트에게 물어볼 수도 있고, 유효성 검증이 중요한 피쳐에서 싱크를 맞추기 특히 좋았다.

class의 구현은 대강 다음과 같다. 예제 코드에서 타입 인터페이스는 생략했다 ㅎㅁㅎ...

```ts
export default class Model {
  @IsString() // 유효성 검증을 도와주는 데코레이터.
  name?: string;

  @IsEmail()
  email?: string;

  @Length(1, 20)
  @IsString()
  addressMain?: string;

  @Length(1, 20)
  @IsString()
  addressDetail?: string;

  // 날짜 데이터를 다루는 유틸성 class를 하나 만들고, 해당 class로 변환시켜주는 데코레이터를 사용했다.
  @Type(() => DateVo)
  @Transform(({ value }) => new DateVo(value))
  @IsOptional() // 꽤 다양한 옵션의 데코레이터를 제공하는데, 이 데코레이터를 사용하면 해당 필드는 유효성 검증에서 제외된다.
  submittedAt?: string;

  // class transformer에서 다 지워버리기 때문에 constructor를 비웠다.
  constructor() {}

  // 필요한 로직을 등록한다
  get isSeoulUser() {
    if (this._addressMain === 'SEOUL') {
      return true;
    }
    return false;
  }
}
```

## 아쉬웠던 점

### private, getter 활용

위에서 설명한 구조로 모델을 만들고 뷰에서 이용하다보니, 백엔드에서 데이터 필드의 이름을 변경했을 때 프론트엔드에선 사용하는 모든 곳을 다 찾아다니며 이름을 변경해야 했다.

물론 IDE의 지원을 받아 리팩토링 기능으로 이름을 변경할 수도 있지만 (이 부분에서 vsc보다 웹스톰이 강력하다고 생각해 웹스톰을 요즘 써보고 있는 이유이기도 하다), 완전히 믿을 수는 없는 노릇이었고 실제로도 이걸 원인으로 버그도 자주 있었다.

때문에 프로젝트 막바지에 '이런 구조로 만들었더라면...' 하는 생각이 들었었고, 그 구조는 다음과 같다.

```ts
export default class Model {
  @IsString()
  @Expose({ name: 'name' })
  private _name?: string;

  @IsEmail()
  @Expose({ name: 'email' })
  private _email?: string;

  @Length(1, 20)
  @IsString()
  @Expose({ name: 'addressMain' })
  private _addressMain?: string;

  @Length(1, 20)
  @IsString()
  @Expose({ name: 'addressDetail' })
  private _addressDetail?: string;

  @Type(() => DateVo)
  @Transform(({ value }) => new DateVo(value))
  @IsOptional()
  @Expose({ name: 'submittedAt' })
  private _submittedAt?: string;

  constructor() {}

  get name() {
    return this._name;
  }

  get isSeoulUser() {
    if (this.addressMain === 'SEOUL') {
      return true;
    }
    return false;
  }
}
```

백엔드에서 넘어오는 필드를 모두 private로 감추고, getter를 거쳐 뷰에서 접근 가능하게 하는 것이다. 이러면 나중에 `name`이 `realName`으로 바뀌어도, class만 수정하면 된다.

그러나 만약 뷰에서 쓰이는 이름과 api 명세에서의 이름이 달라 혼란이 생길 것이 우려되어 뷰에서도 `model.name`이 아니라 `model.realName`으로 수정하고 싶다면, 그 땐 다시 IDE의 힘을 빌려 리팩토링 해야할 것 같다...🤔 다른 좋은 방법이 있을까요? 🥺

어쨌거나 이렇게 하기 위해 `@Expose` 데코레이터를 사용했다.

기본적으로 `class-transformer`를 이용하여 매핑을 할 때에는 필드 이름이 같아야 한다. 따라서 위와 같이 private임을 나타내기 위해 previx로 \_ 를 붙이거나, 백엔드와 프엔의 컨벤션이 달라 snack_case와 camelCase 사이를 변환해야 하는 경우엔 `@Expose` 데코레이터를 사용하면 된다. 물론 다 달아주어야 한다는 것이 귀찮긴 하지만...ㅎㅎ.. private으로 감추고 getter로만 접근하게 하려면 어쩔 수 없는 듯 하다.

### 인스턴스를 풀었다가 만들었다가, 왔다갔다 하는 불편함

리덕스 스토어에 저장시 인스턴스는 저장할 수 없다. 때문에 매번 classToPlain으로 class를 json객체로 풀어서 넣어주고, 리덕스에서 나온 데이터는 다시 class로 만들어주고, 그랬어야 했는데 이게 너~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~무 번거로웠다.

서버에서 초기 데이터를 받아와 state에 담아두고, 프론트 파트에서 유저 인터랙션에 따라 값을 변경시켜야 할 경우에도 마찬가지이다.

그렇다보니 나중에는 급기야 '음... 왜 class로 만들어야 하는거지? 어차피 다시 풀건데...' 하는 생각도 들었다가 다시 정신 차리고 그러는 헤프닝도 있었다 ㅋㅋㅋ

## 실제 프로덕트 적용 후 알게된 것들

22년 4월, 실제 프로덕트에 적용해보았다!!

과정에서 새롭게 알게된 점은 `@Expose` 데코레이터를 달면 기본값이 안 들어간다는 것이다.. 그래서 getter 안에서 기본값 처리를 해주었어야 했는데 어차피 다 private으로 숨기고 getter로 접근해야만 하는 게 의도된 부분이긴 하니까 크게 어긋나진 않았는데 뭔가 아쉽긴 하다.

그리고 요 근래 들어, 프로젝트를 리팩토링 하면서 마주하는 여러 문제점들의 원인을 추적해 거슬러 올라가다보면 그 끝에는 아키텍쳐가 있는 경험을 자주 한다. 여기서 아키텍쳐란 이 글에서 다룬 모델이 주 내용이다.

현재 프로젝트에는 Model을 DTO처럼 쓰고있고, 그러면서도 단순히 DTO의 역할만 해주는 것이 아니라 비즈니스로직에 가까운 유틸성 메서드들이 함께 들어있다. 게다가 이 모델은 레이어마다 각각 존재하는 것이 아니라 하나의 모델로 여러 레이어의 DTO 역할을 하고 있다보니 하는 일이 많아 문제가 많다. 가장 대표적인 문제는 A 레이어에서 하는 일과 B 레이어에서 하는 일이 충돌되는데, 모델은 하나라는 것이다.

이에 대해 팀원들과도 이야기를 해보았는데 문제가 된 모델의 경우 코드가 굉장히 방대하여, 레이어마다 DTO를 각각 만들어주면 엄청나게 많은 코드가 생긴다는 걱정점이 대두되었다. 현재 모델을 Class로 관리하고 있기 때문에 상속으로 어떻게 해결할 방법이 없을까? 하는 생각은 들지만 아직 생각만 해본 단계라, 잘 모르겠다.
