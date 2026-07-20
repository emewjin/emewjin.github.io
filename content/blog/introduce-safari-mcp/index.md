---
title: (번역) 웹 개발자를 위한 Safari MCP 서버를 소개합니다
description:
date: 2026-07-20
lastUpdated: 2026-07-20
tags: [번역]
---

> 원문: [Introducing the Safari MCP server for web developers](https://webkit.org/blog/18136/introducing-the-safari-mcp-server-for-web-developers/)

[Safari Technology Preview 247](https://developer.apple.com/safari/technology-preview/)에서 Safari MCP 서버를 소개합니다. Safari MCP 서버는 웹 개발자를 위한 모델 컨텍스트 프로토콜(Model Context Protocol) 서버로, 웹 개발과 디버깅 워크플로우를 더 빠르고 강력하게 만들어 줍니다. 에이전트가 코딩 과정에서 점점 더 중요한 역할을 하고 있다는 점을 알고 있습니다. Safari MCP 서버는 에이전트를 Safari 브라우저 창에 연결해, 코드가 브라우저에서 실제로 어떻게 렌더링되는지 알 수 있게 해 줍니다.

MCP 호환 클라이언트라면 무엇이든 Safari MCP 서버에 연결할 수 있습니다. 에이전트를 Safari 브라우저 창에 연결하면 에이전트가 사용자가 경험하는 환경을 재현할 수 있습니다. DOM, 네트워크 요청, 스크린샷, 콘솔 출력에 접근하는 등 더 자율적으로 디버깅하는 데 필요한 정보를 얻을 수 있습니다.

이 서버는 디버깅 과정을 빠르게 해 주고 터미널 안에서 편하게 머물 수 있게 해 줍니다. 즉, 코드를 디버깅하려고 창을 옮겨 다니고 프롬프트를 입력하는 일을 덜 반복해도 됩니다.

## 사용 사례

웹을 만든다면 디버깅 루틴을 잘 알 것입니다. 보통 이런 식으로 흘러갑니다.

브라우저에서 사이트에 뭔가 문제가 있는 것을 봅니다. 원인을 찾으려고 콘솔을 엽니다. 스타일 탭을 클릭합니다. 무엇이 깨졌는지 확인합니다. 코드로 돌아가 수정합니다. 아니면 스크린샷을 찍고, 문제를 자세히 설명해 에이전트에게 고치게 할 수도 있습니다. 운이 좋으면 에이전트가 제대로 고쳐서 버그가 사라지고, 다음 작업으로 넘어갈 수 있겠죠.

하지만 문제가 고쳐지지 않으면 같은 워크플로우를 다시 거칩니다. 브라우저. 프롬프트. 에이전트.

그리고 다시, 또다시 반복합니다. 마침내 버그를 잡을 때까지요.

어떤 브라우저나 도구를 쓰든, 디버깅 워크플로우는 한 가지 수정만 하려고 해도 클릭과 도구, 창 전환이 많이 필요합니다. 하지만 꼭 그럴 필요는 없습니다. 이미 개발 워크플로우에서 에이전트를 사용하고 있다면 Safari MCP 서버가 디버깅을 더 빠르고 효율적으로 만들어 줍니다.

Safari MCP 서버는 에이전트가 스스로 더 많은 디버깅과 문제 해결을 할 수 있게 해 줍니다. 도움이 되는 몇 가지 예를 살펴보겠습니다.

**Safari에서 웹 개발하기**. 다음에 Safari에서 개발할 때는 업그레이드된 워크플로우를 경험할 수 있습니다. 에이전트는 이미 코드 작업을 도와주고 있습니다. 이제 Safari에서 코드가 실제로 어떻게 렌더링되는지 확인하며 더 많은 일을 할 수 있습니다.

**Safari 호환성 개선하기.** 한 브라우저에서만 테스트하면 다른 브라우저에서 생길 수 있는 버그를 놓치게 되고, 그 브라우저를 쓰는 사용자에게 부족한 경험을 줄 수 있습니다. Safari MCP 서버를 사용하면 에이전트가 Safari에서 사이트를 열고, 계산된 스타일을 검사하고, 레이아웃을 확인하고, 창을 전환하지 않고도 기대한 결과와 비교할 수 있습니다.

**성능 분석하기.** 사이트의 어떤 부분이 느려지게 하는지 확인하세요. Safari MCP 서버는 에이전트가 페이지에서 자바스크립트를 평가해 내비게이션 타이밍이나 리소스 로드 시간 같은 성능 지표를 드러낼 수 있게 해 줍니다. 그래서 에이전트는 사이트를 느리게 만드는 부분을 정확히 찾아내고 알맞은 수정을 진행할 수 있습니다.

**접근성 확인하기.** Safari MCP 서버는 에이전트가 레이블 누락, 잘못된 ARIA 속성, 낮은 대비처럼 흔한 접근성 문제를 확인할 수 있게 해 줍니다. 그래서 사용자에게 영향을 주는 문제를 포착할 수 있습니다.

**모든 사용자 상태 검증하기.** 페이지가 기대한 대로 동작하고 보이는지 확인하세요. 에이전트는 폼 상태를 확인하고, 셀렉터로 요소를 쿼리하고, 특정 인터렉션을 검증하고, 체크아웃 플로의 여러 상태를 보여 주는 등 다양한 작업을 할 수 있습니다. 이런 수동 확인에 쓰는 시간을 줄이고, 에이전트가 대신 처리하게 하세요.

이는 사용 사례의 일부일 뿐입니다. 어떤 방식으로 구현하든 Safari MCP 서버는 에이전트가 더 많은 일을 대신하게 해 주고, 웹 개발에 흔히 필요한 왕복 과정을 줄여 줍니다. 워크플로우가 쉬워지면 더 많은 버그를 잡고, 사용자는 더 만족하며, 제품은 더 나아집니다.

## 도구

사용할 수 있는 도구와 각각의 역할은 다음과 같습니다.

| 도구                     | 설명                                                                          |
| ------------------------ | ----------------------------------------------------------------------------- |
| browser_console_messages | 현재 탭 또는 지정한 탭에 버퍼링된 콘솔 로그를 반환합니다                      |
| browser_dialogs          | 브라우저 대화 상자를 나열하고 응답합니다(수락, 닫기, JS 프롬프트 텍스트 입력) |
| close_tab                | 핸들로 브라우저 탭을 닫습니다                                                 |
| create_tab               | 새 브라우저 탭을 만들고, 선택적으로 URL을 불러옵니다                          |
| evaluate_javascript      | 페이지 안에서 자바스크립트 코드를 실행하고 결과를 반환합니다                  |
| get_network_request      | 기록된 단일 네트워크 요청의 전체 세부 정보(헤더, 본문, 타이밍)를 가져옵니다   |
| get_page_content         | 페이지의 텍스트 콘텐츠를 다양한 형식(마크다운, HTML, JSON 등)으로 추출합니다  |
| list_network_requests    | 현재 탭의 네트워크 요청 요약(URL, 메서드, 상태, 타이밍)을 나열합니다          |
| list_tabs                | 열려 있는 모든 브라우저 탭과 각 탭의 핸들, URL을 나열합니다                   |
| navigate_to_url          | URL로 이동하고 불러온 페이지 콘텐츠를 반환합니다                              |
| page_info                | 현재 페이지의 URL, 제목, 로딩 상태 정보를 가져옵니다                          |
| page_interactions        | 클릭, 입력, 스크롤, 호버, 키 누르기 같은 DOM 인터렉션을 순서대로 수행합니다   |
| screenshot               | 현재 페이지의 스크린샷을 PNG로 캡처합니다                                     |
| set_emulated_media       | 반응형 디자인 테스트를 위해 CSS 미디어 타입(예: "print")을 에뮬레이션합니다   |
| set_viewport_size        | 브라우저 뷰포트 크기를 CSS 픽셀 단위로 설정합니다                             |
| switch_tab               | 다른 브라우저 탭으로 전환합니다                                               |
| wait_for_navigation      | 현재 페이지 로딩이 끝날 때까지 기다립니다. 최종 URL과 제목을 반환합니다       |

Safari MCP 서버를 사용하면 브라우저에서 겪는 일을 에이전트에게 신중하게 설명하려고 완벽한 프롬프트를 작성할 필요가 없습니다. 에이전트가 직접 알아낼 수 있게 만들 수 있습니다.

## 시작하는 방법

먼저 [Safari Technology Preview](https://developer.apple.com/safari/technology-preview/)를 설치해야 합니다. 설치한 뒤에는 `Safari Settings > Advanced > Show features for web developers`를 활성화하세요. 그런 다음 `Safari Settings > Developer > Enable remote automation and external agents`로 이동합니다.

Claude를 사용한다면 터미널에서 다음 명령을 사용할 수 있습니다.

```
claude mcp add safari-mcp-stp -- "/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver" --mcp
```

Codex를 사용한다면 터미널에서 다음 명령을 사용할 수 있습니다.

```bash
codex mcp add safari-mcp-stp -- "/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver" --mcp
```

다른 에이전트를 사용한다면 `mcp.json` 또는 `config.json`에 다음 내용을 넣을 수 있습니다.

```json
"safari-mcp-stp": {
  "command": "/Applications/Safari Technology Preview.app/Contents/MacOS/safaridriver",
  "args": ["--mcp"]
}
```

위 코드에서는 서버 이름을 `safari-mcp-stp`로 지정했지만, 원하는 이름을 붙여도 됩니다. `safari`처럼 간단히 지어도 됩니다. Safari MCP 서버를 설치했다면 다음 프롬프트 중 하나를 시도해 보세요.

```bash
사파리로 내 웹사이트에 접속했을 때 버그를 찾아줘.
```

```bash
사파리에서 내 웹사이트의 접근성은 어때?
```

```bash
사파리에서 내 웹사이트의 성능은 어때?
```

에이전트마다 동작 방식은 조금씩 다르지만, Safari MCP 서버를 쓰라고 명시적으로 말하지 않아도 됩니다. 에이전트가 스스로 알아낼 것입니다. 위와 같은 간단한 프롬프트만으로도 MCP 작업을 시작하기에 충분합니다.

Safari MCP 서버를 사용하는 에이전트와 나누는 대화는 다음과 같을 수 있습니다.

> **당신:** 버그 리포트를 받았는데요. Safari에서 항공편 페이지가 뭔가 깨졌습니다. 무슨 일인지 알아낼 수 있나요?
>
> **에이전트:** 물론입니다. 살펴보겠습니다.
>
> **에이전트:** Safari의 항공편 페이지에서 서로 다른 버그 두 가지를 찾았습니다. 둘 다 고칠까요?
>
> **당신:** 네. Safari 사용자에게 문제를 일으킬 만한 다른 것도 있나요?
>
> **에이전트:** 네, 짚고 넘어갈 만한 것이 두 가지 더 있습니다. 결과 표시 애니메이션이 조용히 깨져 있고, API 서버 시작 로그가 잘못되어 있습니다. 둘 다 처리할까요?

시작할 때는 첫 요청 하나면 충분합니다. Safari MCP 서버의 도움을 받으면 에이전트가 그다음부터 이어서 처리할 수 있습니다.

Safari MCP 서버는 전적으로 로컬 머신에서 실행되며 자체적으로 네트워크 호출을 하지 않습니다. 또한 Safari의 개인 정보(예: AutoFill이나 다른 브라우저 활동)에 접근할 수 없습니다. 페이지 콘텐츠, 스크린샷, 콘솔 로그를 캡처하면 해당 데이터는 Apple이 아니라 실행 중인 에이전트로 직접 전달됩니다. 그 이후 그 데이터에 무슨 일이 일어나는지는 사용하는 에이전트와 모델에 달려 있습니다. 브라우저 접근 권한을 주는 어떤 에이전트든 마찬가지로, 신뢰할 수 있는 에이전트만 사용하세요.

## 만든 이유

AI를 사용하든 사용하지 않든, 웹을 만드는 방법은 많습니다. AI가 워크플로우의 일부라면 이 도구가 그 과정을 훨씬 더 생산적으로 만드는 데 도움이 될 것이라고 생각합니다. AI를 사용하지 않아도 괜찮습니다.

이 리소스를 만들어, 에이전트가 브라우저에서 페이지가 어떻게 보이고 동작하는지 이해하도록 돕고자 합니다. 이를 통해 Safari에서 테스트하고 디버깅하는 일이 그 어느 때보다 쉬워지기를 바랍니다.

사용해 보게 되거나 MCP 서버를 처음 써 본다면, 어떻게 생각하는지 알려 주세요.

온라인에서는 Saron Yitbarek을 [BlueSky](https://bsky.app/profile/saron.bsky.social)에서, Jen Simmons를 [Bluesky](https://bsky.app/profile/jensimmons.bsky.social) / [Mastodon](https://front-end.social/@jensimmons)에서, Jon Davis를 [Bluesky](https://bsky.app/profile/jondavis.bsky.social) / [Mastodon](https://mastodon.social/@jondavis)에서 찾을 수 있습니다. 문제가 생기면 [WebKit 버그 리포트](https://bugs.webkit.org/)를 제출해 주세요. 이슈 제출은 실제로 큰 도움이 됩니다.

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
