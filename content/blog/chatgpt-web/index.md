---
title: (번역) ChatGPT 웹 리버스 엔지니어링, OpenAI는 10억 사용자를 위해 ChatGPT를 어떻게 만들었을까요?
description:
date: 2026-09-02
lastUpdated: 2026-09-02
tags: [React, 번역]
---

> 원문 : [ChatGPT 웹 리버스 엔지니어링, OpenAI는 10억 사용자를 위해 ChatGPT를 어떻게 만들었을까요?](https://performance.dev/chatgpt)

[Dennis Brotzky](https://x.com/brotzky) · 2026년 7월 2일

![ChatGPT 웹 리버스 엔지니어링, OpenAI는 10억 사용자를 위해 ChatGPT를 어떻게 만들었을까요?](https://media.performance.dev/cdn-cgi/image/width=1024,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/IE67n5ltBXi4.jpg)

새 탭을 열고 [chatgpt.com](https://chatgpt.com)을 입력한 뒤 무언가 물어보세요. 계정도, 로그인도, 스피너도 필요 없습니다. 페이지는 즉시 사용할 수 있고, Enter를 누르면 잠시 뒤 답변이 스트리밍되기 시작합니다. 약 10억 명이 이런 경험을 누립니다. 덕분에 chatgpt.com은 인터넷 전체에서 손꼽히는 웹사이트이자 세계에서 가장 많이 쓰이는 웹 앱 가운데 하나가 되었습니다. 겉보기에는 단순한 인터페이스 같지만, 파고들어 보면 전혀 그렇지 않습니다. 저는 이 웹 앱이 어떻게 만들어졌는지 알아보려고 며칠 동안 페이지 소스와 번들 코드, 네트워크 요청을 살피며 리버스 엔지니어링했습니다.

## 살펴볼 내용

- 제약 조건에서 시작하기
- Next.js에서 리액트 라우터로 마이그레이션한 과정
- 화면을 그리는 가장 빠른 경로
- 10억 사용자 규모의 CSS
- 컴포넌트를 바닥부터 다시 만들지 않기
- 답변 하나하나가 렌더링 문제입니다
- 이제 입력할 수 있나요?
- 모든 것을 기능 플래그로 제어하기
- 첫 토큰까지 가는 가장 빠른 경로
- 낯선 사용자 10억 명을 받아들이기
- ChatGPT와 Claude의 차이

시작하기 전에 밝혀둘 점이 있습니다. 저는 OpenAI에서 일하지 않으며 소스 코드를 본 적도 없습니다. 이 글이 제가 쓴 [Linear](https://performance.dev/how-is-linear-so-fast-a-technical-breakdown)와 [Conductor](https://performance.dev/the-conductor-rewrite) 분석 글과 다른 점은 OpenAI가 ChatGPT 웹에 관해 사실상 아무것도 공개하지 않았다는 것입니다. 이 글에는 역사와 조사, 기술적 통찰이 뒤섞여 있습니다. chatgpt.com 자체의 HTML, JavaScript, CSS, 네트워크 요청에 여러 발표와 트윗, 채용 페이지를 더해 전체 이야기를 구성했습니다.

[chatgpt.com을 처음 불러온 뒤 프롬프트를 입력하는 모습. 누구나 똑같이 경험할 수 있습니다](https://media.performance.dev/posts/p_IE23cQZdfRUJ/tAZ_9h1xnzuz.mp4)

---

## 제약 조건에서 시작하기

웹 앱 아키텍처를 설계할 때 제가 가장 중요하게 생각하는 두 가지는 목표와 제약 조건입니다. 이 두 요소가 이후의 모든 결정을 좌우합니다. 고객은 누구인가요? 초기 로딩은 얼마나 중요한가요? 사용하려면 계정이 필요한가요? 검색 엔진에 노출되어야 하나요? 예산은 어느 정도인가요? 개발자 경험은 얼마나 중요한가요? 기존 아키텍처가 있나요? 이런 질문은 계속 이어집니다.

외부에서 볼 때 ChatGPT의 목표는 명확해 보입니다. 전 세계가 AI와 인터렉션할 때 사용하는 사이트가 되는 것입니다. 전 세계 누구나 어떤 기기에서든 이 사이트에 접근할 수 있어야 합니다. 불안정한 연결에서 ChatGPT를 처음 접한 안드로이드 사용자부터 MacBook Pro로 Pro 구독을 사용하는 파워 유저까지 모두 만족시켜야 합니다.

제약 조건을 정하면 어떤 아키텍처는 아예 선택지에서 사라집니다. 표준 클라이언트 사이드 렌더링(CSR) 앱은 적합하지 않습니다. 의미 있는 화면이 나타나기도 전에 JavaScript를 잔뜩 내려받는 동안 빈 페이지를 바라봐야 하기 때문입니다. Linear 같은 앱은 사용자가 한 번 로그인한 뒤 하루 종일 앱 안에서 지내므로 CSR을 사용해도 괜찮지만, 이 방식은 OpenAI의 목표에 맞지 않습니다.

이 경우 서버 사이드 렌더링(SSR)이 더 나은 접근법이지만 공짜는 아닙니다. 요청이 들어올 때마다 서버가 데이터를 가져오고 HTML을 렌더링해 돌려줘야 하므로 정적 애셋을 제공할 때보다 운영 비용이 많이 듭니다. 개발자가 이해하기도 훨씬 어려운 모델입니다. 앱이 서버와 브라우저라는 두 환경에 걸쳐 존재하므로 어느 API를 어디서 쓸 수 있는지 끊임없이 생각해야 합니다. 결국 하이드레이션 불일치를 마주치거나, 서버에서 실수로 `window`를 참조하거나, 캐시와 렌더링 동작을 디버깅하느라 시간을 쓰게 됩니다. 실패할 수 있는 지점이 더 많은 복잡한 아키텍처입니다. 그래도 최대한 빠른 첫 로딩, 검색 엔진을 위한 실제 HTML, 처음 방문한 사용자에게 훌륭한 경험을 제공하는 것이 목표라면 흔히 감수할 만한 트레이드오프입니다.

ChatGPT는 어떻게 하는지 살펴보겠습니다. 먼저 내부를 들여다보며 어떤 아키텍처와 기술적 결정을 선택했는지 이해해야 합니다. 제가 파악한 현재의 기술 스택은 대략 다음과 같습니다.

```text
Frontend
  React 19 + react-dom              (UI runtime, streamed server render)
  React Router 7 (framework mode)   (routing, loaders, streaming SSR)
  TypeScript                        (language)
  TanStack Query                    (server state on the client)
  Tailwind CSS                      (utility styling + design tokens)
  Radix UI primitives               (menus, popovers, selects, toasts)
  ProseMirror                       (the composer you type into)
  CodeMirror 6                      (answer code blocks + canvas editor)
  Motion                            (animation)
  silk-hq                           (native-feeling sheets on mobile)
  KaTeX                             (math; fonts load on demand)
  Mapbox GL                         (maps inside answers)
  System font stack                 (no webfont for UI text)

Build and delivery
  Vite                              (bundling; per-route JS + CSS chunks)
  Cloudflare                        (CDN, cache, bot defense)
  First-party assets                (everything from chatgpt.com/cdn/assets)

Experimentation and observability
  Statsig                           (flags + experiments, server evaluated)
  Datadog RUM                       (real user monitoring)

Realtime
  SSE over fetch                    (token streaming)
  LiveKit + WebRTC                  (voice mode)
  WebAssembly                       (audio processing, syntax grammars)
```

가장 눈에 띄는 점은 자체 프레임워크나 컴포넌트 대신 대부분 기성 라이브러리를 사용한다는 것입니다. Gemini의 소스 코드를 본 적이 있다면 Google 전용 기술로 가득한 아주 다른 모습이라는 사실을 알 것입니다. ChatGPT는 단순하고 표준적입니다. 10억 사용자 규모로 확장할 앱을 만들 때는 이런 세부 사항이 무척 중요합니다.

## Next.js에서 리액트 라우터로 마이그레이션한 과정

ChatGPT의 역사는 제게 무척 흥미롭습니다. 어떻게 만들어졌는지 기술적인 면을 살펴보기에 앞서 출발점과 주요 사건, 오늘에 이르기까지 밟은 경로를 이해하고 싶었습니다.

ChatGPT는 2022년 11월 30일 Pages Router를 사용하는 Next.js 12 앱으로 출시되었습니다. 지금까지도 제가 가장 좋아하는 Next.js 버전입니다. OpenAI 내부에서 ChatGPT는 큰 기대 없이 내놓은 ["연구 프리뷰"](https://www.technologyreview.com/2023/03/03/1069311/inside-story-oral-history-how-chatgpt-built-openai/)였습니다. 대중의 피드백을 모으려고 미세 조정한 GPT-3.5에 빠르게 껍데기를 씌운 제품이었죠. 이후 무슨 일이 벌어졌는지는 모두가 압니다.

Next.js 시절 제가 가장 좋아하는 흔적 가운데 하나는 아직 Wayback Machine에 남아 있는 라우트 매니페스트입니다. 초기 웹 앱이 얼마나 단순했는지 볼 수 있으며, 같은 빌드 안에 포함된 것으로 보이는 내부 코드스페이스와 워크스페이스 도구의 흔적도 있습니다. 아마 MVP를 서둘러 출시한 결과일 것입니다.

```javascript
// _buildManifest.js from the December 2022 launch build
sortedPages: [
  "/",
  "/_app",
  "/_error",
  "/auth/error",
  "/auth/login",
  "/chat",
  "/codespace",
  "/error",
  "/workspace/[[...tid]]"
]
```

이후 Next.js App Router 시대 내내 chatgpt.com은 App Router를 도입하지 않았습니다. 약 21개월 동안 Pages Router를 사용하다가 Next.js를 완전히 떠났습니다. 저도 과거 프로젝트에서 같은 길을 밟은 적이 있습니다.

마이그레이션은 ChatGPT가 발표한 것이 아니라 외부에서 포착되었습니다. 2024년 8월 27일, [Tibor Blaho](https://x.com/btibor91/status/1828342132643332514)는 chatgpt.com이 실험적으로 일부 사용자에게 Remix 빌드를 제공한다는 사실을 발견했습니다. 9월 4일에는 널리 적용되었고, Remix 공동 창시자인 Ryan Florence는 ["새 Remix 앱이 막 나왔습니다. 바로 chatgpt.com입니다."](https://x.com/ryanflorence/status/1831379475654947233)라고 트윗했습니다. 다음 날에는 [Wes Bos가 YouTube에서 번들을 파헤쳤습니다.](https://www.youtube.com/watch?v=hHWgGfZpk00)

Wes가 발견한 내용은 그 철학을 설명해 주기에 흥미롭습니다. Remix 시절의 앱은 실제 서버 인프라를 운영했습니다. Express 서버가 라우트 로더를 실행하고 약 7,000줄의 JSON을 `window.__remixContext`로 직렬화했습니다. 그런데 서버에서는 실제 UI를 거의 렌더링하지 않았습니다. 셸과 몇몇 프리로드 링크, 테마 스크립트뿐이었습니다. Remix 액션은 어디에도 없었고, 변경 요청은 라이브러리 내장 액션 대신 자체 API를 거쳤습니다. Remix는 본질적으로 클라이언트 사이드 앱을 감싸고, 라우팅과 데이터 전달을 맡으며 하이드레이션에 필요한 기본 틀만 제공했습니다. Ryan Florence는 나중에 ChatGPT가 "대부분의 데이터를 리액트 라우터 로더 대신 TanStack Query로 불러오는" Remix 앱이라고 확인했습니다. Vite를 만든 Evan You는 이 움직임에 대한 커뮤니티의 해석을 한 문장으로 요약했습니다. "여러분 대부분은 SPA만으로 충분할지도 모릅니다."

지금까지의 이야기를 정리하면, 처음에는 Next.js Pages Router로 MVP를 만들었고 이후 SPA와 비슷하게 구성한 Remix로 마이그레이션했습니다. 하지만 이야기는 여기서 끝나지 않습니다.

2024년 11월 Remix v2가 리액트 라우터 v7로 다시 합쳐지자 ChatGPT도 따라갔습니다. 이제 어떤 페이지든 소스를 살펴보면 다음 코드를 볼 수 있습니다.

```javascript
window.__reactRouterContext = {
  "basename": "/",
  "ssr": true,
  "isSpaMode": false,
  "routeDiscovery": {
    "mode": "lazy",
    "manifestPath": "/__manifest"
   },
  // ...
};
```

`ssr: true`입니다. Vite를 기반으로 스트리밍과 서버 렌더링을 모두 사용하는 리액트 라우터 7 프레임워크 모드입니다. 제가 흥미롭게 본 변화는 따로 있습니다. Remix 시절에는 빈 셸을 제공했지만, 지금은 로그아웃 상태의 전체 화면을 실제 HTML로 서버 렌더링합니다. SSR을 훨씬 더 적극적으로 사용하게 된 것입니다.

라우터 안에는 독특한 점이 하나 더 숨어 있습니다. 클라이언트 매니페스트에는 354개 라우트가 있지만 실제 채팅 앱 라우트는 약 13개뿐입니다. 나머지는 모두 같은 코드베이스와 라우터, 배포 환경에서 운영하는 마케팅·랜딩 페이지입니다. 라우트 이름은 리액트 라우터의 파일 규칙에서 그대로 가져온 듯합니다.

```text
routes/_conversation._index             the chat
routes/_conversation.c.$conversationId  a conversation
routes/($lang).codex.pricing            marketing
routes/($lang).business._index          marketing
routes/($lang).atlas.get-started        marketing
```

대부분 회사는 마케팅 사이트를 별도로 분리하는 편입니다. Linear도 마케팅 사이트는 앱과 떨어진 Next.js로 운영합니다. 제가 파악한 바로는 OpenAI는 마케팅 페이지를 제품 앱 안에 포함합니다. 덕분에 랜딩 페이지가 디자인 시스템과 플래그 시스템, 라우터를 공유합니다. 캠페인 페이지에서 채팅으로 이동할 때도 페이지를 새로 불러오지 않고 클라이언트 사이드 내비게이션으로 처리합니다. 꽤 멋진 방식입니다.

![페이지 소스에서 `ssr`이 `true`로 설정된 `reactRouterContext`를 보여주는 chatgpt.com](https://media.performance.dev/cdn-cgi/image/width=920,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/P1CqwN48xBCT.jpg)

## 화면을 그리는 가장 빠른 경로

제가 측정한 로그아웃 상태의 문서는 압축했을 때 84KB였고, 밴쿠버의 노트북에서 가까운 Cloudflare 엣지를 통해 약 50~65ms 만에 첫 바이트를 받았습니다. 이 단일 응답에는 작동하는 앱 셸을 그리는 데 필요한 모든 것이 담겨 있습니다. 사이드바와 "오늘은 어떤 일정이 있나요?"라는 인사말, 입력창으로 이루어진 실제 마크업 약 30KB와 이를 렌더링할 스타일까지 포함합니다. 하이드레이션을 마친 전체 페이지에는 DOM 노드가 548개뿐이라 매우 가볍습니다. 모든 경험은 단순함과 채팅 입력이라는 한 가지 목표에 집중합니다.

하지만 문서에서 마크업과 DOM은 그다지 흥미로운 부분이 아닙니다. 성능 최적화는 `head`에서 이뤄집니다. 번들을 요청하기 전부터 인라인 스크립트가 실행됩니다. 첫 번째는 일반적인 테마 선택 코드입니다.

```javascript
// inlined in <head>, runs before first paint
!function(){try{
  var d=document.documentElement, c=d.classList;
  c.remove('light','dark');
  var e=localStorage.getItem('theme');
  if('system'===e||(!e&&true)){
    var t='(prefers-color-scheme: dark)', m=window.matchMedia(t);
    if(m.media!==t||m.matches){ d.style.colorScheme='dark'; c.add('dark') }
    else { d.style.colorScheme='light'; c.add('light') }
  } else if(e){ c.add(e||'') }
  if(e==='light'||e==='dark') d.style.colorScheme=e
}catch(e){}}();
```

익숙한가요? 제가 [Linear 글](https://performance.dev/how-is-linear-so-fast-a-technical-breakdown)에서 다룬 패턴과 정확히 같습니다. `localStorage`에서 사용자가 저장한 테마를 읽어 첫 화면을 그리기 전에 `html` 요소에 적용하므로 잘못된 테마가 잠깐 나타나는 일이 없습니다.

바로 뒤에는 ChatGPT의 목표를 짐작하게 하는, 제가 특히 좋아하는 세부 사항이 나옵니다.

```javascript
window.__oai_logHTML?window.__oai_logHTML()
  :window.__oai_SSR_HTML=window.__oai_SSR_HTML||Date.now();
requestAnimationFrame(function(){
  window.__oai_logTTI?window.__oai_logTTI()
    :window.__oai_SSR_TTI=window.__oai_SSR_TTI||Date.now()
});
```

모든 사용자에게서 HTML 실행이 시작되는 순간과 그다음 첫 프레임의 타임스탬프를 기록해 실제 사용자 모니터링 시스템으로 보냅니다. 성능이 분명한 우선순위입니다. 첫 바이트부터 인터렉션 가능한 상태까지 전체 로딩 경로를 측정합니다. 측정하지 않으면 개선할 수도 없습니다!

문서 응답 자체도 스트리밍합니다. 리액트 라우터에서 리액트 19의 스트리밍 SSR을 사용합니다. 서버는 먼저 기본 화면인 셸을 보냅니다. 데이터가 준비된 Suspense 영역의 HTML은 작은 인라인 스크립트가 해당 위치에 끼워 넣습니다. 라우트 로더 데이터는 HTML과 병렬로 자체 `ReadableStream`을 통해 도착합니다. 이 로더 데이터 안에는 클라이언트가 무엇을 미리 준비해야 하는지 서버가 내린 결정도 담겨 있습니다. 바로 `shouldPrefetchModels`, `shouldPrefetchHistory`, `shouldPrefetchStarredConversations`입니다. chatgpt.com에서는 서버가 클라이언트 동작의 상당 부분을 결정합니다. 사용자마다 다른 프리페치 계획을 클라이언트에 전달합니다. 클라이언트는 서버가 내려준 사용자별 프리페치 계획을 실행하는 최소한의 계층처럼 보일 정도입니다.

생각해 보면 이 사용 사례에 훌륭한 접근법입니다. 생성형 UI(generative UI)의 가능성을 믿는다면 이를 향한 첫걸음이기도 합니다. 채팅 인터페이스 역시 상당히 비슷하게 작동합니다. 토큰과 마크다운, HTML, 여러 위젯 신호를 통해 답변이 무엇을 보여줄지 결정합니다. 전체 HTML 문서는 그 구조를 그대로 비춥니다.

---

인증보다 화면 렌더링을 먼저 처리합니다. 제가 성능을 목표로 할 때 가장 좋다고 거듭 강조해 온 방식입니다. 로그아웃한 방문자가 인증 검사 때문에 막히는 일은 없습니다. 대신 백엔드 전체에 `/backend-anon/me`, `/backend-anon/models`, `/backend-anon/conversation`이라는 별도의 익명 사용자용 API 영역이 있습니다. 익명 방문자에게도 실제 사용자 ID를 발급해 계정 없이 속도 제한과 실험을 적용합니다. 신규 사용자가 입력창을 쓰기 전에 로그인 여부를 확인하기 위한 추가 네트워크 왕복 요청도 없습니다. 처음 이야기한 제약 조건으로 다시 이어지는 지점입니다.

지금까지 살펴본 모든 설계는 최대한 많은 사람이 브라우저에 [chatgpt.com](http://chatgpt.com)을 입력하고 AI를 바로 사용하게 하는 데 초점을 맞춥니다. 문서를 서버 사이드 렌더링해 인터렉션 가능 상태에 매우 빠르게 도달합니다. 여기에 인증 장벽과 계정 생성도 없애 가입·사용 과정에서 발생하는 가장 큰 이탈 요인 가운데 하나를 제거했습니다.

![JavaScript를 모두 끈 상태에서도 서버 렌더링된 셸을 불러오는 chatgpt.com](https://media.performance.dev/cdn-cgi/image/width=920,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/sY13-xvXU9fp.jpg)

## 10억 사용자 규모의 CSS

ChatGPT는 세계에서 가장 큰 Tailwind 앱 가운데 하나입니다. [Adam Wathan](https://x.com/adamwathan)은 2023년 3월 ChatGPT를 Tailwind 쇼케이스에 올렸습니다. OpenAI가 2024년에 프레임워크를 버렸을 때도 Tailwind는 살아남았습니다. Wes Bos는 [Syntax에서](https://syntax.fm/show/833/next-gen-fullstack-react-with-tanstack) Tanner Linsley에게 "그때 잘리지 않은 건 당신의 TanStack Query와 Tailwind뿐이네요"라고 농담했습니다.

Tailwind의 장점 가운데 하나는 styled-components 같은 CSS-in-JS 솔루션보다 SSR이 훨씬 단순하다는 것입니다. 스크립트 대신 스타일시트로 CSS를 제공하기만 하므로 오버헤드도 모두 아낄 수 있습니다.

자세히 들여다보면 어느 요소에서나 Tailwind 특유의 클래스를 볼 수 있습니다. 다만 한 가지 변형이 있습니다.

```html
<div class="bg-token-main-surface-primary border-token-border-light
            flex h-svh w-screen flex-col @container/thread">
```

`token-*` 클래스는 디자인 시스템입니다. 유틸리티 아래에 놓인 시맨틱 CSS 변수 레이어입니다. 라이트 모드와 다크 모드, 사용자 지정 채팅 테마는 모두 컴포넌트를 다시 렌더링하지 않고 변수 값만 바꿔 작동합니다. styled-components 같은 다른 CSS-in-JS 도구와 비교했을 때 Tailwind가 지닌 또 다른 장점입니다.

`head`에 있는 두 번째 인라인 스크립트는 `localStorage`에서 저장된 채팅 테마를 읽어 첫 화면을 그리기 전에 `html` 요소의 데이터 속성으로 설정합니다. 다크 모드 스크립트와 같은 기법입니다.

CSS도 JavaScript처럼 라우트별 청크로 나뉘어 제공됩니다. 큰 루트 스타일시트 하나와 그보다 더 큰 대화용 스타일시트 하나가 있습니다. 그 뒤부터는 더 세밀해집니다. `code-block.css`, `cot-message.css`, `global-modals.css`가 각 기능과 함께 지연 로딩됩니다. 컴포넌트나 라우트가 의존하는 기준으로 스타일을 훌륭하게 분리했습니다. 덕분에 초기 페이지를 불러올 때는 꼭 필요한 스타일만 기다립니다.

![chatgpt.com이 불러오는 여러 CSS 파일](https://media.performance.dev/cdn-cgi/image/width=920,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/iyBAszFS2JGE.jpg)

제가 가장 좋아하는 CSS와 디자인상의 결정은 무언가를 하지 않기로 한 것입니다. 웹 폰트를 쓰지 않습니다. UI 텍스트는 플랫폼 자체의 폰트 스택으로 렌더링합니다. Apple 기기에서는 SF Pro, Windows에서는 Segoe UI, Android에서는 Roboto를 사용합니다. 페이지가 요청하는 유일한 폰트 파일은 브랜드가 드러나는 부분에 쓰는 아주 작은 세미볼드 woff2이며, KaTeX 수학 폰트는 답변에 수식이 있을 때만 내려받습니다. 느린 연결을 사용하는 사람이 수억 명에 이른다면 가장 빠른 폰트는 이미 기기에 설치된 폰트입니다.

```css
font-family: -apple-system-body, ui-sans-serif, -apple-system, "system-ui", "Segoe UI", Helvetica, "Apple Color Emoji", Arial, "sans-serif", "Segoe UI Emoji", "Segoe UI Symbol"
```

그 밖에 CSS에서 얻을 수 있는 가장 큰 교훈은 꽤 표준적이라는 점입니다. 여러 색상 스킴과 프리미티브를 위한 대규모 테마 변수 집합이 있지만, 전반적으로 표준 Tailwind 패턴과 코드 분할에 의존합니다. 단순하고 효과적이며 빠릅니다.

## 컴포넌트를 바닥부터 다시 만들지 않기

DOM을 열어 보면 메뉴와 셀렉트, 토스트, 스크롤 영역, 팝오버 곳곳에 `data-radix` 속성이 있습니다. ChatGPT는 다른 사람의 사이드 프로젝트에서도 흔히 쓰는, 접근성을 갖춘 기본 UI 구성 요소를 사용합니다. 바로 그 점이 핵심입니다. Linear와 Conductor도 Radix를 사용하므로 제가 분석한 앱 세 개가 모두 같은 선택을 했습니다.

![ChatGPT 드롭다운의 프리미티브로 사용한 Radix 드롭다운](https://media.performance.dev/cdn-cgi/image/width=680,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/GtcQ8QJOB9UC.jpg)

입력창은 실제로 복잡성을 감수하는 부분입니다. 단순한 `textarea`처럼 보이지만 완전한 ProseMirror 편집기입니다. 서버는 시각적으로 똑같은 정적 플레이스홀더를 렌더링하고, 번들이 도착하면 ProseMirror 편집기가 해당 자리에 하이드레이션되어 정적 플레이스홀더를 실제 편집기로 전환합니다. OpenAI는 이 레이어를 중요하게 생각해 ProseMirror와 CodeMirror를 모두 만든 [Marijn Haverbeke를 후원하기까지 합니다](https://x.com/romainhuet/status/1841889813105971646). CodeMirror는 캔버스의 코드 편집 기능에도 사용됩니다.

![ChatGPT 입력창의 리치 텍스트 편집기로 사용한 ProseMirror](https://media.performance.dev/cdn-cgi/image/width=680,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/Jp5rX7RkW42K.jpg)

리치 텍스트 편집기로 작업해 본 적이 있다면 서식과 커서 위치, 위젯, 멘션 같은 문제로 얼마나 고생하는지 알 것입니다. ProseMirror와 그 위에 구축한 TipTap 같은 라이브러리는 이런 작업을 훨씬 쉽게 해 줍니다.

전반적으로 디자인 시스템은 매우 절제되어 보였습니다. 애니메이션은 거의 없고 드롭다운은 즉시 열립니다. 색상 팔레트는 아주 단순하고 형태도 복잡하지 않습니다. 처음 살펴본 제약 조건으로 다시 이어집니다. 누구나 사용하는 앱을 만들려면 UI를 최대한 단순하게 유지해야 합니다. 솔직히 말하면 이렇게 단순한 모습이 무척 아름답다고 생각합니다. 형태보다 기능에 철저히 집중합니다.

![](https://media.performance.dev/cdn-cgi/image/width=400,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/NVJ4_HwuLM7Y.jpg)

![](https://media.performance.dev/cdn-cgi/image/width=400,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/2XfmngHsBVPK.jpg)

![](https://media.performance.dev/cdn-cgi/image/width=400,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/QyZ168B9kmUT.jpg)

![](https://media.performance.dev/cdn-cgi/image/width=400,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/CYaFSlezAG6E.jpg)

![](https://media.performance.dev/cdn-cgi/image/width=400,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/dRlIwFSHmHEM.jpg)

![](https://media.performance.dev/cdn-cgi/image/width=400,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/P4Z7JK5E4Rxn.jpg)

성능 측면에서는 직관에 어긋나 보이는 점을 하나 발견했습니다. 메시지 목록을 가상화(virtualization)하지 않습니다. 대화의 모든 메시지가 DOM에 계속 남습니다. 제가 파악한 바로는 ChatGPT 대화는 대부분 짧고, 10억 명이 페이지 내 검색을 사용할 수 있어야 하며, 가상화에는 상당한 복잡성과 접근성 비용이 따릅니다. 처음의 제약 조건으로 다시 돌아가 보면 더 폭넓은 사용자를 위해 최적화했다는 점이 분명합니다. 평균 채팅 기록이 얼마나 긴지 보여주는 데이터도 충분히 가지고 있을 것입니다.

---

### 데이터 가져오기에 관한 짧은 여담

클라이언트 데이터는 TanStack Query에서 처리하며 최근에 추가된 기술이 아닙니다. Remix 마이그레이션이 화제였을 때 Tanner Linsley는 Syntax에서 "오래전부터 사용해 왔다"고 밝혔고, 마이그레이션 뒤에도 그대로 유지했다고 말했습니다. 통합 범위는 루트에 프로바이더 하나를 두는 수준보다 깊습니다. 서버가 제공한 문서는 서버 데이터를 하이드레이션할 `window.__REACT_QUERY_CACHE__` 전역 변수를 초기화하며, 바로 옆에는 `Promise.withResolvers`를 위한 세 줄짜리 폴리필이 있습니다.

저는 TanStack Query와 Vercel의 SWR 같은 비슷한 라이브러리를 모두 무척 좋아합니다. 이제 이런 라이브러리는 낙관적 요청과 서버 사이드 렌더링, 캐시 처리를 포함한 클라이언트 사이드 데이터 가져오기를 설정하는 가장 단순한 방법이 되었습니다. 여기서는 서버 사이드 렌더링과 함께 모든 기능을 활용하며 아주 잘 작동합니다.

## 답변 하나하나가 렌더링 문제입니다

입력창은 사용자가 글을 쓰는 곳이지만 ChatGPT가 실제로 살아 숨 쉬는 곳은 답변입니다. 답변 하나를 그리는 일은 보기보다 어렵습니다. 스트리밍 채팅 인터페이스를 만들어 본 적이 있다면 얼마나 힘든 일인지 알 것입니다. 네트워크 탭을 열면 답변은 토큰 스트림으로 보입니다. 동시에 DOM을 열어 보면 토큰이 도착할 때마다 답변 영역을 다시 파싱하고 렌더링합니다. 청크와 스크롤, 재렌더링을 비롯한 수많은 엣지 케이스가 작업을 어렵게 만듭니다.

도착하는 토큰 하나하나는 마크다운 조각이며, 앱은 점점 길어지는 메시지를 매번 다시 파싱하고 그 자리에서 재렌더링합니다. 문제는 스트리밍 도중의 마크다운이 거의 언제나 미완성이라는 것입니다. 아직 닫히지 않은 코드 펜스일 수도 있고, 세 번째 행까지만 도착한 표이거나, 짝이 될 기호를 기다리는 볼드 마커일 수도 있습니다. 잘못 파싱하면 파서가 대상을 계속 다르게 해석하면서 프레임마다 레이아웃이 깨집니다. 하지만 ChatGPT는 이 모든 상황에서도 부드럽게 작동합니다.

제가 좋아하는 세부 사항은 코드 블록의 실체입니다. 스타일을 입힌 `<pre>`처럼 보이지만 실제로는 완전한 CodeMirror 편집기입니다. ProseMirror와 같은 개발자가 만들었으며 캔버스에서 실행하는 것과 같은 라이브러리입니다. 답변의 코드 블록을 검사하면 DOM에서 `.cm-editor`와 `.cm-content`를 찾을 수 있고, 구문 강조와 복사 버튼까지 연결되어 있습니다.

![](https://media.performance.dev/cdn-cgi/image/width=680,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/BEizz1_nRkfm.jpg)

수식도 똑같이 세심하게 처리합니다. 수식은 KaTeX로 렌더링하며 매번 두 벌을 제공합니다. 하나는 눈에 보이는 시각적 버전이고, 그 아래에는 숨겨진 MathML `<math>` 트리가 있습니다. 두 번째 사본이야말로 세심한 부분입니다. 스크린 리더가 수식을 소리 내어 읽을 수 있고, 스크린샷이 아닌 실제 수식으로 선택하고 복사할 수도 있습니다. 대부분 앱이라면 평면 이미지로 렌더링했을 화면에서 쉽게 건너뛸 만한 세부 사항이지만, ChatGPT는 건너뛰지 않았습니다.

![](https://media.performance.dev/cdn-cgi/image/width=680,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/sPhQnA5hw6LW.jpg)

앱 전체에서 반복되는 패턴과 잘 맞습니다. 답변 주변 요소는 의도적으로 평범하고 널리 쓰이는 것들을 재사용합니다. 실제로 많은 엔지니어링 자원을 투입하는 유일한 곳은 답변입니다. 제품의 모든 가치가 응답에 달려 있다면 응답을 렌더링하는 일 자체가 제품이기 때문입니다.

## 이제 입력할 수 있나요?

로그아웃 상태에서 chatgpt.com을 콜드 로딩하면 JavaScript 청크를 100개 넘게 가져옵니다. 문서는 진입점과 리액트 벤더 청크, 일치하는 라우트에 필요한 모듈을 비롯한 핵심 파일 14개만 모듈 프리로드합니다. 나머지는 모두 가장 중요한 단 하나의 질문 뒤로 미룹니다. 이제 입력할 수 있나요?

코드에서 직접 확인했기에 이것이 핵심 질문이라는 사실을 압니다. 서버 부트스트랩 설정에는 이름 그대로 `deferStartupImportsUntilComposerTTFI`라는 플래그가 있습니다. 입력창이 인터렉션 가능한 상태가 될 때까지 시작 시점의 임포트를 미룬다는 뜻입니다. 부팅 절차 전체가 사용자가 입력을 시작할 수 있는 순간을 중심으로 구성되어 있습니다.

처음부터 목표를 완전히 이해하면 엔지니어링 결정을 빠르게 내릴 수 있다는 또 다른 예입니다. 모든 것이 사용자가 ChatGPT에 입력할 수 있게 하는 데 집중합니다. 앞서 살펴봤듯이 인터렉션 가능 시간은 ChatGPT가 모니터링하는 매우 중요한 지표입니다. 누군가 chatgpt.com을 방문했을 때 입력창에 글을 쓰는 동작을 막지 않는 것이 이 지표의 목적입니다.

라우트 청크에는 이야기가 하나 더 있습니다. 파일명 대부분은 익명 해시지만 대화 화면만은 `conversation-small`이라는 이름으로 제공됩니다. 라우트 매니페스트 전체에서 수백 번 참조하는 간소한 채팅 코어입니다. 코드 블록 렌더링과 `chain-of-thought` 관련 뷰 같은 요소는 별도 청크에 담겨 답변에 필요할 때만 도착합니다. 신규 방문자가 내려받는 채팅은 의도적으로 작게 만든 버전이며 나머지는 모두 필요할 때 불러옵니다. 필요한 항목만 로딩하도록 보장하는 영리한 기법입니다.

청크 그래프에는 주목할 만한 세부 사항이 하나 더 있습니다. 거의 모든 항목이 퍼스트파티입니다. 모든 청크와 스타일시트, 폰트는 Cloudflare 뒤에 있는 `chatgpt.com/cdn/assets`에서 30일 캐시 헤더와 함께 제공됩니다. 서드파티 CDN 도메인이 없으므로 DNS 조회나 TLS 핸드셰이크가 추가로 발생하지 않습니다. 기억하세요. 네트워크는 적이며, 오리진이 하나 늘 때마다 DNS 조회와 TLS 연결 비용도 추가됩니다.

팀이 도메인 헤더나 전반적인 도메인 설정을 잘못 다뤄 핸드셰이크 요청이 생기는 모습을 자주 봅니다. 그러면 네트워크 요청 시간이 두 배로 늘어납니다. 너무도 간단히 고칠 수 있는 문제라 엔지니어링 팀이 얼마나 자주 틀리는지 볼 때마다 놀랍니다. CORS 설정 오류와 불필요한 OPTIONS 요청, 핸드셰이크는 항상 피해야 합니다.

마지막으로 눈에 띄는 부재가 하나 있습니다. 서비스 워커가 없습니다. Linear는 약 1,200개 애셋을 미리 캐시해 앱을 오프라인으로 실행합니다. ChatGPT는 일반적인 HTTP 캐시 외에는 별도 캐시를 사용하지 않습니다. 제 생각에는 의도적인 선택입니다. ChatGPT는 끊임없이 배포되고, 반대편에 모델이 없으면 오프라인 채팅 앱은 쓸모가 없습니다. 오래된 서비스 워커는 수정 사항을 배포한 뒤에도 살아남을 수 있는 몇 안 되는 버그입니다. 제품이 네트워크를 통한 대화라면 오프라인 우선 설계가 주는 것은 가치가 아니라 복잡성입니다.

[동영상](https://media.performance.dev/posts/p_IE23cQZdfRUJ/98sbUCnYp6qe.mp4)

---

## 모든 것을 기능 플래그로 제어하기

서버가 제공한 HTML에는 377KB짜리 JSON을 담은 스크립트 태그가 숨어 있습니다. 클라이언트 부트스트랩입니다. 인증 상태와 로케일, 지역, 서버에서 평가한 전체 실험 상태의 스냅샷이 담깁니다. 익명 ID와 지역을 기준으로 요청마다 계산합니다. 제가 확인한 날에는 기능 게이트 556개, 동적 설정 144개, 실험 레이어 192개를 모든 방문자의 문서에 인라인으로 삽입했습니다.

```json
"statsigPayload": {
  "feature_gates": {
    "3479398748": {
      "name": "3479398748",
      "rule_id": "6cYbYFM2vjVEPNwAxdQvEB:100.00:3",
      "value": true
    }
    // ... about ~555 more
  },
  "dynamic_configs": { },
  "layer_configs": { }
}
```

여기에는 자세히 살펴볼 만한 결정이 세 가지 있습니다. 첫째, 플래그를 서버에서 평가해 인라인으로 삽입합니다. 단순한 통합 방식은 부팅할 때 플래그 서비스에서 플래그를 가져옵니다. 그러면 네트워크 요청 때문에 렌더링을 막을지, 기본값으로 렌더링했다가 플래그가 도착했을 때 화면이 깜빡이게 둘지 선택해야 합니다. OpenAI는 요청 자체를 없앴습니다. 리액트가 하이드레이션될 때는 이미 모든 게이트의 값이 정해져 있습니다. 가장 좋은 네트워크 요청은 아예 하지 않는 요청입니다.

둘째, 게이트 이름을 해시 처리합니다. 읽을 수 있는 이름 대신 `3479398748`을 사용합니다. ChatGPT 프런트엔드에서 출시 전 기능을 캐내는 유출자 생태계가 형성되어 있으며, 읽을 수 있는 플래그 이름은 로드맵을 그대로 넘겨주는 셈이었습니다. 이 글을 쓴 저도 그중 한 명입니다.

셋째, 실험 트래픽이 퍼스트파티입니다. 이벤트 로그는 Statsig 엔드포인트 대신 자체 도메인의 `chatgpt.com/ces/v1/`을 거칩니다. Statsig는 과거 광고 차단기를 피하려고 featuregates.org 같은 도메인을 번갈아 사용했습니다. 자체 오리진을 통하면 모든 결정을 이끄는 실험 데이터에 "광고 차단기를 사용하는 모든 사람" 모양의 사각지대가 생기지 않습니다.

하지만 제가 가장 좋아하는 플래그는 로딩 전략 자체를 제어하는 플래그입니다. `deferStartupImportsUntilComposerTTFI` 옆에는 이름 그대로 문서가 자체 CSS와 JavaScript를 불러오는 방식을 바꾸는 서버 사이드 스위치인 `promoteCss`와 `stripModulepreloadImports`가 있습니다. 두 가지 변형을 모두 배포하고 수백만 명의 로딩 시간으로 어느 쪽이 나은지 결정합니다.

이 시스템의 규모는 아무리 강조해도 지나치지 않습니다. Statsig 사이트에 실린 OpenAI의 인용문은 기능 600개 이상을 플래그 뒤에서 출시했다고 말하며, 데이터 엔지니어링 팀은 "수억 명의 사용자를 대상으로 수백 가지 실험"을 한다고 설명합니다. Codex 출시 당시 한 엔지니어는 모놀리스를 배포한 뒤 "플래그를 켰다"고 출시 당일 밤을 묘사했습니다. 그리고 2025년 9월에는 [OpenAI가 Statsig를](https://openai.com/index/vijaye-raji-to-become-cto-of-applications-with-acquisition-of-statsig/) 11억 달러에 인수하고 창업자 Vijaye Raji를 애플리케이션 CTO로 임명해 ChatGPT와 Codex 엔지니어링을 이끌게 했습니다. 기능 플래그 도구가 너무 마음에 든 나머지 회사를 인수하고 그 팀에 제품을 맡긴 것입니다. 실험이 제품 개발에서 얼마나 중심적인 역할을 하는지 이보다 더 분명하게 밝힐 방법은 떠오르지 않습니다.

![](https://media.performance.dev/cdn-cgi/image/width=920,quality=90,format=auto,fit=scale-down/posts/p_IE23cQZdfRUJ/BtMlu-l_BdI0.jpg)

## 낯선 사용자 10억 명을 받아들이기

지금까지 모든 섹션은 같은 점을 높이 평가했습니다. 계정 없이 바로 입력할 수 있다는 것입니다. 이 열린 문이 전략의 전부지만, 아직 글에서 다루지 않은 비용이 따릅니다. 지구상의 누구나 로그인 없이 최첨단 모델에 무료로 프롬프트를 보낼 수 있다면 누구든 스크립트로 같은 일을 할 수 있습니다. 로그인 없이 제공하는 무료 모델 추론은 봇을 끌어들이며, 악의적인 요청 하나하나가 실제 GPU 비용을 밖으로 흘려보냅니다. 그러므로 정말 중요한 질문은 ChatGPT가 왜 계정 없이 사용자를 받아들이는지가 아닙니다. 어떻게 하루에 수십억 번씩 이 일을 하면서 버티는가입니다.

답은 거의 보이지 않는 보안 레이어이며, 보이지 않는다는 점이 바로 핵심입니다. 메시지를 하나 보내기도 전에 백그라운드에서는 이미 두 가지 일이 벌어집니다. Cloudflare는 페이지를 불러오는 순간 실행되는 `cdn-cgi/challenge-platform` 요청을 통해 작업 증명 챌린지(proof-of-work challenge)를 수행합니다. 모든 클라이언트가 약간의 CPU를 써서 실제 브라우저임을 증명하게 합니다. OpenAI가 Sentinel이라고 부르는 자체 악용 방지 시스템도 샌드박스 iframe 안에서 부팅됩니다. `sentinel/frame.html`과 별도로 버전을 관리하는 `sentinel/sdk.js`를 사용해 보호 대상 앱과 격리된 상태에서 브라우저 환경 정보를 모아 클라이언트를 식별합니다.

실제로 앞 섹션에서 이 시스템의 앞단을 보았습니다. 사용자가 메시지를 보내기 전에 앱이 실행하는 `chat-requirements` 준비·완료 핸드셰이크입니다. 진짜 목적은 따로 있습니다. 사용자가 입력하는 동안 악용 검사를 미리 통과시켜, Enter를 누를 때는 악용 방지 검사를 이미 마친 상태로 만드는 것입니다. 이 앱의 다른 모든 부분과 같은 방식입니다. 비용이 큰 작업은 사용자가 이미 하고 있는 동작 뒤에 숨겨 일찍 처리하고, 정작 사용자가 원하는 동작은 즉시 일어나는 것처럼 느끼게 합니다. 봇 방어 비용도 인증 검사와 프리페치처럼 미리 치러 둡니다.

보호 체계는 깊숙이 작동합니다. chatgpt.com에서 Cloudflare 챌린지를 해독한 연구자들은 이 시스템이 사용자를 사람으로 판단하기 전에 실행 중인 페이지의 수십 가지 프로퍼티를 검사한다는 사실을 발견했습니다. 앱 자체의 리액트 라우터 상태도 포함됩니다. 마음에 들든 걱정스럽든, 낯선 사용자와 첫 무료 토큰 사이에 얼마나 많은 장치가 놓여 있는지 보여주는 사례입니다. 사용자가 단 1초도 이를 느끼지 않도록 팀이 얼마나 애쓰는지도 알 수 있습니다.

```text
// fired in the background before you've typed a word
GET   /cdn-cgi/challenge-platform/...        Cloudflare proof-of-work
GET   /backend-api/sentinel/sdk.js           anti-abuse SDK
      sentinel/frame.html                    loaded in a sandboxed iframe
POST  /backend-anon/sentinel/chat-requirements/prepare
POST  /backend-anon/sentinel/chat-requirements/finalize
```

아무도 보지 못하는 "로그인 없이 바로 입력하기"의 나머지 절반입니다. 열린 문은 보안이 없다는 뜻이 아닙니다. 소비자용 웹에서 가장 공격적인 봇 방어 스택 가운데 하나에 마찰 없는 문을 달고, 그 비용이 사람에게는 가지 않고 스크립트에만 돌아가도록 조정했습니다. Anthropic은 문을 아예 열지 않는 방식으로 같은 문제를 해결합니다. OpenAI는 문을 열어 둔 채 문지기를 숨기기로 했습니다. 이 섹션에서 살펴본 거의 모든 요소는 사용자가 문지기의 존재를 눈치채지 못하게 하려고 존재합니다.

## 첫 토큰까지 가는 가장 빠른 경로

앞에서 살펴본 모든 것은 단 하나의 인터렉션을 위해 존재합니다. Enter를 누르면 토큰이 나타나는 경험입니다. 로그아웃한 사용자의 네트워크 관점에서는 다음과 같은 일이 일어납니다.

사용자가 아직 페이지를 읽는 동안 앱은 이미 `/backend-anon/conversation/init`을 호출하고, 악용 방지 레이어인 Sentinel의 chat-requirements 검사를 실행합니다. 사용자가 내용을 제출하기도 전입니다. Enter를 누르면 짧은 `prepare` 호출로 요구 조건을 여전히 충족하는지 확인한 뒤 메시지를 보냅니다.

```text
POST /backend-anon/f/conversation
content-type: application/json

200 OK
content-type: text/event-stream
```

답변은 POST `fetch`를 통한 서버 전송 이벤트(SSE) 스트림입니다. 2022년부터 사용한 것과 같은 패턴이며, 토큰은 이미 그려진 셸에 도착하는 대로 렌더링됩니다. 전송 방식이 평범한 것은 의도적입니다. 미리 처리한 악용 검사부터 스트리밍 셸에 이르는 전체 아키텍처는 사용자가 마침내 Enter를 누르는 순간 모델만 기다리도록 구성되어 있습니다.

요청 본문도 세심하게 설계했습니다. 뷰포트 크기와 픽셀 비율, 다크 모드 상태, 페이지 로딩 후 지난 시간을 담은 `client_contextual_info` 객체가 있습니다. 백엔드가 답변이 표시될 화면 환경을 파악하거나 검토에 필요한 핵심 데이터를 더 기록하는 용도입니다.

[동영상](https://media.performance.dev/posts/p_IE23cQZdfRUJ/ErZt9KNTc_qb.mp4)

---

## ChatGPT와 Claude의 차이

ChatGPT 웹 앱과 Claude의 트레이드오프를 비교하면 각 회사가 어디에 집중하는지 분명해집니다. chatgpt.com을 열면 계정 없이 몇 초 안에 프롬프트를 보낼 수 있습니다. 이 무료 익명 답변은 OpenAI에 실제 GPU 비용을 발생시키며, OpenAI는 광고로 비용을 일부 상쇄하기 시작했습니다. claude.ai를 열면 단어 하나를 입력하기도 전에 로그인 장벽과 온보딩을 거쳐야 합니다. Anthropic은 엔터프라이즈를 선택했습니다. OpenAI가 소비자 시장에 베팅한 결정이 엔지니어링 트레이드오프 전체에 퍼지듯 Anthropic의 선택도 모든 결정에 영향을 줍니다.

집중이 얼마나 많은 것을 단순하게 만드는지 인정해야 합니다. Anthropic의 선택 덕분에 더 단순한 문제를 풀 수 있습니다. 모든 사용자가 인증되어 있고, 악용할 수 있는 범위는 더 좁으며, 낯선 사용자 10억 명을 위해 무료 체험 화면을 서버 렌더링할 필요도 없습니다. 기술 스택에서도 드러납니다. claude.ai는 CDN에서 직접 제공하는 클라이언트 사이드 렌더링 방식의 싱글 페이지 앱입니다. 어차피 모든 사용자가 로그인한다면 지극히 합리적인 선택입니다. Linear가 클라이언트 사이드 렌더링을 유지할 수 있는 것과 같은 논리입니다. OpenAI는 낯선 사용자의 첫 프롬프트에서 마찰을 조금도 남기지 않으려고 엄청난 복잡성을 받아들였습니다. 봇 방어와 챌린지 흐름, 익명 사용자의 속도 제한, 별도의 `backend-anon` API 영역 전체가 필요합니다. 어느 쪽도 틀리지 않았습니다. 하지만 네트워크 탭만 봐도 각 회사의 전략을 읽을 수 있습니다. 아마 제가 쓴 문장 가운데 가장 performance.dev다운 문장일 것입니다.

[동영상](https://media.performance.dev/posts/p_IE23cQZdfRUJ/vqK9Xs85PfE1.mp4)

---

## ChatGPT 웹을 만드는 방식

대략 이런 모습입니다. 제약 조건은 알 수 없는 기기에서 접속한 신규 사용자입니다. 그래서 앱은 완전한 셸을 서버 렌더링하고 엣지에서 스트리밍해 100ms 안에 첫 바이트를 보냅니다. 프레임워크는 프레임워크 모드의 리액트 라우터 7입니다. 2024년 Next.js를 떠나 Remix로 옮긴 뒤 두 프로젝트의 병합을 따라 도달했습니다. 스타일은 디자인 토큰 레이어 위에서 컴파일한 Tailwind v4이며 라우트마다 나뉘고 웹 폰트는 없습니다. 컴포넌트는 Radix 프리미티브를 사용하고 입력창은 ProseMirror로 만듭니다. 클라이언트 데이터는 서버가 초기값을 채운 TanStack Query가 담당합니다. 부팅 과정은 콘텐츠 해시가 붙은 청크 160개를 사용자가 입력할 수 있는 순간에 맞춰 단계적으로 불러옵니다. 페이지 자체의 로딩 방식을 포함한 모든 결정은 서버에서 평가하는 플래그 556개 가운데 하나로 제어합니다. 그 결과 모델이 할 말이 생기는 즉시 답변 스트리밍을 시작합니다.

가장 인상적인 점은 좋은 의미에서 모든 것이 얼마나 표준적인가입니다. Linear의 속도는 첫날부터 만들기 시작한 자체 동기화 엔진에서 나옵니다. Conductor의 속도는 네이티브 셸과 로컬 데이터베이스에서 나옵니다. ChatGPT의 속도는 프런트엔드에서 가장 대중적인 기술 스택을 사용하면서도 모든 기본값에 의문을 품고 측정한 결과입니다. 서버에서 플래그를 평가하고, 테마 스크립트를 인라인으로 넣고, 청크 이름을 해시 처리하고, 모든 것을 입력창 뒤로 미루고, 첫 바이트부터 측정합니다.

웹을 개발한다면 [chatgpt.com](https://chatgpt.com)에서 개발자 도구를 열고 구석구석 살펴보세요. 인터넷의 누구에게나 훌륭한 리액트 앱을 제공하는 방법을 무료로 배울 수 있습니다.

---

가져다 쓸 만한 아이디어를 몇 가지 얻으셨기를 바랍니다. 피드백이나 제안이 있거나 이야기를 나누고 싶다면 [X에서 저를 찾아주세요.](https://x.com/brotzky)

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
