---
title: '팀문화, 작은 것부터 시작하기'
date: 2022-05-15
lastUpdated: 2022-05-15
description: '최근 팀문화를 위해 시작한 아주 작은 시도들을 소개합니다.'
tags: [Culture]
---

지금 다니고 있는 회사에 21년 9월에 입사했으니 어느덧 9개월째가 되었다. 처음 입사했을 때에는 문화적인 것 외에 코드적인 것에서는 기존에 작성되어있는 코드를 보고 스스로 이해해야겠다는 생각이 강해 따로 튜토리얼 문서가 없었던 것에 의문을 가지지 않았었다. 코드를 보다가 이해가 안되는 부분은 질문하고, 그러다보니 어느덧 적응하고 익숙해지고. 그랬었는데 최근 입사하신 분들께 이런 저런 질문을 받다보니 문서 정리를 다시 해야겠단 생각이 들었다.

그와 더불어 문서작업 외에 팀문화적으로 챙길 수 있는 작은 부분들도 틈틈이 챙겨보았는데 그 과정을 기록하고자 한다.

## 온보딩 튜토리얼 문서 추가

우리 팀의 온보딩 프로세스 개선의 목적은 '최대한으로 친절하게, 그래서 신규입사자가 빠르게 적응하고 퍼포먼스를 낼 수 있게'이다. 이 부분에 있어 팀에서 [참고한 글](https://www.facebook.com/cjunekim/posts/5135784833116709)이 있어 링크를 남긴다.

### 도입 배경

우리 회사는 두 개의 프로덕트가 있는데 신규입사자에 빙의해보자면 참 재미있게도 둘 다 쉽지 않은 프로덕트이다. 가장 메인이 되는 프로덕트는 바닐라 자바스크립트를 기반으로 하되 꽤 유니크한 라이브러리를 이용해 자체적인 프레임워크를 구축하여 개발을 했고, 최근 런칭한 프로덕트는 그 안에서 나뉘는 세 서비스가 각각 저마다의 아키텍쳐를 가지고 있기 때문이다.

그나마 후자의 경우에는 모던 스펙을 사용하고 있기 때문에 모르는 부분이 나온다면 구글신과 리액트 커뮤니티의 도움을 받을 수 있지만, 전자의 경우에는 오롯이 이 회사만의 자산이기 때문에 외부의 도움을 받을 수도 없다. 무조건 팀 내부에서 해결해야하는 것이다.

나조차도 지금 업무를 하는 데에 있어 무리가 있냐 하면 아니지만 전체적으로 다 이해하냐 하면 절대 그렇지 않다. 심지어 기존 구성원들 조차도 마찬가지였다. 최근 레거시 스타일 코드를 정리하는 데 이 스타일 시트가 어느 정도까지 영향을 주는지, 어디서 어떻게 넣어지는지 아무도 알지 못해 당황했던 경험도 있다.

모던스펙으로 마이그레이션 하는 작업이 진행중이지만 팀의 인원은 적고 서비스는 거대해 속도가 그렇게 빠르지도 않은 상황이라 기존의 스택으로 진행하는 업무의 비중이 꽤 높다. **때문에 신규 입사자가 쉽게 이해하고 빠르게 적응할 수 있도록** 튜토리얼 문서를 작성하기로 했다. 사실 문서 작업이라는 게 중요성이 낮게 평가되기 쉽고, 귀찮고 머리아픈 부분으로 인식되는 게 일반적이라 하자고 주장하기 조심스러웠지만 꼭 필요한 작업이라고 생각해 진행했다. 원래는 백엔드 파트에서 먼저 시작했는데 굉장히 좋은 것 같아서 프론트엔드 파트에도 도입하길 제안했다.

### 문서의 내용

튜토리얼 문서라 함은 프로덕트 개발을 할 때 '어떻게 하면 되는지'를 아무것도 모르는 사람이 본다는 가정하에 아주 친절하게 스크린샷과 예제 코드로 정리해놓은 것이다. **그대로 보고 따라하면 될 수준으로 작성하는 것이 목표였다.** 회사의 프로덕트이기에 개인 블로그에 공개해도 되는지를 잘 모르겠어서 실제 문서의 내용을 따로 추가하기는 어려워 글로만 설명하자면 대략적으로 다음과 같은 구성이다.

```md
## 새로운 페이지를 개발해야 할 때

1. ~~를 한다
   (스크린샷)

2. ~~를 한다
   (예제 코드)

   ...

## 디자인시스템에 아이콘을 추가해야 할 때

1. ~~를 한다
   (스크린샷)

2. ~~를 한다
   (예제 코드)

   ...

## FAQ

위 항목들 외에 기존 구성원들이 프로젝트에 적용하며 자주 하는 질문

1. env는 어떻게 가져오나요?

   ...
```

이런 구성이 실제로 신규입사자에게 얼마나 도움이 될지, 얼마나 친절하고 편리할지는 알 수 없기 때문에 신규입사자가 오시면 피드백을 요청드리기로 했다. (일종의 만족도 조사)

그리고 해당 문서에 대해 궁금한 점이 생길 경우 무!조!건! 해당 문서의 댓글로 QNA를 받기로 했다. 가장 빠른 커뮤니케이션 수단은 슬랙이나 직접 대화하는 것이지만, 그렇게 하더라도 댓글로 기록을 남기기로 했다. 그래야 그 이후의 신규입사자가 참고할 기록이 남기 떄문이다. **구전으로만 떠도는 것을 방지하는 것이 가장 큰 목표이다.**

### 작업 방식

작성해야하는 문서가 매우 많기 때문에 한 서비스에 한 명씩 투입되어 문서를 작성하기로 했다. 작성한 문서는 다른 팀원이 검토하고 피드백하는 식으로 크로스체크를 진행한다. 양이 방대하기 때문에 처음부터 완벽하게 모든 케이스에 대한 튜토리얼을 작성하는 것을 목표로 하지는 않았고, 가장 기본적인 부분부터 쓰고 점차 상세하게 보완해나가기로 했다.

## 온보딩 체크리스트 추가

### 도입 배경

지금 회사의 온보딩 프로세스는 크게 2 트랙으로 진행되는데, 첫 번째가 전사 온보딩이고 두 번째가 각자 직무에 맞는 파트 내 온보딩이다. 위에서 이야기했던 튜토리얼 문서는 파트 내 온보딩에 해당한다.

전사 온보딩을 보면 체크리스트를 통해 온보딩 기간동안 해야하는 일들을 헷갈리지 않고 꼼꼼하게 챙길 수 있도록 잘 되어있다. 최근 파트 내 온보딩에서도, 튜토리얼 문서가 추가되는 등 챙겨보아야 하는 것이 많아지면서 체크리스트가 있으면 신규입사자가 안정감을 가지고 온보딩을 진행할 수 있을거라고 기대했다. 특히 같은 프로덕트 파트인 PO, PD(프로덕트 디자이너) 파트도 각자의 체크리스트를 운영하고 있어 프론트엔드 파트에서도 도입하면 좋을거라고 생각했다.

### 체크리스트 내용

팀원들의 의사 또한 긍정적이라서 체크리스트를 추가했다. 체크리스트에는 다음과 같은 내용이 담긴다.

```md
## 시작하기 전에

<!--대충 수습기간 동안 너무 무리하지 않아도 되고, 부담갖지 말라는 내용의 글.
지금까지의 수습회고를 보면 새로운 조직에 적응해야하는 신규입사자 입장에서는 수습을 통과하지 못할까 두렵기도 하고 낯설기도 하고 여러모로 심리적인 안정감이 필요할 거라고 생각되어 추가된 글이다.-->

## 체크리스트

<!--파트 내 온보딩을 진행하며 해야할 일들을 체크리스트로 소개한다. 아래는 예시이다.-->

- [ ] 개발 환경 세팅하기
- [ ] 디자인 파트에 디자인 툴 권한 요청하기
- [ ] 서비스별 개발 튜토리얼 문서 읽어보기
- [ ] 업무(티켓처리) 프로세스 소개 문서 읽어보기

...
```

## 슬랙을 이용한 자동화
