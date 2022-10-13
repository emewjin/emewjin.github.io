---
title: 'Today I Learned'
date: 2022-07-05
lastUpdated: 2022-10-14
description: '작고 사소한 개발 지식. 경험한 이야기, 여기저기서 들은 이야기, 읽거나 추천받은 아티클 등등을 간단하게 기록합니다.'
tags: [Typescript]
---

## 220705

**import path 단축하기**

```ts
// package.json

"baseUrl": ".",
"paths": {
  "@libs/*": ["libs/*"]
}

// usage
import something from '@libs/server/handler';
```

**프로젝트 구성**

- 모노레포
  - 별도 환경설정에 소모하는 시간을 줄일 수 있음
  - 디자인 시스템과 같이 실시간으로 보면서 개발해야하는 특수한 경우 훨씬 간편하게 watch를 걸고 빌드할 수 있음.
  - 팀 간의 작업 현황에 관심을 가질 수 있음. 커밋 기록 등등으로. 눈에 보이니 PR참여도 쉬워짐.
  - 팀마다의 커밋 기록이 섞여 지저분해짐 (히스토리 파악 어려워짐)
  - 팀마다의 테스트서버 QA / 배포 프로세스가 꼬일 수 있음. 단독으로 관리하기 어려움.
  - 공통 모듈에 수정이 가해질 경우 모든 팀의 프로젝트가 다 배포되어야 함.
- 단독 레포
  - 팀마다의 단독 개발 환경 (테스트, 배포)을 구축할 수 있음
  - 공통 모듈에 수정이 가해진다 해도 필요한 팀에서만 버전을 올려 사용하고 배포하면 됨.
  - 히스토리를 깔끔하게 관리할 수 있음
  - 디자인 시스템, 이메일 템플릿과 같은 공통 모듈이지만 단독으로 관리되는 경우 실시간 수정하기 매우 귀찮음.
  - 초기 구축 비용이 소모됨
  - 다른 팀의 현황에 관심을 갖기 힘들 수 있음 (눈에서 멀어지므로)

## 220707

**써드파티 라이브러리에 대해 인터페이스를 만들자는 의견**

- 인터페이스 자체가 변화가 적고 표준이 확실한 경우, 매우 유용할 것 같다.
  - 예시: http client, api interface 등
- 하지만 그렇지 않은 경우 인터페이스를 만드는 것이 오히려 독이 될 수 있을 것 같다.
  - 변화가 잦고 인터페이스의 공통화가 쉽지 않은 라이브러리
  - 해결하고 싶은 문제는 같지만 해결방법이 각기 다른 라이브러리
  - 승리한 해결방법이 명확히 없는 영역
  - 예시 : 상태관리, 폼 관리 등등

```js
// get.js
import first from 'first';

const get = first.get;

export { get };

// usage
get(successFn, objectData);

// 몇 달 뒤...
// get.js
import something from 'something';

// 의도: 라이브러리 교체를 위해 인터페이스에서만 변경 발생하게 하는 것.
const get = something.get;

export { get };

// usage
// 근데 교체한 라이브러리의 함수가 받는 인자가 완전히 달라진다면?
get(FailFn, arrayData);
```

이렇게 인터페이스를 만들어둔다 해도 인자 같은 것이 완전히 변하면, 결국 get 사용처를 수정해야 하는 것 아닌가? 즉, 인터페이스가 무의미해지는 것 아닌가?  
이럴땐 어떻게 하는걸까?

**Kent C의 테스트 코드 스터디 : 테스트 코드에 있어 리버스 엔지니어링**

- 통합 테스트를 한다는 건 내부의 로직을 모르는 상황에서 테스트를 하는 것인데, 이 과정을 리버스 엔지니어링이라고 본걸까?
- 내부 로직이 어떻게 동작하는지 알고 있기 때문에 작성할 수 있는 테스트 방식이 아닐까?
- 특별한 장점은 없는 것 같다.
- 감추고 싶은 부분(private)을 테스트하는 것이라 오히려 별로인듯.

## 220711

프로젝트 설계 & 구성을 시작했다.  
모노레포 vs 멀티레포 중 당장의 빠른 개발을 위해 모노레포를 선택했는데 git 전략이 문제였다.

**Git 브랜치 전략**

