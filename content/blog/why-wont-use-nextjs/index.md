---
title: (번역) 내가 Next.js를 사용하지 않는 이유
description: Next.js에 대해 한국에서도 인지도가 높은 Kent C. Dodds가 비판하는 글을 작성하여 화제가 되었습니다. Kent C. Dodds는 이 글에서 그가 Next.js를 사용하지 않는 이유와 Next.js 대신 Remix를 선택한 이유에 대해 자세히 설명합니다.
date: 2023-11-27
lastUpdated: 2023-11-27
tags: [React, Next.js, 번역]
---

> 원문 : [https://www.epicweb.dev/why-i-wont-use-nextjs](https://www.epicweb.dev/why-i-wont-use-nextjs) by [Kent C. Dodds](https://kentcdodds.com/).

새로운 프로젝트가 주어졌습니다. 혹은 기존 프로젝트를 더 현대적인 접근법으로 업그레이드하려는 동기가 있을 수 있습니다. 아니면 아마도 현재 사용 중인 모던 프레임워크에 만족하지 못하고 있거나 자신에게 의문을 품고 대안을 조사 중일 수도 있습니다. 뭐든 간에, 결정을 내려야 합니다.

선택할 수 있는 "모던" 프레임워크는 많습니다. 지금 당장 이러한 선택에 직면하지 않더라도 향후 시장성과 생산성을 높이기 위해 학습에 시간을 투자할 프레임워크를 결정하려고 할 수 있습니다.

저는 Remix가 2020년에 처음 출시된 이후로 계속 사용해왔습니다. 무척 마음에 들었기에 1년 후 커뮤니티를 활성화하는 데 도움을 주기 위해 입사했고, 10개월 후에는 풀 스택 애플리케이션을 구축하는 데 필요한 지식을 사람들에게 가르치는 EpicWeb.dev에서 풀타임으로 일하기 위해 퇴사했습니다. Remix는 그중 큰 부분을 차지합니다. Remix는 풀 스택 웹 프레임워크이며 Next.js와 마찬가지로 웹 애플리케이션을 구축하는 사람들이 직면한 문제를 해결하고자 노력합니다.

Remix의 대안으로 Next.js가 선택될 수 있다는 점에서 사람들은 제가 EpicWeb.dev에서 풀 스택 개발을 가르칠 때 사용하는 프레임워크로 Next.js 대신 Remix를 선택한 이유를 묻곤 합니다. 이런 분들은 아마도 제가 위에서 언급한 시나리오 중 하나에 직면해 있을 것입니다. 이 글은 그런 분들을 위한 글입니다.

저는 소프트웨어 개발의 **긍정적인 측면**에 대부분의 시간과 관심을 기울이고 싶습니다. 차라리 "내가 Remix를 사용하는 이유"라는 제목의 글을 작성하여 제가 Remix에 대해 좋아하는 점에 대해 쓰고 싶습니다(이미 작성하기도 했지만요). 하지만 많은 분들이 Next.js에 대해 구체적으로 물어보셨고, 이 포스팅은 그런 분들을 위한 것입니다.

저는 "Next.js를 비방"하러 온 것이 아닙니다. 그저 Next.js에 대한 제 개인적인 인식과 경험에 대한 솔직한 의견을 덧붙이려고 합니다. Next.js에 대한 부정적인 이야기를 듣고 싶지 않으시다면 지금 읽기를 멈추고 밖에 나가서 가족들과 함께 즐거운 시간을 보내세요.

본격적으로 시작하기 전에, 여러분이 보고 계신 이 사이트는 Next.js로 빌드되었음을 알려드리려 합니다. (브라우저 콘솔에서 확인해 보면 `__remixContext`가 아닌 전역 `__NEXT_DATA__` 변수를 찾을 수 있습니다). 이는 [EpicWeb.dev](https://www.epicweb.dev/) 사이트가 수년간 Next.js로 소프트웨어를 구축해 온 [팀](https://www.epicweb.dev/credits)이 자체적으로 결정을 내려 구축되었기 때문입니다.

이 사실을 말씀드리는 이유는 또 다른 중요한 점을 말씀드릴 기회이기 때문이기도 합니다. 그것은,

**여러분이 사용하는 것이 무엇이든 괜찮습니다.**

원하는 결과물(좋은 사용자 경험)을 달성하기 위해서는 도구 선택보다는 도구를 사용하는 기술이 훨씬 중요합니다.

이 글은 Remix가 훌륭한 사용자 경험을 만드는 데 더 나은 도구라고 생각하기 때문에 Next.js를 사용하지 않는 이유에 대해 설명합니다. 하지만 이런 맥락이 Next.js를 사용한다고 해서 실패자나 나쁜 사람이라는 뜻은 아닙니다. (그렇긴 하지만 Remix를 사용한다면 더 행복하고 생산적일 것으로 생각합니다. 그렇지 않았다면 이 글을 쓰지 않았을 것입니다).

마지막으로, 저는 수년 동안 Next.js 프레임워크를 선호하지 않았다는 점을 말씀드리고 싶습니다. Next.js로 무언가를 만들고 출시한 지 오래되었습니다. 하지만 제 의견을 잘 모른다고 무시하려면 [이 글이 프레임워크에 대한 많은 사람의 실제 경험과 공감을 이끌어 냈으므로](https://twitter.com/kentcdodds/status/1717274167123526055) 그들의 경험도 함께 무시해야 한다는 사실을 알아두셔야 할 것입니다 (권장하지 않습니다).

또한, 저는 계속해서 Next.js의 개발 동향을 파악하고 다른 사람들의 경험담을 듣습니다. 웹 개발자로서의 과거 경험 덕분에 프레임워크가 어떤 접근 방식을 취하는지 직관적으로 알 수 있고 프레임워크가 제 감성과 맞지 않는 부분을 잘 파악할 수 있습니다.

이쯤에서 제가 Next.js를 사용하지 않는 이유를 살펴보겠습니다.

## 웹 플랫폼

저는 10년 넘게 HTTP를 통해 무언가를 배포해 왔습니다. 네이티브 개발(데스크톱과 모바일)에도 손을 댔지만 진정한 고향은 웹이었습니다. 웹 플랫폼을 수용하는 프레임워크에 관심을 가져야 하는 이유를 간단한 이야기를 통해 설명해 드리겠습니다.

몇 년 전, 리액트로 작업하던 중 리액트 컴포넌트 테스팅의 사실상 표준 라이브러리였던 enzyme에 불만을 갖게 되었습니다. 요약하자면, 저는 이런 불만 때문에 리액트 및 기타 UI 라이브러리에서 권장되는 테스트 유틸리티인 [Testing Library](https://testing-library.com/)를 만들기로 [결정했습니다.](https://twitter.com/kentcdodds/status/974278185540964352)

enzyme과 Testing Library의 주요 차이점 중 하나는 enzyme이 렌더링 된 요소와 상호작용하는 데 (지나치게) 유용한 (위험한) 유틸리티가 포함된 [래퍼](https://twitter.com/kentcdodds/status/949339902893871104)를 제공하는 반면 Testing Library는 요소 자체를 제공한다는 점입니다. 이를 원칙으로 정리하면, Testing Library는 플랫폼 API를 래핑 하는 대신 노출시킨다고 말할 수 있습니다.

이를 통해 얻을 수 있는 가장 큰 이점은 바로 **이식성**입니다. Testing Library는 표준 API에 집중함으로써 사람들이 해당 API에 익숙해지도록 도와 다른 작업에서도 도움이 됩니다. 또한 표준 API를 사용하는 다른 도구에서 사용할 수 있는 유틸리티는 특별한 어댑터 없이도 Testing Library와 통합되며, 그 반대의 경우도 마찬가지입니다.

물론 모든 라이브러리는 각자 고유한 API가 있습니다. 예를 들어 Testing Library에는 `findByRole`이 있으며, 이 함수의 입력값을 이해해야 합니다. 하지만 핵심은 DOM에서 직접 작동하고 DOM 노드를 다시 반환한다는 점입니다. API를 래핑 하는 대신 해당 API를 사용자에게 노출합니다. 유용성과 이식성의 균형입니다.

Next.js는 enzyme 같습니다. Next.js가 요청, 헤더, 쿠키, 기타 등등과 상호 작용할 수 있게 하는 유틸리티를 제공하는 반면, Remix는 `loader`들과 `action`들을 통해 해당 API를 사용자에게 직접 노출합니다. Remix에서 이러한 함수들은 웹 패칭 `Request`를 받아 `Response`를 반환합니다. 일부 헤더가 설정된 JSON을 반환하는 방법을 이해하고자 한다면 Remix 문서가 아닌 MDN(사실상 표준 웹 플랫폼 문서)을 참고합니다. 그런 예가 많이 있습니다. Remix에 익숙해지면 웹에 대해서도 더 잘 알게 되고, 그 반대의 경우도 마찬가지입니다.

Next.js는 정적 빌드 시간에 문제가 생겼을 때 웹 플랫폼의 [Stale While Revalidate Cache Control 지시문](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)을 사용하도록 권장하는 대신, 동일한 목표를 달성하기 위해 [Incremental Static Regeneration(ISR)](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)이라는 매우 복잡한 기능을 개발했습니다 (Next.js 문서에 따르면 이 기능은 SWR과 동일한 기능을 수행한다고 명시되어 있습니다).

Angular.js에서 리액트로 전환할 때 저는 Angular.js의 많은 부분을 남겨두고 떠났습니다. Angular.js에 능숙해지기 위해 투자했던 모든 시간이 아깝게 느껴졌습니다. 다시는 그런 일이 일어나지 않기를 바랐습니다. 그래서 사용자 경험 관점에서 제가 원하는 것을 제공할 뿐만 아니라 웹을 개발하는 모든 곳에서 사용할 수 있는 **기술을 제공할 수 있는** 프레임워크에 집중하는 것을 선호합니다.

## 독립성

[OpenNext](https://open-next.js.org/)에 대해 들어보셨나요? 아직 모르신다면 OpenNext 측의 설명을 읽어보세요.

> _"OpenNext는 Next.js 빌드 결과물을 가져와서 서비스 플랫폼으로서 모든 기능에 배포할 수 있는 패키지로 변환합니다. 현재로서는 AWS Lambda만 지원됩니다._
>
> _Vercel은 훌륭하지만 모든 인프라가 AWS에 있는 경우에는 좋은 옵션이 아닙니다. AWS 계정에서 호스팅하면 백엔드와 쉽게 통합할 수 있습니다. 그리고 Vercel보다 훨씬 저렴합니다._
>
> _Next.js는 Remix나 Astro와 달리 서버리스를 사용하여 자체 호스팅할 수 있는 방법이 없습니다. 노드 애플리케이션으로 실행할 수 있습니다. 그러나 이것은 Vercel에서와 같은 방식으로 작동하지 않습니다."_

OpenNext가 존재하는 이유는 Next.js를 Vercel이 아닌 곳에 배포하기 어렵기 때문입니다. 여기서 도덕적 판단을 내리는 것이 아닙니다. 자체 호스팅 서비스를 최대한 매력적으로 만들고자 하는 회사의 인센티브를 인정하지만, 이러한 인센티브로 인해 Next.js를 어디서나 쉽게 배포할 수 있도록 하는 것의 우선순위가 낮아진 것은 분명합니다.

Netlify 팀이 Next.js 지원을 받고 Next.js의 변경 사항을 따라가는 데 **많은** 시간을 할애한 것으로 알고 있습니다. 프레임워크용 어댑터를 구축하는 데는 다른 인프라 호스트가 가장 적합하다는 것도 알고 있습니다(Vercel은 Remix 어댑터를 관리합니다). 하지만 이러한 호스트들로부터 Next.js가 특히나 지원 및 유지 관리가 어렵다는 이야기를 지속적으로 들었습니다.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">&quot;NextJS is easy to run anywhere&quot;<br><br>this is not true - i&#39;m getting tired of people continuing to claim this<br><br>it dismisses the tedious work that the OpenNext community is doing to actually make feasible to run it correctly outside of Vercel<br><br>here is yet another example:<br><br>with server…</p>&mdash; Dax (@thdxr) <a href="https://twitter.com/thdxr/status/1718308244383228124?ref_src=twsrc%5Etfw">October 28, 2023</a></blockquote>

또한 많은 사람으로부터 Next.js를 일반 Node.js 애플리케이션으로 직접 호스팅 하는 것도 큰 고통이라는 이야기를 들었습니다. 흥미롭게도 이 글이 처음 게시되었을 때 몇 명은 단순히 Next.js를 도커 컨테이너에 넣고 끝냈다고 말했습니다. 아주 쉬웠다고 합니다. 그것이 그들에게 도움이 되어 기쁩니다.

하지만 문제는 Next.js와 Vercel 사이의 경계가 명확하지 않아서 Vercel에 배포하지 않는 경우 실제로는 Next.js 문서에 설명된 것과는 다른 프레임워크를 사용하는 것이 되고 그 차이점이 항상 명확하지 않다는 점입니다. 왜냐하면 Vercel은 그에 시간을 투자할 동기가 없기 때문입니다.

Vercel의 현재 접근 방식이 옳거나 그른지에 대해 논쟁할 수도 있습니다. 하지만 분명한 사실은 Vercel의 가격이나 기타 사항이 문제가 된다면 Vercel에서 벗어나는 것도 문제가 될 수 있다는 것입니다. 결국 인센티브로 귀결됩니다.

안타깝게도 Vercel의 가격 정책이 많은 사람에게 큰 문제가 되고 있다는 이야기를 계속 듣고 있습니다.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">we’re going over <a href="https://twitter.com/kentcdodds?ref_src=twsrc%5Etfw">@kentcdodds</a> article on nextjs come join!<a href="https://t.co/7zEp0HAshT">https://t.co/7zEp0HAshT</a></p>&mdash; Dax (@thdxr) <a href="https://twitter.com/thdxr/status/1717547528667742555?ref_src=twsrc%5Etfw">October 26, 2023</a></blockquote>

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Similarly, we were quoted $4k/month for &#39;Vercel Secure Compute&#39;, as we need to use VPC to be HIPAA compliant.</p>&mdash; Roland Király (@kiralykek) <a href="https://twitter.com/kiralykek/status/1717833455516455173?ref_src=twsrc%5Etfw">October 27, 2023</a></blockquote>

여기에 Vercel이 아직 수익성이 없는 것으로 알려져 있다는 사실까지 더해집니다(물론 8년이 지난 지금도 공격적으로 성장하고 있지만, 그들의 **유닛 이코노믹스**에 의문이 듭니다). 이는 당신이 이 하나에 모든 것을 걸고자 할 때 큰 고민거리가 될 것입니다.

처음부터 Remix는 자바스크립트를 실행할 수 있는 곳이라면 어디든 배포할 수 있도록 만들어졌습니다. 이는 표준에 중점을 둔 덕분입니다. 저는 Remix의 이러한 측면을 높이 평가합니다.

Remix는 이 프로젝트를 훌륭하게 관리해 온 Shopify에 인수되었습니다. 마케팅 페이지, 전자상거래, 내부 및 외부 앱 등 다양한 환경에서 Remix를 활용하고 있기 때문에 Shopify에 합류한 후 Remix 팀의 제품 출시 속도가 빨라졌습니다. 또한 Shopify에 인수된 후 Remix 팀은 프레임워크를 활용하여 수익을 창출하는 방법을 고민하는 대신 프레임워크에 모든 시간과 관심을 집중할 수 있게 되었습니다.

## Next.js가 리액트를 먹어치우다

회사로서의 메타에 대한 불안감 때문에 저는 항상 메타가 리액트를 소유하는 것에 대해 약간의 불안감을 느꼈습니다. 하지만 Vercel이 리액트 팀원 상당수를 고용하고 있어서 상황이 나아지지 않아 여전히 불안합니다. 그 이후로 리액트 팀은 협업이 훨씬 덜 이루어진다는 느낌이 들었습니다.

제 생각에는 Vercel이 Next.js와 리액트의 경계를 모호하게 하려고 하는 것 같습니다. 특히 [서버 컴포넌트](https://twitter.com/ryanflorence/status/1714411614802501838)와 [서버 액션](https://twitter.com/flybayer/status/1716574294728126869) 기능에 관해서는 리액트가 무엇인지, Next.js가 무엇인지에 대해 사람들이 많이 혼란스러워합니다.

리액트가 개방형 재단에 속해 있다면 더 좋았을 것 같습니다. 하지만 그것보다는 적어도 Vercel에 합류한 이후보다 [더 협력적이면](https://twitter.com/ryanflorence/status/1714855479120461994) 좋을 것 같습니다.

어쨌든 Next.js에게 유리한 요소 중 하나라고 할 수 있습니다. 적어도 그들은 리액트와 더 밀접하게 협력한다는 이점을 누리고 있습니다. 하지만 제 경험상 팀이 협업하지 않는 것은 소프트웨어에 좋지 않은 신호입니다.

Redwood와 Apollo의 메인테이너들은 이러한 협업 부족으로 큰 문제를 겪었습니다.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">&gt; The React canary channel is stable for frameworks like Next.js to adopt<br><br>Be honest: This point is such a fig leaf. <br>The only framework that can get the insights to do so right now is Next.js, because you have the React team next door and there&#39;s no doc.</p>&mdash; Lenz Weber-Tronic (@phry) <a href="https://twitter.com/phry/status/1718185739328844085?ref_src=twsrc%5Etfw">October 28, 2023</a></blockquote>

**업데이트**: 이 글을 게시하는 동시에 [Matt Carroll](https://twitter.com/mattcarrollcode)(리액트 팀의 개발자 옹호자)가 [저에게 연락을 주셨으니](https://twitter.com/mattcarrollcode/status/1717278830589546616) 좋은 징조입니다!

## 사용자에 대한 실험

Next.js 팀이 실험적인 기능을 안정된 것으로 마케팅하는 데서 비롯된 몇 가지 의문스러운 결정들로 인해 매우 걱정스럽습니다. Next.js가 안정된 기능이라고 출시하는 것들은 리액트의 카나리아 릴리즈에 있습니다. 솔직히 꽤 웃기기도 하고 슬프기도 합니다...

"카나리아"가 무슨 뜻인지 아시나요? "위험에 대한 사전 경고를 제공함으로써 인간에게 위험을 감지하는 데 사용되는" [파수꾼 종](https://en.wikipedia.org/wiki/Sentinel_species)을 말합니다. 따라서 Next.js는 카나리아 기능을 자체에 내장하여 안정적이라고 부른 다음 모든 사용자에게 전달하여 앱을 파수꾼 종으로 효과적으로 전환합니다. 이렇게 생각하지 않을 수도 있고 메시지 전달의 문제일 수도 있지만, 사용해 본 많은 사람으로부터 Next.js의 앱 라우터에 대한 경험이 긍정적이지 않았다는 이야기를 들었는데, 이는 주로 불완전성 때문이라고 생각합니다. 그들은 카나리아입니다.

앱 라우터를 사용하면서 즐거운 시간을 보냈다고 말하는 사람들도 있지만, 그들의 즐거움이 카나리아 기능 때문이 아니라 `pages` 디렉토리의 무게를 줄이고 중첩 라우팅 기능을 사용하는 데서 오는 것이라고 확신합니다.

네, 리액트 서버 컴포넌트는 매우 멋진 기능이며 [프로덕션 버전이 준비되면](https://twitter.com/ryanflorence/status/1714340925865148902) 사용할 수 있게 될 때를 고대하고 있습니다(이 기능을 통해 Remix의 [작업량을 많이 줄일 수 있을 것](https://twitter.com/ryanflorence/status/1686757173202997249)입니다).

이 문제에 대한 자세한 내용은 이 스레드를 확인하세요.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">So, React recommends:<br><br>- you should use a framework with React<br>- frameworks should pin to a canary version of React in order to take advantage of the latest “stable” features that do not yet appear in a stable release<br><br>I have no idea how this is going to play out in the Remix…</p>&mdash; MJ e/acc (@mjackson) <a href="https://twitter.com/mjackson/status/1718304447720546468?ref_src=twsrc%5Etfw">October 28, 2023</a></blockquote>

## 너무 많은 마법

[놀람 최소화 원칙](https://en.wikipedia.org/wiki/Principle_of_least_astonishment)에 대해 들어보셨나요? 이 원칙은 다음과 같습니다.

> _"시스템의 구성 요소는 대부분의 사용자가 예상할 수 있는 방식으로 작동해야 하며, 따라서 사용자를 놀라게 하거나 놀랄 만한 동작을 하지 않아야 합니다."_

“마법“의 양을 줄이는 것은 아마도 “웹 플랫폼“이라는 항목 아래 존재할 수 있습니다. 왜냐하면, 사용자를 놀라게 하지 않는 가장 좋은 방법은 가능한 한 웹 플랫폼 API를 따르고 그 위에 소프트웨어가 수행하는 '마법'의 양을 줄이는 것이기 때문입니다. 마법은 멋지고 상용구 등을 줄일 수 있는 좋은 방법이지만, 저는 자동으로 이런 일이 일어나는 것보다는 무슨 일이 일어나고 있는지 명확하게 알 수 있도록 마법 기능을 선택적으로 사용하고 싶습니다.

Next.js는 여러 가지 면에서 이 원칙을 위반합니다. 한 가지 예로 자동 캐싱을 추가하기 위해 [전역 `fetch` 함수를 재정의](https://nextjs.org/docs/app/api-reference/functions/fetch)하기로 결정한 것을 들 수 있습니다. 저에게 이것은 큰 위험 신호입니다. 그리고 이와 같은 결정들이 저를 멈추게 만들고 만약 Next.js를 채택하기로 결정한다면 다른 놀랄만한 일들이 더 있을지 궁금하게 만듭니다.

우리 대다수는 MooTools 시절부터 플랫폼의 기본 기능을 덮어쓰는 것이 문제를 야기한다는 것을 배웠습니다 (`String.prototype.contains` 대신 `String.prototype.includes`가 있는 이유입니다). 이렇게 하면 웹 플랫폼의 미래에 부정적인 영향을 미칠 뿐만 아니라, 무언가가 작동하지 않는 이유를 디버깅할 때 사용 가능한 리소스를 샅샅이 뒤져서 "Next.js 버전의 fetch"와 "웹 플랫폼 버전의 fetch"를 찾아야 한다는 의미이기도 합니다.

## 복잡성

계속해서 Next.js가 지나치게 복잡해지고 있다는 이야기를 듣고 있습니다. 이는 "너무 많은 마법"부분과도 관련이 있습니다. 리액트에는 [서버 액션](https://twitter.com/reactjs/status/1716573234160967762)뿐만 아니라 많은 농담의 대상이 된 새로운 실험적인 ["taint" API](https://react.dev/reference/react/experimental_taintObjectReference)도 있습니다(여기서 "taint"의 다른 정의를 알게 되었습니다🤦‍♂️).

React가 뮤테이션에 대한 내장 지원을 추가할 가능성에 대해 매우 설렙니다. 하지만 웹 양식의 작동 방식에 대한 [의미를 바꾸게 될까 봐](https://twitter.com/ryanflorence/status/1715459904474104104) 걱정이 되기도 합니다. 이러한 각각의 사항은 복잡성 수준을 높입니다.

[저와 원칙을 공유하는](https://twitter.com/ryanflorence/status/1715469260380926242) 사람들이 Remix 팀을 이끌고 있다는 점, 이러한 유형의 기능이 포함된 후에도 복잡성이 증가하는 전철을 밟지 않도록 보장해 줄 것 같다는 점에 정말 감사합니다. 실제로 Remix 팀은 앞으로 전체 API 사용량을 늘리기보다는 [줄이는 데 주력](https://twitter.com/ryanflorence/status/1697374545139953702)하고 있습니다. 이는 다음 요점으로 이어집니다.

## 안정성

현재 Next.js의 버전은 13입니다. (Remix와 같은 팀에서 만든) 리액트 라우터는 **_훨씬 더 오래 사용되어 왔으며_** 버전 6에 불과합니다. Remix는 거의 2년 동안 버전 1이다가 한 달 전에 버전 2를 출시했습니다. 그리고 안정성에 중점을 둔 Remix 팀 덕분에 웹 프레임워크 중 [가장 지루한 메이저 버전 업데이트인 것으로 유명합니다.](https://twitter.com/ryanflorence/status/1715017282374787261)

코드모드를 통해 업그레이드 과정을 더 쉽게 만드는 데 많은 노력을 기울인 Next.js 팀의 노고를 인정하고 싶습니다. 그리고 프레임워크가 시간이 지남에 따라 발전해야 할 필요성을 인정합니다. 하지만 많은 사람이 Next.js 팀이 Next 13에서 발표한 기능의 불안정성에 대해 불만을 제기하는 것을 보았는데, 카나리아 기능을 포장하여 안정적이라고 부르는 것은 제게는 맞지 않습니다.

올해 초 Remix 팀은 "[future flags](https://remix.run/blog/future-flags)"라는 전략을 사용하여 버전 2 기능을 버전 1의 옵트인 부분으로 출시할 계획을 공유했습니다. 이 전략은 매우 잘 맞아떨어져 하루도 채 되지 않아 활발하게 개발 중인 수많은 Remix 앱이 업그레이드되었습니다.

Remix 팀은 안정성을 매우 중요하게 생각합니다. 그렇기 때문에 모두가 요청했음에도 불구하고 몇 년 전에 시류에 편승하여 [리액트 서버 컴포넌트에 대한 지원](https://remix.run/blog/react-server-components)을 구현하지 않았습니다. 이것이 바로 리액트 라우터에서 8년간 사실상 [단 한 번의 breaking change](https://twitter.com/ryanflorence/status/1715023981340967214)가 있었던 이유이기도 합니다.

이러한 안정성은 저와 제가 만드는 앱에 큰 영향을 미칩니다. 새 버전에 적응하기 위해 모든 코드를 업데이트하면서 몇 시간 동안 혼란을 겪었던 경험이 있기 때문에 항상 업그레이드하기가 두려운 라이브러리가 몇 가지 있습니다. 웹 프레임워크처럼 영향력이 큰 것에는 그런 느낌이 들지 않았으면 좋겠어요. 이런 점에서 Remix는 선물과도 같았습니다.

## 성능

이 글이 Next.js 와 Remix 같은 다른 프레임워크의 기능과 성능을 비교하는 내용일 것이라고 예상하셨을 수도 있습니다. 하지만 진실은 두 프레임워크 모두 멋진 것을 만들 수 있다는 것입니다. 저는 기능보다는 성능이 더 중요하다는 점을 짚고 싶습니다. 개인적으로 Remix를 사용했을 때의 성공의 함정(the pit of success)이 Next.js보다 더 넓다고 생각하지만, 그 이유를 설명하기 위해 애쓰지는 않겠습니다. 어쨌든 이런 것들은 상당히 주관적인 부분이 많으니까요.

Remix 팀이 ["Remix와 Next.js"](https://remix.run/blog/remix-vs-next)라는 질문에 답하기 위해 Next.js의 전자상거래 데모를 다시 작성했을 때, Remix가 훨씬 적은 코드(사용자 경험에서 중요한 입력)로 더 나은 사용자 경험을 제공한다는 것을 잘 보여줬습니다. 그 이후로 Next.js는 앱 라우터(안정적이라고 하지만 이미 언급했듯이 카나리아 기능에 의존하고 있습니다)를 사용하도록 업데이트했기 때문에 다시 한번 비교해 볼 가치가 있다고 생각합니다. 그 글이 작성된 이후 Remix도 out-of-order streaming 같은 새로운 트릭을 배웠습니다.

## 결론

여러분은 제가 말한 내용에 동의하거나 동의하지 않을 수 있습니다. 제가 불공평하다고 생각할 수도 있습니다. 제가 더 많이 혹은 덜 말했길 바랄 수도 있습니다. 이는 여러분의 선택이며, 𝕏, YouTube, Twitch 등에서 제 견해에 대한 여러분의 의견을 공유해 주시는 것을 환영합니다. 다만 제 경험을 무시한다면 이 글에 진정으로 공감한 다른 많은 사람의 경험도 무시하는 것임을 기억하세요.

[Lee Robinson(Vercel의 DX 부사장)](https://twitter.com/leeerob)이 [자신의 블로그에 사려 깊은 답변](https://leerob.io/blog/using-nextjs)을 올렸으니 읽어보시면 좋을 것 같습니다. Lee와 저는 친구 사이이며 그를 많이 존경합니다. 이 글은 제가 제기한 많은 우려 사항을 다루고 있지만 개인적으로 제 우려를 충족시키지는 못했습니다.

다음번에 누군가 질문을 할 때 이 글을 가리키며 간단히 설명할 수 있도록 Next.js 대신 Remix를 추천하고 가르치는 이유를 공유하고 싶었습니다.

간단히 말해, 두 프레임워크 모두 뛰어난 기능을 갖춘 프레임워크이지만 소프트웨어를 유지 관리하기 쉽고 장기적으로 즐겁게 작업할 수 있게 만드는 요소에 대한 제 감성에 Remix가 더 잘 부합한다고 느낍니다. 또한 두 프레임워크 사이에서, Next.js를 가르칠 때보다 수강생들이 더 많은 이전 가능한 지식을 가지고 [EpicWeb.dev](https://www.epicweb.dev/)를 떠날 수 있을 것 같습니다.

2023년 여름, 8주 동안 [EpicWeb.dev](https://www.epicweb.dev/) 워크숍 시리즈의 라이브 프레젠테이션을 진행했습니다. 참석자 중 한 명이었던 Gwen Shapira가 몇 달 후 [저에게 이렇게 말했습니다](https://twitter.com/gwenshap/status/1710115518353658191).

> _"저는 현재 주로 NextJS 스택을 기반으로 개발하고 있는데, 이 강의를 통해 빠르게 역량을 키우고 유능하다고 느끼는 데 필요한 정신적 프레임워크를 얻은 것 같습니다._
>
> _기초가 가장 중요합니다."_

따라서 Next.js를 사용하고 있고 계속 사용할 계획이든, Remix를 채택하고 싶든, 다른 웹 프레임워크를 사용하고 싶든, 제 희망 사항은 Remix를 가르쳐 여러분이 풀 스택 웹에서 직면하는 모든 도전에 맞설 수 있는 준비를 갖추게 만드는 것입니다.

결국 저는 여러분에게 양질의 소프트웨어를 구축하는 방법을 알려줌으로써 세상을 더 나은 곳으로 만들고 싶기 때문입니다.

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
