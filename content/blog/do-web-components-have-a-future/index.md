---
title: (번역) 아무도 웹 컴포넌트를 작성하지 않는다면, 웹 컴포넌트에 미래가 있을까요?
description:
date: 2026-11-18
lastUpdated: 2026-11-18
tags: [번역]
---

> 원문: https://nolanlawson.com/2026/10/19/do-web-components-have-a-future-if-nobody-is-writing-them/

지난번 [“플랫폼 활용하기”](https://nolanlawson.com/2026/10/03/why-dont-more-developers-use-the-platform/)에 관한 글을 쓴 뒤, [Hacker News](https://news.ycombinator.com/item?id=49950554)와 [Lobsters](https://lobste.rs/s/srduzv/why_don_t_more_developers_use_platform)의 댓글이 웹 컴포넌트 쪽으로 흘러가는 것을 보고 놀랐습니다. 글에서는 웹 컴포넌트를 전혀 언급하지 않았기 때문입니다.

조금 찾아보고 나니 그럴 만도 하다는 생각이 들었습니다. “플랫폼을 활용하라”라는 구호를 처음 널리 알린 것은 [Polymer](https://polymer-project.appspot.com/blog/2016-05-26-IO-2016-Recap)였습니다. 구글이 웹 컴포넌트 기반 자바스크립트 프레임워크를 만들려던 초기 시도였습니다. 2018년에는 이 구호를 [“우리의 좌우명”](https://www.polymer-project.org/blog/2018-02-26-3.0-preview-paths-and-names)이라고까지 불렀습니다! 많은 사람의 머릿속에 “플랫폼을 활용하라”가 “웹 컴포넌트를 사용하라”라는 뜻으로 깊이 새겨진 듯한 이유를 알 것 같습니다.

제가 그 글에서 웹 컴포넌트를 언급하지 않은 이유 중 하나는 “플랫폼 활용하기”의 좋은 예는 아니라고 생각하기 때문입니다(구호의 유래와는 별개로요). 대신 자바스크립트로 같은 기능을 구현할 때보다 대체로 성능과 접근성이 더 좋고 코드도 훨씬 적게 필요한 HTML과 CSS 기능을 예로 들었습니다. 여기에는 지난 몇 년간 브라우저 벤더와 표준화 단체(예를 들어 [CSS 워킹 그룹](https://www.w3.org/groups/wg/css/)과 [Open UI 프로젝트](https://open-ui.org/))가 이룬 발전이 크게 기여했습니다.

## Modern Web Guidance

그러다 [마스토돈의 한 댓글](https://mamot.fr/@mokobien/117380327572292850)을 통해 구글의 [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance)를 알게 되면서 웹 컴포넌트가 다시 떠올랐습니다. 앞선 글을 쓸 때는 이 도구를 몰랐습니다. 간단히 말해, 최신 브라우저 기능을 더 많이 쓰도록 에이전트에게 건네는 스킬 모음입니다. 에이전트를 위한 “플랫폼 활용하기”인 셈입니다(적어도 크롬 팀이 그리는 모습은 그렇습니다).

그런데 [데모](https://youtu.be/bo3i0FzDUYo)를 보니 웹 컴포넌트를 어디에 활용할 수 있을지 좀처럼 떠오르지 않았습니다. 발표에서 Phil Walton은 Modern Web Guidance로 네이티브 앱에 더 가까운 느낌의 웹 앱을 만드는 방법을 보여줍니다. CSS의 [스크롤 스냅 지점](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap)이나 [스크롤 기반 애니메이션](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations) 같은 기능 덕분에 화면을 터치하면 손가락 움직임을 부드럽게 따라갑니다.

하지만 데모 어디에서도 실제 코드는 보이지 않습니다. 순전히 바이브 코딩입니다. 제가 직접 Modern Web Guidance를 만든다고 생각해 봐도, 에이전트에게 “여기서는 커스텀 엘리먼트(custom element), 섀도우 DOM(shadow DOM), 또는 다른 웹 컴포넌트 프리미티브를 사용하세요. 최종 사용자 경험이 더 좋아질 테니까요”라고 안내할 만한 곳이 떠오르지 않았습니다. 웹 컴포넌트가 최종 사용자 경험을 개선하기 위해 실제로 할 수 있는 일이 *없기* 때문입니다. (섀도우 DOM이 CSS 성능을 개선한다고 주장할 수도 있습니다. 하지만 [저는 이 부분을 지겹도록 벤치마크해 봤고](https://nolanlawson.com/2022/06/22/style-scoping-versus-shadow-dom-which-is-fastest/), 컴파일 시점에 CSS 적용 범위를 제한해도 사실상 같은 성능 향상을 얻을 수 있습니다. Svelte, 뷰, Tailwind 같은 여러 프레임워크와 도구가 이미 그렇게 하고 있습니다.)

그래서 Modern Web Guidance의 실제 [코드](https://github.com/GoogleChrome/modern-web-guidance)를 살펴봤고, 제 짐작이 맞았습니다. 웹 컴포넌트는 나중에 덧붙인 것처럼 느껴집니다. 프로젝트가 시작된 뒤 첫 6개월 동안은 웹 컴포넌트에 대한 언급이 거의 없었습니다. 상황이 바뀐 것은 불과 3주 전 [커밋 하나](https://github.com/GoogleChrome/modern-web-guidance/commit/84ae7251ee919239d5ea85aef25897983f26601e)가 반영되면서였습니다. 그 내용도 주로 웹 컴포넌트를 *이미 사용하는* 사람을 위한 [접근성](https://github.com/GoogleChrome/modern-web-guidance/blob/84ae7251ee919239d5ea85aef25897983f26601e/skills/modern-web-guidance/guides/html/accessible-web-components.md), [사전 렌더링](https://github.com/GoogleChrome/modern-web-guidance/blob/84ae7251ee919239d5ea85aef25897983f26601e/skills/modern-web-guidance/guides/html/prerendering-custom-elements.md), [스타일링](https://github.com/GoogleChrome/modern-web-guidance/blob/84ae7251ee919239d5ea85aef25897983f26601e/skills/modern-web-guidance/guides/html/styling-web-components.md) 등의 지침입니다. 하지만 Modern Web Guidance 어디에도 에이전트에게 웹 컴포넌트 사용을 적극 권장하는 내용은 없습니다. 오히려 [“커스텀 엘리먼트가 정말 필요한지 판단하기”](https://github.com/GoogleChrome/modern-web-guidance/blob/b31dc0a43ff5d19bcf386a3476a216f3b39a6f55/skills/modern-web-guidance/guides/html/web-components.md#decide-whether-you-even-need-a-custom-element)라는 섹션이 통째로 있고, 때로는 대놓고 사용을 말리는 것처럼 들립니다. 지금 작성된 내용대로라면 새 제품을 만드는 에이전트에게 Modern Web Guidance를 건네도 웹 컴포넌트를 선택할 가능성은 낮아 보입니다.

물론 예외가 하나 있기는 합니다. [크롬 확장 프로그램 개발자를 위한 한 줄](https://github.com/GoogleChrome/modern-web-guidance/blob/b31dc0a43ff5d19bcf386a3476a216f3b39a6f55/skills/chrome-extensions/references/extensions/content-scripts.md?plain=1#L102)에서는 페이지에 삽입하는 복잡한 UI에 섀도우 DOM을 사용하라고 권장합니다. 상당히 한정된 용도이기는 하지만, 충분히 타당해 보입니다. [다른 한 줄](https://github.com/GoogleChrome/modern-web-guidance/blob/b31dc0a43ff5d19bcf386a3476a216f3b39a6f55/skills/modern-web-guidance/guides/html/web-components.md?plain=1#L3)에서는 “디자인 시스템, 삽입 가능한 위젯, 독립적으로 동작하는 UI”에 웹 컴포넌트를 사용하라고 제안합니다. 하지만 이 역시 용도가 상당히 한정적이고, “커스텀 엘리먼트가 정말 필요한지 판단하라”라는 전체 취지에서 웹 컴포넌트의 쓸모를 조금 인정하는 정도로 읽힙니다.

## 갈림길에 선 웹 컴포넌트

그렇다면 AI 코딩이라는 새로운 세계에서 웹 컴포넌트는 어디에 자리 잡을까요? 웹 컴포넌트의 장단점에 관한 제 주장을 전부 되풀이하지는 않겠습니다. 이미 [상당히](https://nolanlawson.com/2023/08/23/use-web-components-for-what-theyre-good-at/) [길게](https://nolanlawson.com/2024/09/28/web-components-are-okay/) 다뤘으니까요. 대신 사람들이 더는 코드를 직접 작성하지 않는다면(심지어 읽지도 않는 일이 점점 늘어난다면) 무엇이 달라지는지 이야기하고 싶습니다.

이 부분은 쓰기가 괴로웠습니다. 저는 수년간 웹 컴포넌트 기반 프레임워크인 [LWC](https://lwc.dev)를 개발했고, [웹 컴포넌트 커뮤니티 그룹](https://www.w3.org/community/webcomponents/)과 [접근성 객체 모델 그룹](https://github.com/WICG/aom)에 참여했으며, [블로그](https://nolanlawson.com/category/web-components/)와 [여러](https://podrocket.logrocket.com/what-web-components-are-good-at) [팟캐스트](https://shoptalkshow.com/451/) 등에서 웹 컴포넌트를 옹호해 왔기 때문입니다. 그런데도 에이전트 코딩(agentic coding)으로 웹 컴포넌트가 내세우는 핵심 가치가 크게 약해졌다는 점은 인정해야 합니다.

간단히 말해 웹 컴포넌트는 사람이 HTML을 직접 입력하고, 코드가 귀해서 경제적인 이유로 재사용이 필수였던 시대에 맞춰 설계됐습니다. 이제 그런 전제는 더는 성립하지 않습니다. 적어도 예전만큼 들어맞지는 않고, 하루가 다르게 현실과 멀어지고 있습니다. 그래서 더 많은 사람이 플랫폼의 존재를 거의 의식하지 않은 채 그 위에서 UI를 처음부터 바이브 코딩으로 만들수록, “공통 표준에 맞춰 만들면 컴포넌트를 더 쉽게 가져다 재사용할 수 있다”라는 간단한 소개 문구는 설득력을 잃습니다.

이 변화는 웹 컴포넌트가 내세우는 가치에만 큰 타격을 주는 것이 아닙니다. 웹 컴포넌트에 영감을 준 자바스크립트 프레임워크에도 영향을 미칩니다. 최근에는 주로 “에이전트에게 더 낫겠지”라는 막연한 생각으로 [프런트엔드 전체를 다른 프레임워크로 다시 작성하는](https://dev.to/playfulprogramming/nobody-argued-for-your-stack-51fj) 팀의 사례를 점점 더 자주 읽습니다. 이런 재작성의 타당성과는 별개로(저는 “토큰을 덜 쓴다”거나 “최종 사용자가 더 빠르게 이용할 수 있다”처럼 좀 더 근거에 기반해야 한다고 생각합니다), 앞으로는 이런 사례를 더 많이 보게 될 것입니다. 사람들이 프레임워크 계층도 쓰다 버리면 된다고 생각하기 시작한다면, 그보다 한 단계 아래의 계층을 그다지 중요하게 여길 것 같지는 않습니다.

[2023년에 쓴 글](https://nolanlawson.com/2023/12/30/shadow-dom-and-the-problem-of-encapsulation/)에서 이야기했듯, 컴포넌트 라이브러리는 이미 “필요한 기능을 모두 갖춘” 모델에서 “직접 만들어 쓰는” 방식으로 이동하고 있었습니다. 그 정점에 있는 것이 [shadcdn](https://ui.shadcn.com/)입니다. 방대한 보일러플레이트를 쏟아내는 기계처럼 보일 수도 있지만, 어떤 의미에서는 바로 그것이 핵심입니다. 스타일을 바꾸거나 세부 사항을 조정하려 할 때마다 가로막는 경직된 API를 통해 컴포넌트 시스템을 사용하는 대신, 필요한 조각을 하나씩 가져와 원하는 대로 재구성합니다. 이 변화는 AI 코딩이 등장하기 전부터 진행 중이었고, 이제 LLM 덕분에 “방대한 보일러플레이트”는 단점이 아니라 장점이 됐습니다. 이런 흐름에서는 섀도우 DOM, 프로퍼티에 반영되는 속성(reflected attributes), 그 밖의 웹 컴포넌트 핵심 기능이 가진 장점이 전혀 빛을 발하지 못합니다.

## 웹 컴포넌트를 살릴 길

AI 코딩이라는 새로운 세계에서도 웹 컴포넌트를 옹호할 만한 논거를 두 가지 정도는 제시할 수 있습니다. 조금 약하기는 합니다.

첫 번째는 이른바 마이크로 프런트엔드(micro-frontend)입니다. 큰 UI를 여러 부분으로 나눠 서로 다른 팀이 서로의 작업을 망가뜨리지 않고 개발할 수 있게 한다는 개념입니다. 웹 컴포넌트는 바로 이런 상황을 위해 설계됐습니다. Brian Kardell의 인상적인 표현을 빌리면 [“아군 오인 사격”](https://bkardell.com/blog/FriendlyFire.html)을 피하려는 것입니다. 에이전트의 세계에서 이런 샌드박싱은 사실 잘 알려진 기법입니다. 보통 에이전트가 서로의 영역을 마구 침범하지 못하도록 엄격한 경계 안에 격리하려 하기 때문입니다. 다시 말해, 이론적으로 웹 컴포넌트를 사용하면 여러 에이전트 무리가 UI의 서로 다른 부분을 작업하면서도 CSS, 이벤트, 전역 변수가 서로 충돌하지 않게 할 수 있습니다.

여기에 대한 분명한 반론은 웹에 이미 훌륭한 샌드박싱 프리미티브인 iframe이 있다는 것입니다. iframe은 웹 컴포넌트보다 더 견고한 경계를 제공합니다. 컴포넌트를 서로 격리할 뿐만 아니라 별도의 자바스크립트 렐름(realm)에서 실행하고, `postMessage`만을 통신 채널로 사용합니다. 동기 통신과 비동기 통신의 차이, 메모리 사용량, 닫힌 섀도우 DOM과 열린 섀도우 DOM의 경계가 얼마나 느슨한지 등 따져볼 장단점은 여럿입니다. 여기서 자세히 다루지는 않겠습니다. 그래도 이 경쟁에서 웹 컴포넌트에 승산이 있다고 생각합니다. (Modern Web Guidance의 “디자인 시스템과 독립적으로 동작하는 UI” 역시 웹 컴포넌트가 빛을 발할 수 있는, 마이크로 프런트엔드와 비슷한 사례라고 볼 수 있습니다.)

두 번째 논거는 프롬프트 한 번으로 코드를 다시 작성할 수 있어도 재사용은 여전히 중요하다는 것입니다. 예를 들어 저는 여전히 제가 만든 [`<emoji-picker>` 요소](https://github.com/nolanlawson/emoji-picker-element/)가 웹 컴포넌트를 효과적으로 활용한 좋은 본보기라고 생각합니다. 요즘은 LLM으로 쉽게 다시 만들 수 있다고 해도, 이 컴포넌트를 리액트, 뷰, Svelte를 비롯한 수많은 프레임워크로 일일이 다시 구현할 이유는 없습니다. 이 컴포넌트는 클라이언트에서만 독립적으로 동작하며, 복잡한 작업은 대부분 이모지 데이터나 IndexedDB 등을 관리하는 일입니다. 렌더링이나 생명주기를 관리하기 위해 프레임워크와 연동할 일은 거의 없습니다. 따라서 웹 컴포넌트로 패키징하고 사람들이 원하는 프레임워크 계층으로 감싸서 사용하도록(또는 프레임워크 없이 사용하도록) 하는 것은 여전히 합리적인 배포 방식입니다.

재사용을 위한 [*공통어*](https://en.wikipedia.org/wiki/Lingua_franca)로 웹 컴포넌트를 쓰는 데 반대하는 주장은, 제게는 에이전트 시대에 모든 코드 공유, 나아가 오픈 소스 전반이 시간 낭비라고 말하는 것처럼 들립니다. 동료 André Staltz는 이것이 [명백히 틀렸음](https://socket.dev/blog/ai-has-taken-over-open-source)을 보여줬습니다. 오히려 AI 코딩은 공유되는 코드의 양을 줄이기는커녕 늘리고 있습니다. 에이전트로 무언가를 다시 만들 *수 있다*고 해서 거기에 토큰을 쓸 가치가 있다는 뜻은 아닙니다. ([규모가 작은 프로젝트](https://nolanlawson.com/2025/11/16/the-fate-of-small-open-source/)에 대해서는 여전히 의문이 들지만요.)

더 강력한 반론은 에이전트에게 이미 훌륭한 컴포넌트 재사용 계층인 [리액트](https://youtu.be/P1FLEnKZTAE)가 있다는 것입니다. 하지만 저는 이 주장에 동의하지 않습니다. 앞으로 세상에 필요한 자바스크립트 프레임워크가 리액트 하나로 끝날 거라고는 생각하지 않기 때문입니다. [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark)와 [동형 SSR 벤치마크](https://github.com/marko-js/isomorphic-ui-benchmarks) 같은 성능 벤치마크는 여전히 리액트 도입에 불리한 결과를 보여줍니다. 알고 보면 [가상 DOM은 여전히 순수한 오버헤드입니다](https://svelte.dev/blog/virtual-dom-is-pure-overhead). 물론 리액트도 에이전트 시대에 맞춰 거듭날 수 있습니다. 하지만 그 과정에서 호환성 문제가 생긴다면, 끝없는 업데이트에서 벗어난다는 이유만으로도 웹 컴포넌트를 도입해야 한다는 주장이 더 힘을 얻을 수 있습니다.

그래도 저는 웹 컴포넌트든 리액트든 다른 어떤 프레임워크든 사실 별로 중요하지 않다는 주장이 가장 설득력 있다고 생각합니다. 누군가의 `AGENTS.md`에 달린 각주나 에이전트가 사고 과정에서 잠깐 언급하는 내용 정도일 수는 있겠지만요. 최근 아내를 위해 작은 앱을 바이브 코딩으로 만들었는데, 에이전트는 Preact와 Svelte 사이에서 고민하다가 결국 Preact를 골랐다고 했습니다. 솔직히 저는 전혀 신경 쓰지 않았습니다. 앱이 잘 작동했고 당장 해결하려던 문제를 해결했으니까요.

## 결론

저는 여전히 웹 컴포넌트에 애정이 있습니다. 필요할 때는 어떤 비판에도 기꺼이 웹 컴포넌트를 옹호할 것입니다.

바로 이 사이트에도 웹 컴포넌트가 있습니다! 위쪽의 테마 선택기는 [“HTML 웹 컴포넌트”](https://adactio.com/journal/20618)(또는 “라이트 DOM(light DOM) 컴포넌트”)입니다. 저는 이것이 예전의 “HTML에 jQuery를 살짝 뿌리는” 방식 대신 쓰기에 꽤 좋다고 생각합니다. `querySelector`로 어색한 곡예를 부리는 것보다 `connectedCallback`에 초기 설정 로직을 정의하는 편이 더 깔끔하게 *느껴집니다*. 다만 에이전트에게 웹 컴포넌트를 사용하라고 명시적으로 지시해야 했다는 점은 인정합니다(그렇지 않았다면 에이전트는 별 고민 없이 `querySelector`를 집어 들었을 것입니다).

웹 컴포넌트에 대한 제 애정과는 별개로, 표준이나 프레임워크, 브라우저 분야에서 일하는 웹 컴포넌트 지지자들은 앞으로 AI 코딩 시대에도 웹 컴포넌트가 필요하다고 설득하려면 지금보다 두 배는 더 노력해야 한다고 생각합니다. 저는 이제 이 논쟁의 직접적인 이해당사자는 아닙니다. 그래도 웹 컴포넌트가 오래전부터 안고 있던 몇 가지 문제를 살펴보니 [서버 사이드 렌더링](https://github.com/whatwg/html/issues/10673), [스타일시트 공유](https://github.com/WICG/webcomponents/issues/909), [접근성](https://chromestatus.com/feature/5188237101891584)이 여전히 해결되지 않은 듯해 실망했습니다. 이런 결함은 최종 사용자 경험에 직접 영향을 미치므로 AI 코딩을 하더라도 그대로 남습니다. 웹 컴포넌트에 승산이 있으려면 반드시 해결해야 할 문제입니다.

웹 컴포넌트가 살아남지 못하거나, [소수의 웹사이트](https://chromestatus.com/metrics/feature/timeline/popularity/1689)에만 남아 잊힌 기반 시설로 쇠퇴한다면 무엇을 이루었다고 할 수 있을까요? 그래도 웹 컴포넌트가 분명히 거둔 성과 하나는 “플랫폼을 설명하는 일”이라고 생각합니다. 이것은 [웹 컴포넌트의 초기 목표 중 하나](https://domenic.me/explaining-away-the-webs-magic/)였습니다. `<video controls>`나 `<details>`/`<summary>` 같은 네이티브 HTML 요소를 웹 개발자가 플랫폼 프리미티브로 직접 만드는 방법을 설명하는 것입니다. 실제로 브라우저 개발자 도구를 보면 이 요소들 안에 숨어 있는 “사용자 에이전트 섀도우 DOM”도 볼 수 있습니다.

[![컨트롤이 있는 동영상의 사용자 에이전트 섀도우 루트를 보여주는 Chromium 개발자 도구의 예시입니다. 왼쪽에는 동영상이, 오른쪽에는 섀도우 루트 안의 여러 요소를 보여주는 개발자 도구의 Elements 패널이 있습니다.](https://nolanlawson.com/_astro/video-with-controls.C2qozcS-_2gUwdh.webp)](https://nolanlawson.com/media/2026/10/video-with-controls.png)

Chromium 개발자 도구에서 본 `<video controls>`의 사용자 에이전트 섀도우 루트입니다.

따라서 표준과 내부 일관성의 관점에서 웹 컴포넌트는 분명한 성과를 거뒀습니다. 웹 컴포넌트 덕분에 사용자 영역(userland)과 플랫폼 사이에 어느 정도 일관성이 생겼습니다. 웹 컴포넌트가 없었다면 그 관계가 임시방편처럼 느껴지거나 브라우저마다 제각각이었을지도 모릅니다.

이를 통해 표준과 사용자 영역 사이에는 공생 관계도 생겼습니다. 웹 컴포넌트의 개념이 다시 표준에 반영되면서 새로운 플랫폼 기능의 설계에 영향을 미쳤습니다. [Open UI 프로젝트](https://open-ui.org/)에서 그 모습을 가장 뚜렷하게 볼 수 있습니다. 이 프로젝트에서는 웹 컴포넌트에서 유래한 “파트(parts)”와 “슬롯(slots)”이라는 용어를 자주 사용합니다. 또한 [맞춤 설정이 가능한 `<select>`](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select), [팝오버](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), [인보커 명령(invoker commands)](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) 같은 새로운 기능을 브라우저에 도입했고, 앞으로도 더 많은 기능이 나올 듯합니다.

그러니 앞으로 웹 컴포넌트가 어떻게 되든, 웹 개발자들이 무시하든, 잊어버리든, 몰락을 반기든, 아예 가망이 없다고 치부하든, 이 성과만큼은 빼앗을 수 없습니다. 웹 컴포넌트는 되돌릴 수 없을 만큼 웹 플랫폼 깊숙이 스며들었습니다. 앞으로 웹 컴포넌트를 다시는 작성하지 않더라도, 저는 이 사실을 생각하면 기쁩니다.

> **업데이트:** Cassondra Roberts가 [깊이 있는 답변 글](https://castastrophe.blog/blog/on-writing-the-custom-elements-section-for-modern-web-guidance/)을 작성했습니다. Modern Web Guidance의 웹 컴포넌트 섹션에 관한 맥락을 더 자세히 설명하는 글입니다.

*[페디버스](https://toot.cafe/@nolan/117470449984835742)에서 댓글을 남길 수 있습니다.*

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