conflict는 문제가 되지 않는다. 왜냐하면 turborepo로 filter 할 거라서.  
그런데, turborepo는 git이 아니다.  
모노레포를 위한 도구가 git과 배포에 밀접하게 연관되는 게 과연 괜찮은가?

1. main, dev, feature, release, hotfix 로 구성된 전략
   - 가장 익숙한 모델이다
   - main에 반영되는 커밋은 곧바로 운영에 배포되고, dev에 반영되는 커밋은 곧바로 개발 서버에 배포된다.
   - dev를 main에 넣을 땐 release를 따서 버저닝 하여 넣는다.
   - hotfix가 필요할 땐 main에서 따서 pr merge 후 로컬에선 dev에 리베이스하여 반영한다.
   - 한 레포에 한 프로젝트 (팀)일 때 적용하기 쉬운 전략이다
   - 한 레포에 여러 프로젝트 (팀)이라면, 5개의 브랜치를 관리하는 것이 어려울 수 있다.
2. main, feature로만 구성된 전략
   - 사실 내게는 낯선 모델이다
   - 빠른 배포를 목적으로 한다
   - main에서 feature를 따서 개발, qa 후 곧바로 main에 넣어 운영배포한다.
   - feature가 나와있는 기간이 길수록 conflict가 발생할 확률이 높아지므로 빠르게 머지하는 것이 중요하다.
   - qa를 하려면 개발 서버가 필요한데 (dev 또는 test) 해당 브랜치가 main과 완전히 동기화 되지 않음이 걱정된다.
   - 관리해야하는 브랜치의 수가 적어 모노레포 환경에서 덜 혼란스러울 수 있다.

현재 우리 팀의 상황을 살펴보면

- 운영 오픈된 프로젝트 1개, 이제 막 새롭게 개발 시작하는 프로젝트 3개.
- 3개는 초기 단계라 모든 것이 빠르게 변하고 진행되기 때문에 버저닝이 필요하지 않다. (기획단의 요구도 없음)
- 총 3팀, 6명이 한 레포 안에서 (모노레포) 작업을 진행한다.
- 이전 서비스 개발시 여러 작업자가 존재할 경우 dev에서의 qa와 main으로의 배포 과정에서 고초를 겪었던 경험이 있다.

결론: 빠르게 시도하고 실패하고 개선하자.

**Git merge 전략**

현재의 github에서는 세 가지의 merge를 제공하고 있다.  
우리 팀에서는 어떤 전략을 채택할지에 대해 논의했는데, 전제는 "1. merge 전 rebase 수행 2. 커밋 메세지를 상세히 작성할 것"이다.

1. merge commit
   - 일반적으로 아는 그 머지이다.
   - 머지 커밋이 생성된다. 이 점이 지저분해지기에 맘에 안듦.
   - 모든 커밋을 보존한다.
2. squash merge
   - 여러 커밋이 하나의 대왕 커밋으로 퉁쳐지기 때문에 히스토리가 보존되지 않는다는 단점이 있다.
   - commit revert 할 때 하나의 커밋만 하면 된다는 장점이 있다.
   - 커밋 내역이 commit body로 남고, 상세 커밋별 파일 체인지를 보고 싶다면 해당 피알 링크를 눌러 이동해 보면 되긴 하지만 모든 pr마다 다 이동해서 봐야한다는 귀찮은 단점이 있다.
   - github의 스쿼시 머지는 머지 커밋이 남지 않아 깔끔하다.
   - dev(또는 main) 기준에서 jira의 한 티켓 당 하나의 커밋만이 쌓이는 것이기 때문에 그래프가 깔끔할 수 있다.
3. rebase merge
   - 커밋을 squash 하지 않으면서도 머지 커밋이 생성되지 않는다.
   - 머지 커밋 없이 티켓 번호 prefix만 보고 구분해야 한다.

## 220712

[타입가드](https://emewjin.github.io/typeguard/#타입가드-사례-2)

## 220713

vite로 react-ts 프로젝트를 생성해서 개발하고 있는데, 환경변수에 따라 특정 모듈을 import할지 결정할 수 있어야 했다.  
왜냐하면 local 이외의 환경에선 번들에 특정 모듈을 포함하고 싶지 않았기 때문임. 단순히 rollup의 설정으로 특정 디렉토리의 특정 파일을 번들링시 제외하는 옵션만으로는 해당 모듈을 import하는 곳에서 에러가 발생할 수도 있기 때문에, 아예 조건에 따라 import하지 않음으로 해결하고자 했다.  
그러기 위해서 이걸 이렇게 쓰는게 맞는지는 모르겠으나 `React.lazy`를 이용해 환경변수를 조건으로 import하는 코드를 작성했다.

```ts
const OnlyDevComponent = (importPath: string) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  React.lazy(() => {
    const isLocalhost = import.meta.env.MODE === 'localhost';

    if (isLocalhost) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return import(importPath);
    }

    return import(빈 컴포넌트 path);
  });
```

ts-ignore부터 린트룰 비활성화까지... 좋은 형태는 아닌 것 같지만 일단 목적하는 바는 달성했다.

## 220718

맨땅에 헤딩해서 0부터 만들어나가는 것은 때때로 좋은 선택이 아닐 수도 있다

- shadow dom, shadow root
- svgo
- 현재의 아키텍쳐에서 권한을 얻는 방법

## 220719

- 스토리북에서 Theme Provider 사용하기
- 계정 관련 토큰은 private repo에서도 env로 숨겨야 할까?

## 220726

클라이언트에서 시간을 다룬다는 것...

- 클라이언트에서 안전한 시간 데이터란 없다
- 클라이언트에서 시간을 다룰 때에 반드시 고려해야 하는 점
  - 서버 시간 : 사용자 기기의 location을 조작한다거나 하는 것으로부터 보호
    - 그러나 모든 것을 서버 시간으로 해결하려 하면 즉각적인 인터랙션이 불가능함.
  - 타임존, UTC : 우리 서비스는 글로벌 서비스가 아닐지라도 이용자는 글로벌할 수 있다. 언제 어디서든 동일한 기준으로 시간 데이터를 운영해야 한다. 기준 맞추기가 중요하다.

## 220801

- 회사에서도 맨날 TIL 같은 데일리 회고를 쓰니까 개인 블로그를 잘 안 찾아오게 된다
- 그래도 써봄. **yarn berry**
  - 요즘 모노레포로 프로젝트를 구성하면서 유령 참조도 겪어보고, A 패키지에서 export한 모듈이 B에서만 접근이 가능하고 C에서는 불가능하게 하고 싶은 욕구가 막 샘솟는데, 이런걸 yarn berry로 해결할 수 있다고 한다.
  - 유령 참조가 발생하는 이유를 완전 러프하게 이야기하면, 패키지별로 오픈소스를 설치해도 결국 root의 node module로 끌어올려지기 때문인데, yarn berry는 node module이 없게 만들어주기 때문에 해결이 가능하다고 함.
  - 국내에서 가장 유명한 글은 https://toss.tech/article/node-modules-and-yarn-berry 인 것 같다.
  - 물론 트레이드 오프가 있겠지?? 내가 사용하고자 하는 오픈소스가 잘 지원되지 않을 수도 있는거고... 트레이드 오프는 뭐가 있을지 여러모로 찾아봐야 한다.
  - 팀에 도입하기 위해선 언제나 POC가 선행되어야 하고 그걸 기반으로 설득이 필요하기 때문에 시간이 좀 나면 작은 프로젝트에서 POC를 진행해볼 예정.

## 220802

- Chunk 전략의 트레이드오프
  - Vite 버전 업데이트를 했더니 빌드시 vendor가 생기지 않았다.
  - vendor를 만들려면 별도 플러그인 설치 필요 (이전엔 기본값)
  - 그럼 vendor가 꼭 필요할까?
    - http가 한 번에 요청할 수 있는 횟수 최대 6~8개
    - "고용량의 js를 한 번에 받을거냐" vs "잘게 쪼개 여러번의 요청으로 받을 거냐"는 트레이드오프
    - 우리의 상황에서는 vendor.js가 큰거라서 index.js와 vendor.js로 쪼개서 요청을 여러 번 했을 때의 이점이 없음. 어차피 이러나 저러나 클거면 한 번만 요청하는게 낫지.
    - 그리고 요청이란건 한 번 한 번마다 3way Handshake 가 걸리기 때문에 이것도 비용으로 고려해야 함.

## 220819

- import, export시 type annoations과 declarations을 위해 사용되는 정의를 구분하기

  - 왜 구분해야 할까? [공식문서](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8/#type-only-imports-exports)
    - 요약하자면 컴파일 할 때 타입만 더 잘 지우기 위해서. 그리고 개인적으로 느끼기엔 팀 문화적으로 이게 타입인지 아닌지 더 쉽게 구분하기 위해서.

- IDE에서 auto import할 때 type only import를 구분할 수는 없을까?
  - 있길래 적용해봄. https://emewjin.github.io/vsc-react-ts-tips/#3-auto-all-missing-import-이용하기

## 220824

- 거대한 레거시 프로젝트를 성공적으로 분리하기
  - https://www.bucketplace.com/post/2021-12-03-%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91-msa-phase-1-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EB%B6%84%EB%A6%AC%EC%9E%91%EC%97%85/
  - **fe도 인프라 공부가 꼭 필요하다**

## 220825

- CI 스텝이 완료되기 전에 머지할 수 없게 하자
  - 리베이스 전 빌드 스탭 통과, 리베이스 후 빌드 스탭이 다시 돌자 '괜찮겠지'하고 머지했다가 배포 실패한 케이스가 팀에서 종종 발생
  - CI가 의미와 역할을 다 할 수 있게, 무시하지 못하도록 branch protection rule 설정

## 220830

- 모달 개발시 고려해야할 점들
  - https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/
- [playwright랑 cypress랑 한 판 붙는다고 한다.](https://applitools.com/cypress-vs-playwright-rematch-webinar/?utm_source=marketo&utm_medium=email&utm_content=webinar&utm_term=220908-dbinvite1&utm_campaign=220908-cypress-vs-playwright-rematch-webinar&mkt_tok=Njg3LVRFUi02MTIAAAGGjahlT30AifbC00a_C0_YPVDLVVefp7-1dLUHZmjfkkKaNPf3fOghh_TbWKUJKjc2dfKzCzL4wl8RkI7LjuQvKZah2os5EjZYBFlvnzgiSQ)

## 220831

- 컴포넌트를 잘 설계하기
  - 어떻게 하면 비즈니스 로직 (스타일 로직 포함 pd & po가 정한 정책)과 ui 템플릿을 구분할 수 있을까
  - 어떻게 하면 재사용성이 높을까
  - 어떻게 하면 출처를 한 곳으로 통일할 수 있을까
  - 어떻게 하면 수정을 한 곳에서만 할 수 있을까 == 부수효과 최소화하기
  - 어떻게 하면 내부 로직을 안 보고도 이해가 될까
  - https://www.youtube.com/watch?v=aAs36UeLnTg 도 좋다

## 220901

- 우리 서비스의 네트워크 구조
  - Fe(브라우저) <-> ALB <-> node 여러 대 <-> DB
  - 통신은 모두 소켓을 통해 이루어진다
  - 네트워크 스텝별로 소켈의 통신을 기다려주는 시간, request time out 값 확인해야 한다.
    - 스텝별로 시간을 맞추어주어야 하는데 맞추기 어렵다면 수신하는 쪽에서의 시간을 조금이라도 늘려야 한다.
    - 그렇지 않으면 사용자가 요청을 끊은 것인지, 서버가 끊은 것인지 구분할 수 없다. 전부 500으로 내려오기 때문.
    - cpu, memory 등등 지표가 다 괜찮은데 요청이 원활하지 않으면 소켓을 의심해보아야 한다. 아니면 모듈간 네트워크를 확인하거나. 기본 리눅스에서 소켓을 재사용하지 않는다.
    - 데브옵스가 존재하는 조직에서는 이런 걸 데브옵스가 챙겨주지만 데브옵스가 없으면 직접 할 줄 알아야 한다.
      - 물론 서버리스, 클라우드 환경에서는 몰라도 됨
- 타입스크립트 공변성, 반공변성

  - https://seob.dev/posts/%EA%B3%B5%EB%B3%80%EC%84%B1%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80/
  - https://wiki.lucashan.space/programming/phantom-type/
  - 멤버 변수로 함수 작성시, 이변적으로 타입 추론됨

    ```ts
    // 공변성
    let array: Array<string | number> = [];
    let stringArray: Array<string> = [];

    array = stringArray; // OK
    stringArray = array; // error

    // 반공변
    let logger = (message: string | number) => {};
    let stringLogger = (message: string) => {};

    logger = stringLogger; // error
    stringLogger = logger; // OK

    //이변성: 위의 모든 OK 특성을 허용함
    ```

## 220904

- 디자인 시스템 관련해서 어도비의 디자인 시스템이 공부할 것이 진짜 많다고 한다. ~~근데 언제 보지~~
  - https://spectrum.adobe.com/

## 220905

- 콜백에서의 타입 추론 문제
  - 문제 : [타입스크립트 플레이그라운드](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAKjgQwM5wEoFNkGN4BmUEIcA5FDvmQNwBQwAdjFlAXlnAKqqtwDedOMLiNkILAC44qGFCYBzegF8GzVu1ycAIshjIBQkQFdeUaTz4AfUcYA2duDeOMAJlgJMsrlXQIv8YAhGTCw3VgAhCFcATwAKVz1kaV19ABoUKHMURhiAbQBdAEpDEThgAjgEpIA6Uz4AXibbBycbRP06szgmhrgXd09GbxLBMrLKGGMoEPY7Xnoy1TojYUnpkIAeV2AANwA+VfH+DuQu1hqxCVVxkX5kLJqQZDA44BZSBv3S2-GKqveWBANTQrlGR1+43WMzgAEYIb8bpCRP9qp16lBLuIsODkb9oSEAEwI25IvEEuCnc6Yq5YElwZRFMlwTYAeh2BzoqiAA)
  - 원인 : **TS cannot know when the callback will execute** https://github.com/microsoft/TypeScript/issues/7719

## 220906

- 좋은 코드란?

  - 목적을 달성하는 코드 = 개개인의 우선순위에 따라 다 다르다. 보통 충돌하는 2가지 중에 하나를 골라야 하는 일이 많은듯.
    - 선언적으로 작성하고 싶어요
    - 나중에 코드 수정시 한 파일만 수정하고 싶어요
    - context switching이 너무 많지 않았으면 좋겠어요
    - 등등

- 이전 프로젝트에서의 경험이 다음 프로젝트에서 개선으로 잘 이어지지 않는 이유

  - 이전 프로젝트에서 같은 경험을 나눈 사람과 다른 팀이 됨

- ts 프론트엔드 애플리케이션에서의 클린 아키텍쳐 적용 - 의존성 주입을 중심으로 : https://velog.io/@lky5697/how-to-implement-a-typescript-web-app-with-clean-architecture#%EB%AA%A9%EC%B0%A8

  - 앵귤러가 예시인게 아쉽긴하다 (앵귤러가 별로라는 뜻이 아님)

- Record와 Tuple은 뭘까 : https://kofearticle.substack.com/p/korean-fe-article-record-and-tuple
- React Children의 타입은?
  - class 컴포넌트일 땐 ReactNode
  - 함수 컴포넌트에선 ReactElement

## 221014

그동안 바쁘다는 핑계로 한 달 동안 업로드가 없었는데 오늘 아주 재밌는 일이 있어서 간단하게 기록한다.

- vite 메모리 이슈

  - vite가 초기버전이라 걱정하는 사람들은 많이 봤는데 그래서 어떤 리스크가 있을까?는 잘 몰랐었다가 **오늘 확실히 알았다.**
  - 스토리북 배포를 위해 빌드를 하는데 자꾸 메모리가 터져서 보니까 vite 자체에 메모리 이슈가 있었다.
  - vite 측에선 더 중요한 이슈들이 있어서 메모리 이슈를 해결할 수 없다고 한다. contributor 구함 상태인데 그게 벌써 거의 반년째.
  - [[Bug] JavaScript heap out of memory (Vite build works, Storybook w/WebPack 4 works) #409](https://github.com/storybookjs/builder-vite/issues/409)
  - [vite build error: out of memory #2433](https://github.com/vitejs/vite/issues/2433)
  - 우선은 스토리북 배포에 소스맵, minify는 필요없다고 판단하여 두 옵션을 꺼서 메모리 이슈를 해결했다.
  - 하드웨어의 메모리를 늘려도 되지만 (2배 늘리면 해결됨) 다른 방법으로도 해결이 가능하기 때문에 하지 않았다.
    - 하드웨어의 메모리를 늘리는 것은 최후의 수단으로 고려되는 듯 하다.
      > 음 젠킨스쪽에서 메모리 늘리면 당장 해결은 되긴하는데요 벌써 하드웨어 스펙을 늘리는것이 해결책이 되면 이후에 사이즈가 더 커지면 어떻게 되는건가? 하는 고민도 있을것같아요!

- 라이브러리 빌드시 devDependency가 번들에 포함되는 이슈
  - 개발중인 사내 디자인 시스템 라이브러리 빌드시 devDependency가 번들에 포함되어 사이즈가 크게 나오는 이슈가 있어서 옆자리에 계신 분이 "오늘 이걸 해결하지 못하면 나는 유사개발자다" 라고 선언하시고는 디깅하셨는데 결과가 나왔다.
  - 알고보니 devDependency로 걸었더라도 peerDependency에 명시를 안해주면 프로덕션 빌드시 번들에 포함하여 빌드가 되고 있었다.
- 디자인 시스템으로 디자인 파트와 소통할 때 이슈

  - 사내 디자인 시스템의 단독 패키지화가 거의 막바지이고, 각 컴포넌트 별로 구축 상황도 거의 완료인 것 같아서 1.0.0 버전의 출시를 문의했다.
  - 여기서 버전은 semver를 기준으로 하는 것이었는데 당연히 프론트엔드 파트에서 디자인 파트에게 이에 대해 공유한 적이 없어 미스 커뮤니케이션이 발생했다.

- 타입스크립트 Record타입에 대한 Unsafe member access 린트 에러 문제
  - 디자인 시스템에서 export한 컬러 변수를 사용시 아래와 같은 unsafe member access 린트 에러가 발생한다는 제보를 받았다.
    ![image](https://user-images.githubusercontent.com/76927618/195638492-998efef8-0724-4b7c-b653-f5d586d3c770.png)
  - 해당 린트 룰은 any 타입의 변수의 member에 접근하지 못한다는 룰인데 이해가 안되는 점은 컬러 변수 객체는 any 타입이 아니라 Record로 정상적으로 타입이 존재하는데 왜 에러가 발생하냐는 것이다. 에러가 발생하지 않는 것이 맞는데?
  - [타입스크립트 린트 룰 플레이그라운드](https://typescript-eslint.io/play/#ts=4.8.4&sourceType=module&code=CYUwxgNghgTiAEYD2A7AzgF3gYQPIBlcAlAfQDkBBAWQFEBlALnjimFQgE94BtAIgEsUAMwDmcECl4AaeL2CwA1tNlioHZbzjANAB0FKZvVTpAaAbvyQQQGDYOD8RSDQCMIAV1OGwHKJMMYIFAQGmIgEhoQ-AC2XrIcIBAQSADuGkgwfiKmALoA3ABQoJCwCBgcJjhWGWRQsWjwALzw5SZIQjgExOTU9Nwo7tEuIDD5ReDQcIiomJ2EpAAKFPg0ACqrNExE4BnAADzY1TC19TLcmDCCIjIXVzcYlyjX8LdP94-Pr58Pdy8-b38Pu8rjkAHyFAD0EPgxUmCGQ6CweHmJCWK3Wm3gfg4hQKyO6aLWGwAdG5PNwACw5ApAA&eslintrc=N4KABGBEBOCuA2BTAzpAXGUEKQAIBcBPABxQGNoBLY-AWhXkoDt8B6Jge1tieQEMAZoloBbRCIBGiaLT5kyKVBkjToHaJHBgAviG1A&tsconfig=N4KABGBEDGD2C2AHAlgGwKYCcDyiAuysAdgM6QBcYoEEkJemy0eAcgK6qoDCAFutAGsylBm3TgwAXxCSgA)에서도 재현이 되지 않는다.
  - vsc의 문제라기엔 webstorm에서도 동일하게 발생했다.
  - 뭘까 뭘까 하다가 ide를 몇 번 껐다 켰더니 린트에러가 발생하지 않았다. 아까까지는 "왜 안되지?" 를 고민했다면 여기서부턴 "왜 되지?"를 고민하기 시작했다.
  - 아직도 원인을 모른다.
