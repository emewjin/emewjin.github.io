---
title: (번역) 내 생애 가장 자랑스러운 128킬로바이트
date: 2025-08-27
lastUpdated: 2025-08-27
tags: [번역]
---

> 원문: [I’m more proud of these 128 kilobytes than anything I’ve built since](https://medium.com/@mikehall314/im-more-proud-of-these-128-kilobytes-than-anything-i-ve-built-since-53706cfbdc18)

<!-- I once worked with a UI designer who insisted it was impossible to create a product that was both within the Web Content Accessibility Guidelines (WCAG) and aesthetically pleasing. ‘It can be pretty, or it can be accessible,’ he said, ‘you can’t have both.’ -->

저는 예전에 웹 콘텐츠 접근성 지침(WCAG)을 준수하면서도 미학적으로 만족스러운 제품을 만드는 것이 불가능하다고 주장하는 UI 디자이너와 함께 일한 적이 있습니다. '예쁘거나, 접근성이 좋거나 둘 중 하나만 할 수 있다'고 그는 말했습니다. '둘 다 가질 수는 없다'고요.

<!-- The belief that good design and accessibility are at odds is surprisingly common, but it’s a tension I don’t really believe exists. In this case, my colleague viewed the WCAG Level AA standard as stifling, and felt the constraints made it impossible for him to create effective solutions. The problem with this framing is it misses something fundamental about how good design works. -->

좋은 디자인과 접근성이 상충된다는 믿음은 놀랍도록 흔하지만, 저는 그런 대립이 실제로 존재한다고 생각하지 않습니다. 이 경우, 제 동료는 WCAG 레벨 AA 표준을 숨 막히는 것으로 여겼고, 그 제약 조건 때문에 효과적인 해결책을 만들 수 없다고 느꼈습니다. 이런 시각의 문제는 좋은 디자인이 어떻게 작동하는지에 대한 근본적인 무언가를 놓치고 있다는 점입니다.

<!-- One of my favourite definitions of ‘design’ is ‘solving a given problem within a given set of constraints.’ The way we solve a problem is shaped by the constraints we’re working with. The same problem under different constraints may have a fundamentally different solution, and experience has taught me that tight constraints often push you toward better solutions. -->

제가 가장 좋아하는 '디자인'의 정의 중 하나는 '주어진 제약 조건 내에서 주어진 문제를 해결하는 것'입니다. 우리가 문제를 해결하는 방식은 우리가 작업하는 제약 조건에 의해 형성됩니다. 다른 제약 조건 하의 동일한 문제는 근본적으로 다른 해결책을 가질 수 있으며, 경험을 통해 빡빡한 제약 조건이 종종 더 나은 해결책을 이끌어냄을 배웠습니다.

<!-- This was illustrated vividly by a project I worked on several years ago, which became the work I’m most proud of in my professional career. Our customer was based in Africa, operating in a country with pretty poor telecoms infrastructure. They had an existing website, from which we were able to pull analytics and see exactly what sorts of devices their customers were using. -->

이는 제가 몇 년 전 작업했던 한 프로젝트에서 생생하게 드러났는데, 이 프로젝트는 제 경력에서 가장 자랑스러운 작업이 되었습니다. 우리 고객은 아프리카에 기반을 두고 있었고, 통신 인프라가 상당히 열악한 국가에서 운영되고 있었습니다. 그들에게는 기존 웹사이트가 있었고, 우리는 그곳에서 분석 데이터를 추출하여 고객들이 정확히 어떤 종류의 기기를 사용하고 있는지 확인할 수 있었습니다.

<!-- The results would have sent many teams running screaming, but fortunately we were just ignorant enough not to grasp the scale of the problem we were taking on. The users were mostly on mobile, but barely any of them had iPhones. Some users had Android devices, mostly running Ice Cream Sandwich or Gingerbread. There was 3G and some 4G coverage, but it was very spotty, and the most reliable connection was EDGE. More significantly, around 40% of their customers weren’t using a smartphone at all. They were using feature phones like the Nokia 2700. These devices had no touchscreen, navigated using a D-pad, had a display that was just 240px wide, and ran Opera Mini as a browser. -->

그 결과는 많은 팀을 비명을 지르며 도망가게 만들었을 테지만, 다행히도 우리는 우리가 맡은 문제의 규모를 파악하지 못할 만큼 무지했습니다. 사용자들은 대부분 모바일을 사용했지만, 아이폰을 가진 사람은 거의 없었습니다. 일부 사용자는 안드로이드 기기를 가지고 있었는데, 대부분 아이스크림 샌드위치나 진저브레드를 사용하고 있었습니다. 3G와 일부 4G 통신망이 있었지만 매우 드문드문했고, 가장 신뢰할 수 있는 연결은 EDGE였습니다. 더 중요한 것은, 고객의 약 40%가 스마트폰을 전혀 사용하지 않고 있었다는 점입니다. 그들은 노키아 2700과 같은 피처폰을 사용하고 있었습니다. 이 기기들에는 터치스크린이 없었고, D-패드를 사용하여 탐색했으며, 디스플레이는 폭이 240px에 불과했고, 브라우저로 오페라 미니를 실행했습니다.

<!-- With this context, we established the design constraints for the project: -->

이러한 맥락에서, 우리는 프로젝트의 디자인 제약 조건을 설정했습니다.

## 128K 규칙

<!-- The entire application (HTML, CSS, JavaScript, images, fonts) had to fit within a 128KB page budget. This wasn’t arbitrary, it represented what we could realistically load on an EDGE connection within a reasonable time. Any page requested with a cold cache had to stay within this budget. -->

전체 애플리케이션(HTML, CSS, JavaScript, 이미지, 폰트)은 128KB의 페이지 예산 내에 맞아야 했습니다. 이것은 임의로 결정 된 것이 아니라, 우리가 EDGE 연결에서 합리적인 시간 내에 현실적으로 로드할 수 있는 것을 나타냈습니다. 콜드 캐시 상태에서 요청된 모든 페이지는 이 예산 내에 머물러야 했습니다.

## 극단적인 반응성

<!--
There is responsive design, and then there’s responsive design. For our project, the same codebase had to work beautifully on 240px-wide feature phones, and scale all the way up to 4K desktop displays, looking great the whole way. We had to design mobile-first, but desktop couldn’t be a second-class citizen. -->

반응형 디자인이 있고, 그 다음에 또 다른 차원의 반응형 디자인이 있습니다. 우리 프로젝트의 경우, 동일한 코드베이스가 240px 너비의 피처폰에서 아름답게 작동하고, 4K 데스크톱 디스플레이까지 확장되면서 내내 멋지게 보여야 했습니다. 우리는 모바일 우선으로 디자인해야 했지만, 데스크톱이 2등 시민이 되어서는 안 됐습니다.

## 보편적 호환성

<!-- The app had to run on Opera Mini, to support those feature phones. At the time, Opera Mini provided around two seconds of JavaScript execution time, and only on load. This meant we had to keep client-side JavaScript execution to a minimum, and full server-side rendering was mandatory. The application had to run properly with full page replacement, semantic markup, and progressive enhancement for more capable devices. -->

앱은 피처폰을 지원하기 위해 오페라 미니에서 실행되어야 했습니다. 당시 오페라 미니는 약 2초의 자바스크립트 실행 시간을, 그것도 로드 시에만 제공했습니다. 이는 클라이언트 측 자바스크립트 실행을 최소한으로 유지해야 한다는 것을 의미했고, 완전한 서버 측 렌더링은 필수적이었습니다. 애플리케이션은 전체 페이지 교체, 시맨틱 마크업, 그리고 더 성능 좋은 기기를 위한 점진적 향상 방식으로 제대로 실행되어야 했습니다.

<!-- > Opera Mini works by proxying your requests through Opera’s servers. The server fetches the web page you have requested, renders it, and then compresses it to Opera’s proprietary OBML format. The server will wait for up to 2.5 seconds during rendering for JavaScript to execute, before the page state is freeze-dried and pushed to the device. This worked well for us as OBML made the most of the EDGE connection, improving overall loading times. But it also meant that we couldn’t rely on real-time interactivity at all. -->

> 오페라 미니는 사용자의 요청을 오페라 서버를 통해 프록시 처리하는 방식으로 작동합니다. 서버는 당신이 요청한 웹 페이지를 가져와 렌더링한 다음, 오페라의 독점적인 OBML 형식으로 압축합니다. 서버는 렌더링 중에 자바스크립트가 실행되도록 최대 2.5초까지 기다린 후, 페이지 상태를 동결 건조하여 기기로 푸시합니다. 이러한 방식은 OBML이 EDGE 연결을 최대한 활용하여 전반적인 로딩 시간을 개선했기 때문에 우리에게 잘 맞았습니다. 하지만 이는 또한 우리가 실시간 상호작용에 전혀 의존할 수 없다는 것을 의미하기도 했습니다.

## FOUT는 없다

<!-- There were some hard choices to make immediately. The first thing we discarded was webfonts, as these were bytes we simply didn’t have to spend. -->

즉시 내려야 할 어려운 결정들이 있었습니다. 우리가 가장 먼저 버린 것은 웹폰트였습니다. 우리가 쓸 여유가 없는 크기였기 때문입니다.

```css
font-family: -apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto',
  'Segoe UI', 'Helvetica Neue', sans-serif;
```

<!-- Discarding webfonts and instead using the system font on the device had three benefits for us. -->

웹폰트를 버리고 대신 기기의 시스템 폰트를 사용하는 것은 우리에게 세 가지 이점을 가져다주었습니다.

<!-- First, it meant we didn’t have to worry about a flash-of-unstyled-text (FOUT). This happens when the browser renders the text before the font is loaded, and then renders it again after loading, resulting in a brief flash of text in the wrong style. Worse, the browser may block rendering any text at all until the font loads. These effects can be exaggerated by slow connections, and so being able to eliminate them completely was a major win. -->

첫째, 스타일 없는 텍스트의 깜빡임(FOUT)에 대해 걱정할 필요가 없었습니다. 이는 브라우저가 폰트가 로드되기 전에 텍스트를 렌더링하고, 로드된 후에 다시 렌더링하여 잠시 동안 잘못된 스타일의 텍스트가 깜빡이는 현상입니다. 더 나쁜 것은, 브라우저가 폰트가 로드될 때까지 텍스트 렌더링을 아예 차단할 수도 있다는 점입니다. 이러한 효과는 느린 연결에 의해 과장될 수 있으므로, 이를 완전히 제거할 수 있다는 것은 큰 승리였습니다.

<!-- Second, leveraging the system font meant that we were working with a large glyph set, a wide range of weights, and a typeface designed to look great on that device. Sure, customers on Android (which uses Roboto as the system font) would see a slightly different layout to customers on iPhone (San Francisco, or Helvetica Neue on older devices), or even customers on Windows Phone (Segoe UI). But, how often do customers switch between devices like that? For the most part, they will have a consistent experience and won’t realise that people on other devices see something slightly different. -->

둘째, 시스템 폰트를 활용한다는 것은 우리가 큰 글리프 세트, 넓은 범위의 굵기, 그리고 해당 기기에서 멋지게 보이도록 디자인된 서체로 작업한다는 것을 의미했습니다. 물론, 안드로이드(시스템 폰트로 Roboto를 사용) 고객은 아이폰(San Francisco, 또는 구형 기기에서는 Helvetica Neue) 고객이나 심지어 윈도우폰(Segoe UI) 고객과는 약간 다른 레이아웃을 보게 될 것입니다. 하지만 고객들이 그렇게 기기를 바꿔가며 사용하는 경우가 얼마나 될까요? 대부분의 경우, 그들은 일관된 경험을 할 것이고 다른 기기의 사람들이 약간 다른 것을 본다는 것을 깨닫지 못할 것입니다.

<!-- Best of all, we got all of this at the cost of zero bytes from our page budget. System fonts were an absolute no-brainer, and I still use them today. -->

무엇보다도, 우리는 이 모든 것을 페이지 예산에서 0바이트 비용으로 얻었습니다. 시스템 폰트는 절대적으로 고민할 필요 없는 선택이었고, 저는 지금까지도 여전히 그것을 사용합니다.

## 프레임워크 없이 가기

<!-- Jake Archibald once described the difference between a library and a framework like this: a library is something your code calls into, a framework is something which calls into your code. -->

Jake Archibald는 언젠가 라이브러리와 프레임워크의 차이점을 이렇게 설명했습니다.

> 라이브러리는 당신의 코드**가** 호출하는 것이고, 프레임워크는 당신의 코드**를** 호출하는 것입니다.

<!-- Frontend web development has been dominated by frameworks at least since React, if not before. SproutCore, Cappuccino, Ember, and Angular all used a pattern where the framework controls the execution flow, and it hooks into your code as and when it needs to. Most of these would have broken our 128KB page budget before we had written a single line of application code. -->

프런트엔드 웹 개발은 적어도 리액트 이후로, 아니 그 이전부터 프레임워크에 의해 지배되어 왔습니다. SproutCore, Cappuccino, Ember, Angular는 모두 프레임워크가 실행 흐름을 제어하고, 필요할 때마다 당신의 코드에 연결되는 패턴을 사용했습니다. 이들 대부분은 우리가 애플리케이션 코드를 한 줄도 작성하기 전에 128KB 페이지 예산을 초과했을 것입니다.

<!-- We looked at libraries like Backbone, Knockout, and jQuery, but we knew we had to make every byte count. In the days before libraries were built for tree-shaking, almost any library we bundled would have included wasted bytes, so instead we created our own minimal library, named Whizz. -->

우리는 Backbone, Knockout, jQuery와 같은 라이브러리를 검토했지만, 모든 바이트를 소중히 써야 한다는 것을 알고 있었습니다. 라이브러리가 트리셰이킹을 위해 만들어지기 전 시절에는, 우리가 번들링하는 거의 모든 라이브러리에 낭비되는 바이트가 포함되었을 것입니다. 그래서 대신 우리는 Whizz라는 이름의 우리만의 최소한의 라이브러리를 만들었습니다.

<!-- Whizz implemented just the API surface we needed: DOM querying, event handling, and AJAX requests. Much of it simply smoothed out browser differences, particularly important when supporting everything from IE8 to Safari 9 to Android Browser to Opera Mini. There was no virtual DOM, no complex state management, no heavy abstractions. -->

Whizz는 우리가 필요한 API 표면, 즉 DOM 쿼리, 이벤트 처리, AJAX 요청만을 구현했습니다. 그 대부분은 단순히 브라우저 간의 차이를 완화하는 역할을 했는데, IE8부터 Safari 9, 안드로이드 브라우저, 오페라 미니까지 모든 것을 지원할 때 특히 중요했습니다. 가상 DOM도, 복잡한 상태 관리도, 무거운 추상화도 없었습니다.

<!-- The design of Whizz was predicated on a simple observation: the header and footer of every page were the same, so re-fetching them when loading a new page was a waste of bytes. All we really needed to do was fetch the bits of the new page we didn’t already have. -->

Whizz의 디자인은 간단한 관찰에 기반을 두었습니다. 예를들면, 모든 페이지의 헤더와 푸터는 동일하므로, 새 페이지를 로드할 때 그것들을 다시 가져오는 것은 바이트 낭비라는 것이었습니다. 우리가 정말로 해야 할 일은 우리가 아직 가지고 있지 않은 새 페이지의 부분들만 가져오는 것이었습니다.

<!-- An event listener would intercept a click, fetch the partial content via AJAX, and inject it into the page. (These were the days before the Fetch API, when we had to do everything with XMLHttpRequest. Whizz provided a thin wrapper around this.) -->

이벤트 리스너가 클릭을 가로채고, AJAX를 통해 부분적인 콘텐츠를 가져와 페이지에 주입했습니다. (이것은 Fetch API 이전 시대로, 우리는 모든 것을 XMLHttpRequest로 해야 했습니다. Whizz는 이것을 감싸는 얇은 래퍼를 제공했습니다.)

```json
{
  "title": "새 페이지의 문서 제목",
  "content": "<p>새 페이지만을 위한 부분 HTML</p>"
}
```

<!-- The AJAX request included a custom header, X-Whizz, which the server recognised as a Whizz request and returned just our JSON payload instead of the full page. Once injected into the page, we ran a quick hook to bind event listeners on any matching nodes in the new DOM. -->

AJAX 요청에는 사용자 정의 헤더인 X-Whizz가 포함되었는데, 서버는 이를 Whizz 요청으로 인식하고 전체 페이지 대신 우리의 JSON 페이로드만 반환했습니다. 페이지에 주입된 후, 우리는 새 DOM에서 일치하는 노드에 이벤트 리스너를 바인딩하기 위해 빠른 훅을 실행했습니다.

```js
function onClick(event) {
  var mainContent;

  event.preventDefault();

  mainContent = WHIZZ.querySelector('main');
  WHIZZ.load(event.target.href, function (page) {
    document.title = page.title;
    WHIZZ.replaceContent(mainContent, page.content);
    WHIZZ.rebindEventListeners(mainContent);
  });
}
```

<!-- This really cut down on the amount of data we were transferring, without needing heavy DOM manipulation, or fancy template engines running in the browser. Knitted together with a simple loading bar (just to give the user the feeling that stuff is moving along) it really made navigation, well, whizz! -->

이것은 브라우저에서 실행되는 무거운 DOM 조작이나 화려한 템플릿 엔진 없이도 우리가 전송하는 데이터의 양을 확실하게 줄여주었습니다. 간단한 로딩 바와 함께 엮어서 (단지 사용자에게 무언가 진행되고 있다는 느낌을 주기 위해) 탐색을 정말 쌩쌩하게(whizz) 만들었습니다!

## 상상하기

<!-- Probably the most significant problem we faced in squeezing pages into such a tiny payload was images. Even a small raster image, like PNG or JPEG, consumes an enormous amount of bytes compared to text. Text content (HTML, CSS, JavaScript) also gzips well, typically halving the size on the wire, or more. Images, however, often don’t benefit from gzip compression. We had already committed to using them sparingly, but reducing the absolute number of images wasn’t enough on its own. -->

페이지를 그렇게 작은 페이로드에 쑤셔 넣는 데 있어 우리가 직면한 가장 중요한 문제는 아마도 이미지였을 것입니다. PNG나 JPEG와 같은 작은 래스터 이미지조차도 텍스트에 비해 엄청난 양의 바이트를 소비합니다. 텍스트 콘텐츠(HTML, CSS, JavaScript)는 gzip 압축도 잘 되어, 일반적으로 전송 시 크기를 절반 이하로 줄입니다. 그러나 이미지는 종종 gzip 압축의 이점을 누리지 못합니다. 우리는 이미 이미지를 최소한으로 사용하기로 결정했지만, 이미지의 절대적인 수를 줄이는 것만으로는 충분하지 않았습니다.

<!-- While we started off using tools like OptiPNG to reduce our PNG images as part of the build process, during development we discovered TinyPNG (now Tinify). TinyPNG did a fantastic job of squeezing additional compression out of our PNG images, beyond what we could get with any other tool. Once we saw the results we were getting from TinyPNG, we quickly integrated it into our build process, and later made use of their API to recompress images uploaded by users. -->

처음에는 빌드 과정의 일부로 OptiPNG와 같은 도구를 사용하여 PNG 이미지를 줄이기 시작했지만, 개발 중에 우리는 TinyPNG(현재 Tinify)를 발견했습니다. TinyPNG는 다른 어떤 도구로도 얻을 수 없었던 PNG 이미지에서 추가적인 압축을 짜내는 환상적인 일을 해냈습니다. TinyPNG에서 얻은 결과를 보자마자, 우리는 그것을 빌드 프로세스에 신속하게 통합했고, 나중에는 사용자가 업로드한 이미지를 재압축하기 위해 그들의 API를 활용했습니다.

<!-- JPEG proved more of a challenge. These days Tinify supports JPEG images, but at the time they were PNG-only so we needed another approach. MozJPEG, a JPEG encoder tool from Mozilla, was pretty good and was a big improvement over the Adobe JPEG encoder we had been using. But we needed to push things even further. -->

JPEG는 더 큰 도전 과제였습니다. Tinify는 이제 JPEG 이미지를 지원하지만, 당시에는 PNG 전용이었기 때문에 다른 접근 방식이 필요했습니다. Mozilla의 JPEG 인코더 도구인 MozJPEG는 꽤 좋았고 우리가 사용하던 Adobe JPEG 인코더에 비해 큰 개선이었습니다. 하지만 우리는 더 나아가야 했습니다.

<!-- What we came up with involved exporting JPEGs at double the scale (so if we wanted a 100x100 image, we would export at 200x200) but taking the JPEG quality all the way down to zero. This typically produced a smaller file, albeit heavily artefacted. However, when rendered at the expected 100x100, the artefacts were not as noticeable. -->

우리가 생각해낸 방법은 JPEG를 두 배 크기로 내보내는 것이었습니다(그래서 100x100 이미지를 원하면 200x200으로 내보냄). 하지만 JPEG 품질을 0까지 낮췄습니다. 이것은 일반적으로 더 작은 파일을 생성했지만, 아티팩트가 심했습니다. 그러나 예상했던 100x100 크기로 렌더링했을 때, 아티팩트는 그다지 눈에 띄지 않았습니다.

<!-- 이미지 -->

<!-- 이미지 alt 텍스트: Two images of a robin, side-by-side. The left one shows the image at full scale with heavy JPEG artefacts. The right one shows the image at half scale, with the artefacts less visible. -->

이미지 alt 텍스트: 나란히 놓인 두 개의 울새 이미지. 왼쪽 것은 심한 JPEG 아티팩트가 있는 전체 크기 이미지. 오른쪽 것은 아티팩트가 덜 보이는 절반 크기 이미지.

<!-- 이미지 주석: The left image is 100% scale, quality set to 0. The right image the same image at half size. -->

이미지 주석: 왼쪽 이미지는 100% 크기, 품질 0. 오른쪽 이미지는 같은 이미지를 절반 크기로 줄인 것.

<!-- The end result used more memory in the browser, but spared us precious bytes on the wire. We recognised this as a trade-off, and I’m still not 100% sure it was the best approach. But it was sparingly used, and effective for what we needed. -->

결과적으로 브라우저에서 더 많은 메모리를 사용했지만, 전송 시 소중한 바이트를 절약해 주었습니다. 우리는 이것을 트레이드오프로 인식했고, 이것이 최선이었는지 지금도 100% 확신하지는 못합니다. 하지만 종종 사용되었고, 우리가 필요로 하는 것에는 효과적이었습니다.

<!-- The real wins came from embracing SVG. SVG has the advantage of being XML-based, so it compresses well and scales to any resolution. We could reuse the same SVG as the small and large versions of an icon, for example. Thankfully, it was also supported by Opera Mini. -->

진정한 승리는 SVG를 받아들이면서 찾아왔습니다. SVG는 XML 기반이라는 장점이 있어서 압축이 잘 되고 어떤 해상도로든 늘릴 수 있습니다. 예를 들어, 우리는 작은 아이콘과 큰 아이콘 버전에 동일한 SVG를 재사용할 수 있었습니다. 다행히도, 오페라 미니에서도 지원되었습니다.

<!-- That isn’t to say SVG was all plain sailing. For one thing, not all of our target browsers supported it. Notably, Android Browser on Gingerbread did not have great SVG support, so our approach here was to provide a PNG fallback using the <picture> element. -->

그렇다고 SVG를 사용하는게 순탄하기만 했던것은 아닙니다. 우선, 우리의 모든 대상 브라우저가 SVG를 지원하지는 않았습니다. 특히, 진저브레드의 안드로이드 브라우저는 SVG 지원이 좋지 않았기 때문에, 여기서 우리의 접근 방식은 <picture> 요소를 사용하여 PNG 폴백을 제공하는 것이었습니다.

<!-- Browsers which supported <picture> would fetch the SVG, but browsers without <picture> support (or without SVG support) would fetch the PNG fallback instead. This was an improvement over JavaScript-based approaches, as we always fetched either PNG or SVG and never one then the other, as some polyfills might. We were fortunate too that none of those devices had HiDPI (aka Retina) screens, so we only needed to provide fallbacks at 1x scale. -->

<picture>를 지원하는 브라우저는 SVG를 가져오지만, <picture> 지원이 없거나(또는 SVG 지원이 없는) 브라우저는 대신 PNG 폴백을 가져올 것입니다. 이것은 일부 폴리필이 그럴 수 있는 것처럼, PNG나 SVG 중 하나를 가져오고 절대로 하나를 가져온 후 다른 하나를 가져오지 않는다는 점에서 자바스크립트 기반 접근 방식보다 개선된 것이었습니다. 또한 운이 좋게도 그 기기들 중 어느 것도 HiDPI(일명 Retina) 화면을 가지고 있지 않아서, 1배율의 폴백만 제공하면 되었습니다.

<!-- The larger problem we had with SVG was one more unexpected, because it turned out that vector design tools like Adobe Illustrator and Inkscape produce really noisy, bloated SVGs. Adobe Illustrator especially embeds huge amounts of metadata into SVG exports, with unnecessarily precise coordinates for paths. This was compounded by artefacts resulting from the way graphic designers typically work in vector tools: hidden layers, deeply nested groups, redundant transforms, and sometimes even nested raster images. Literally, PNG or JPEG data embedded in the SVG, which you would never see unless you opened it in a code editor. -->

우리가 SVG와 관련하여 겪었던 더 큰 문제는 더 예상치 못한 것이었는데, Adobe Illustrator나 Inkscape와 같은 벡터 디자인 도구들이 정말로 지저분하고 부풀려진 SVG를 생성한다는 것을 알아냈기 때문입니다. 특히 Adobe Illustrator는 SVG 내보내기 파일에 엄청난 양의 메타데이터를 포함시키고, 경로에 대해 불필요하게 정밀한 좌표를 사용합니다. 이것은 그래픽 디자이너들이 벡터 도구에서 일반적으로 작업하는 방식, 즉 숨겨진 레이어, 깊게 중첩된 그룹, 중복된 변환, 그리고 때로는 중첩된 래스터 이미지까지 더해져 악화되었습니다. 말 그대로, SVG에 PNG나 JPEG 데이터가 포함되어 있어 코드 편집기에서 열어보지 않으면 절대 볼 수 없는 것들이었습니다.

<!-- The result was images which should have been 500 bytes coming in at 5–10KB, or larger. If we were going to pull this off, we needed to very quickly become experts at SVG optimisation. -->

그 결과, 500바이트여야 할 이미지가 5-10KB 또는 그 이상으로 커졌습니다. 만약 우리가 이 일을 해내려면, 매우 빨리 SVG 최적화 전문가가 되어야 했습니다.

## SVG 최적화: 첫번째 파트

<!-- SVGO, the SVG optimisation tool, was relatively nascent at the time, but did a grand job of stripping away much of the Adobe cruft. Unfortunately, it wasn’t good enough on its own. -->

SVG 최적화 도구인 SVGO는 당시 비교적 초기 단계였지만, Adobe의 잡다한 것들을 대부분 제거하는 훌륭한 일을 해냈습니다. 불행히도, 그것만으로는 충분하지 않았습니다.

```html
<?xml version="1.0" encoding="utf-8"?>

<svg
  version="1.1"
  id="Layer_1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
  xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
  sodipodi:docname="circle_design.svg"
  inkscape:version="1.2.1"
  inkscape:export-filename="/Users/designer/Desktop/circle_design.png"
  inkscape:export-xdpi="96"
  x="0px"
  y="0px"
  width="200px"
  height="200px"
  viewBox="0 0 200 200"
  enable-background="new 0 0 200 200"
  xml:space="preserve"
>
  <defs>
    <style type="text/css">
      <![CDATA[
      .st0{fill:#FF6B6B;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
      .st1{fill:none;stroke:#4ECDC4;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;}
      ]]>
    </style>
  </defs>
  <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1">
    <g id="Background_Layer_1">
      <rect
        x="0"
        y="0"
        width="200"
        height="200"
        fill="white"
        stroke="none"
        inkscape:label="Background"
      />
    </g>
    <g id="Main_Content_1_" transform="translate(0,0)">
      <circle
        class="st0"
        cx="100.0"
        cy="100.0"
        r="50.0"
        sodipodi:cx="100.0"
        sodipodi:cy="100.0"
        sodipodi:rx="50.0"
        sodipodi:ry="50.0"
      />
      <path
        id="Cross_1_"
        class="st1"
        d="M70.0,100.0 L130.0,100.0 M100.0,70.0 L100.0,130.0"
        inkscape:connector-curvature="0"
        sodipodi:nodetypes="cccc"
      />
    </g>
  </g>
</svg>
```

<!--
Many hours of experimentation took place, just fooling with the SVG code in an editor and seeing what that did to the image. We realised that we could strip out most of the <g> grouping elements without changing anything. We could strip back most of the xmlns attributes on the <svg> element too, as most of them were redundant. We also often found CSS transforms inlined in the SVG, which we had to figure out how to effectively remove. -->

편집기에서 SVG 코드를 만지작거리며 이미지에 어떤 변화가 생기는지 보는 것만으로도 수많은 시간의 실험이 이루어졌습니다. 우리는 대부분의 <g> 그룹화 요소를 아무것도 바꾸지 않고 제거할 수 있다는 것을 깨달았습니다. <svg> 요소의 대부분의 xmlns 속성도 제거할 수 있었는데, 대부분이 중복되었기 때문입니다. 또한 종종 SVG에 인라인된 CSS 변환을 발견했고, 이를 효과적으로 제거하는 방법을 알아내야 했습니다.

<!--
When fooling with the code wasn’t enough, we started working with the designers to merge similar paths into a single element, which often produced smaller files. We worked toward a goal of only ever having a single path for any given fill colour. This wasn’t always possible, but was often a great start at reducing the size of the SVG. -->

코드를 만지작거리는 것만으로는 충분하지 않았을 때, 우리는 디자이너들과 협력하여 유사한 path를 단일 요소로 병합하기 시작했고, 이는 종종 더 작은 파일을 만들었습니다. 우리는 특정 fill 색상에 대해 항상 단일 path만 갖는 것을 목표로 작업했습니다. 이것이 항상 가능하지는 않았지만, SVG 크기를 줄이는 데 종종 훌륭한 시작점이 되었습니다.

<!-- Path definitions we would typically round to one or two decimal places, depending on what worked best visually. We found that the simpler we made the SVG, the greater the chance was that it would render consistently across various devices, and the smaller the files would get. -->

경로 정의는 일반적으로 시각적으로 가장 잘 작동하는 것에 따라 소수점 한두 자리로 반올림했습니다. SVG를 더 단순하게 만들수록 다양한 기기에서 일관되게 렌더링될 가능성이 커지고 파일이 더 작아진다는 것을 발견했습니다.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <path fill="#fff" d="M0 0h200v200H0z" />
  <circle
    cx="100"
    cy="100"
    r="50"
    fill="#ff6b6b"
    stroke="#000"
    stroke-width="2"
  />
  <path
    d="M70 100h60m-30-30v60"
    stroke="#4ecdc4"
    stroke-linecap="round"
    stroke-width="3"
  />
</svg>
```

<!-- Unfortunately, it was an especially labour-intensive process which didn’t lend itself very well to automation. These days, I would be more relaxed about just letting SVGO do its stuff, and SVGO is a more capable tool now than it was then. But I still wince when I see unoptimised SVGs dropping out of Figma and landing in a project, so I’ll often take ten minutes or so to clean them up. -->

불행히도, 이것은 자동화에 그다지 적합하지 않은 특히 노동 집약적인 과정이었습니다. 요즘이라면, 저는 그냥 SVGO가 자기 일을 하도록 내버려 두는 데 더 관대할 것이고, SVGO는 그때보다 지금 더 유능한 도구입니다. 하지만 저는 여전히 Figma에서 최적화되지 않은 SVG가 나와 프로젝트에 들어가는 것을 볼 때 움찔하며, 그래서 종종 10분 정도 시간을 내어 그것들을 정리하곤 합니다.

## 보편적 최소화

<!-- Minifying across CSS and JavaScript has been standard practice for over a decade, but some developers question the utility of minification. They argue that once gzip/deflate is introduced, the wins from minification are trivial. Why go to all the trouble of mangling your code into an unreadable mess, when gzip offers gains an order of magnitude larger? -->

CSS와 자바스크립트를 최소화하는 것은 10년 이상된 표준적인 관행이지만, 일부 개발자들은 최소화의 유용성에 의문을 제기합니다. 그들은 gzip/deflate가 도입되면 최소화로 인한 이득은 미미하다고 주장합니다. gzip이 훨씬 더 큰 이득을 제공하는데, 왜 굳이 코드를 읽을 수 없는 엉망진창으로 만드는 수고를 하느냐는 것입니다.

<!-- We didn’t find these arguments especially persuasive at the time. For one thing, even saving 3–4KB was considered a win and worth our time on the budget we had. But more than that, gzip/deflate support was pretty spotty on mobile browsers from the time. Opera Mobile (distinct from Opera Mini) had pretty poor gzip support, and Android Browser from the time was reported as inconsistent in sending the required Accept-Encoding content negotiation header (In hindsight, perhaps this reported inconsistency was overstated, but even if that’s true, we didn’t know it then.) -->

우리는 당시 이러한 주장에 특별히 설득력을 느끼지 못했습니다. 우선, 3-4KB를 절약하는 것조차도 우리가 가진 예산에서는 승리로 간주되었고 시간을 들일 가치가 있었습니다. 하지만 그보다도, 당시 모바일 브라우저에서는 gzip/deflate 지원이 매우 드물었습니다. 오페라 모바일(오페라 미니와는 다름)은 gzip 지원이 매우 열악했고, 당시 안드로이드 브라우저는 필요한 Accept-Encoding 콘텐츠 협상 헤더를 보내는 데 일관성이 없다고 보고되었습니다 (돌이켜보면, 아마도 이 보고된 비일관성은 과장되었을 수 있지만, 그것이 사실이라 해도 우리는 그때 그것을 몰랐습니다).

<!-- Introducing minification prior to zip meant that even if the client did not support gzip or deflate encoding, they still enjoyed reduced payloads thanks to the minification. We were using Gulp for our build tool, which at the time was the shiny new hotness, and presented a code-driven alternative to Grunt. -->

압축 전에 최소화를 도입함으로써, 클라이언트가 gzip이나 deflate 인코딩을 지원하지 않더라도 최소화 덕분에 줄어든 페이로드를 누릴 수 있었습니다. 우리는 빌드 도구로 Gulp를 사용하고 있었는데, 당시에는 최신 유행이었고 Grunt에 대한 코드 중심의 대안을 제시했습니다.

<!-- Gulp’s rich library of plugins included gulp-minify-css, which reduced CSS using the clean-css library under the hood. We also had gulp-uglify to minify the JavaScript. That was effective in reducing the size of our assets, but with only 128KB to play with, we were always hammering home this mantra that every byte counts. So we took things one step further and added minification to our HTML. -->

Gulp의 풍부한 플러그인 라이브러리에는 내부적으로 clean-css 라이브러리를 사용하여 CSS를 줄이는 gulp-minify-css가 포함되어 있었습니다. 또한 자바스크립트를 최소화하기 위한 gulp-uglify도 있었습니다. 이는 우리 자산의 크기를 줄이는 데 효과적이었지만, 128KB밖에 쓸 수 없는 상황에서 우리는 항상 '모든 바이트가 중요하다'는 만트라를 강조했습니다. 그래서 우리는 한 걸음 더 나아가 HTML에도 최소화를 추가했습니다.

<!-- I don’t know that anyone is routinely doing this these days, precisely for the reasons outlined above. Gzip/deflate gets you bigger gains, and HTML (unlike JavaScript) doesn’t lend itself to renaming variables, etc. But there were a few techniques we were able to use to reduce the payload by even a few hundred bytes. -->

요즘 누군가가 정기적으로 이 작업을 하고 있는지는 모르겠습니다. 바로 위에서 설명한 이유 때문입니다. Gzip/deflate는 더 큰 이득을 가져다주고, HTML은 (자바스크립트와 달리) 변수 이름 바꾸기 등에 적합하지 않습니다. 하지만 페이로드를 단 몇백 바이트라도 줄이기 위해 우리가 사용할 수 있었던 몇 가지 기술이 있었습니다.

There were early wins from replacing any Windows-style newlines (\r\n) with UNIX-style ones (\n). We were also able to strip out any HTML comments, excepting IE conditional comments, which had semantic meaning to that browser. We could safely remove whitespace from around block-level elements like <div>, <p>, <h1>, <ul>, <ol>, and <li>. Multiple whitespace around inline elements, like <span>, <strong>, <em>, was rationalised to just a single space.

초반 성과는 윈도우 스타일의 줄 바꿈(\r\n)을 유닉스 스타일(\n)로 바꾸는 것에서 거두었습니다. 또한 IE 조건부 주석을 제외한 모든 HTML 주석을 제거할 수 있었는데, 이 주석들은 해당 브라우저에 시맨틱한 의미를 가졌습니다. <div>, <p>, <h1>, <ul>, <ol>, <li>와 같은 블록 레벨 요소 주변의 공백은 안전하게 제거할 수 있었습니다. <span>, <strong>, <em>과 같은 인라인 요소 주변의 여러 공백은 단일 공백으로 합리적으로 변했습니다.

<!-- This often left us with HTML that was smaller, but was all on one line. This turned out to not be very well tolerated by some browsers, which disliked the very long lines, so we introduced an additional newline before the first attribute in every element, in order to break things up. -->

이로 인해 종종 더 작지만 모두 한 줄에 있는 HTML이 남게 되었습니다. 이것은 일부 브라우저에서 매우 긴 줄을 싫어했기 때문에 잘 받아들여지지 않는 것으로 나타나, 우리는 모든 요소의 첫 번째 속성 앞에 추가적인 줄 바꿈을 도입하여 내용을 나누었습니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf8" />
    <meta name="viewport" content="initial-scale=1.0,width=device-width" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <!-- and so on -->
  </head>
</html>
```

<!-- The HTML minifier also had to ensure it didn’t fool with the whitespace within inline scripts, inline styles, <textarea>, or <pre> elements, but overall it bought us a few extra kilobytes. -->

HTML을 최소화할 때는 또한 인라인 스크립트, 인라인 스타일, <textarea> 또는 <pre> 요소 내의 공백을 건드리지 않도록 해야 했지만, 전반적으로 우리에게 몇 킬로바이트를 더 벌어주었습니다.

## 브랜드 감독

<!-- The first demo to the customer went incredibly well, and they were thrilled with the work we had done. However, they had one important piece of feedback. Their brand team had just spent a significant amount of time and money with Saatchi & Saatchi building up a new brand identity and advertising campaign for the company. This featured a specific typeface, with a thick border around each letter. -->

고객에게 처음 시연한 데모는 믿을 수 없을 정도로 잘 동작했고, 그들은 우리가 한 작업에 감격했습니다. 그러나 그들에게는 한 가지 중요한 피드백이 있었습니다. 그들의 브랜드 팀은 Saatchi & Saatchi와 함께 상당한 시간과 돈을 들여 회사를 위한 새로운 브랜드 아이덴티티와 광고 캠페인을 구축한 직후였습니다. 여기에는 각 글자 주위에 두꺼운 테두리가 있는 특정 서체가 포함되었습니다.

<!-- 이미지 -->
<!-- 이미지 alt: The words “Heading One” rendered in cyan type with a thick blue stroke around the letters -->

이미지 alt: 글자 주위에 두꺼운 파란색 획이 있는 청록색 타입으로 렌더링된 "Heading One"이라는 단어

<!-- 이미지 주석: This is not the font or the style, but gives a flavour of what we were asked for -->

이미지 주석: 이것이 실제 폰트나 스타일은 아니지만, 우리가 어떤 요청을 받았는지 짐작하게 해줍니다.

<!-- Despite our protestations, they insisted that we use this as the primary heading style across the whole site. -->

우리의 항의에도 불구하고, 그들은 이것을 사이트 전체의 주요 제목 스타일로 사용해야 한다고 주장했습니다.

<!-- Our initial thought was to return to webfonts. We would still leverage system fonts for body text and subheadings, but could we perhaps use a heavily subset webfont to render our titles? We found ourselves back in FOUT-territory, and wondering how expensive it might be to inline the font in base64 to avoid FOUT issues. -->

우리의 초기 생각은 웹폰트로 돌아가는 것이었습니다. 본문 텍스트와 부제목에는 여전히 시스템 폰트를 활용하겠지만, 제목을 렌더링하기 위해 아마도 심하게 서브셋된 웹폰트를 사용할 수 있지 않을까요? 우리는 다시 FOUT 영역에 들어섰고, FOUT 문제를 피하기 위해 폰트를 base64로 인라인하는 것이 얼마나 비쌀지 궁금해했습니다.

<!-- Unfortunately, it quickly became clear that even this wasn’t going to be an effective approach, as CSS at the time didn’t have a text-stroke property to render the thick outline from their brand guide. Being unable to persuade the customer otherwise, we had to render this using images. -->

불행히도, 이 접근 방식조차도 효과적이지 않을 것이라는 점이 금방 명확해졌습니다. 당시 CSS에는 그들의 브랜드 가이드에 있는 두꺼운 외곽선을 렌더링할 text-stroke 속성이 없었기 때문입니다. 고객을 달리 설득할 수 없었던 우리는 이것을 이미지를 사용하여 렌더링해야 했습니다.

<!-- The existing techniques we had developed worked pretty well. We could provide a heavily optimised PNG of the title (with alt-text set appropriately) alongside an SVG of the same for supported devices. But once again, we were stymied the need for a stroke around the letters. -->

우리가 개발했던 기존 기술들은 꽤 잘 작동했습니다. 지원되는 기기를 위해 동일한 SVG와 함께 (대체 텍스트가 적절히 설정된) 극한까지 최적화된 PNG 제목을 제공할 수 있었습니다. 하지만 다시 한번, 우리는 글자 주위에 획이 필요하다는 점에 가로막혔습니다.

<!-- SVG supports stroke, but unfortunately the brand guide required the stroke to feature only on the outside, and SVG strokes are always centred on the shape’s path. Our designer found a way to work around this, faking the stroke instead by overlaying two shapes. The base shape was a few points larger, and rendered in the stroke colour. Overlaid on top were the letters themselves, making it look like an outer stroke. -->

SVG는 획을 지원하지만, 불행히도 브랜드 가이드는 획이 바깥쪽에만 나타나도록 요구했고, SVG 획은 항상 모양의 경로 중앙에 위치합니다. 우리 디자이너는 두 개의 모양을 겹쳐서 획을 위조하는 방식으로 이 문제를 해결할 방법을 찾았습니다. 기본 모양은 몇 포인트 더 컸고, 획 색상으로 렌더링되었습니다. 그 위에 글자 자체가 겹쳐져서 바깥쪽 획처럼 보이게 만들었습니다.

<!--However, this doubled the size of every SVG title we had, as each letter now required two shapes. We had to do better. -->

그러나 이것은 우리가 가진 모든 SVG 제목의 크기를 두 배로 만들었습니다. 이제 각 글자에 두 개의 모양이 필요했기 때문입니다. 우리는 더 개선해야 했습니다.

## SVG 최적화: 두번째 파트

<!-- We had learned enough about the structure of SVG files to be able to tackle the problem in a smarter way, one which leveraged shape definitions to avoid doubling up the data. -->

우리는 SVG 파일의 구조에 대해 충분히 학습했기 때문에, 데이터 중복을 피하기 위해 모양 정의를 활용하는 더 영리한 방식으로 문제를 해결할 수 있었습니다.

<!-- SVG supports a <defs> element, where you can define a reusable path to reference later on. Elements in <defs> are not rendered, but they can be given a unique name and referenced by a <use> element. To create the final SVG titles, we first defined the shape for the letters as a <path> within <defs>. We then referenced this path twice. The first time, we applied a heavy stroke to the element, double what we needed, but centred on the path so it extended the correct amount outside the shape’s boundary. The second time, no stroke was applied, but the shape was layered over the top, concealing the unwanted ‘inner’ portion of the stroke. -->

SVG는 나중에 참조할 수 있는 재사용 가능한 경로를 정의할 수 있는 <defs> 요소를 지원합니다. <defs> 안의 요소는 렌더링되지 않지만, 고유한 이름을 부여받아 <use> 요소로 참조될 수 있습니다. 최종 SVG 제목을 만들기 위해, 우리는 먼저 글자의 모양을 <defs> 내의 <path>로 정의했습니다. 그런 다음 이 경로를 두 번 참조했습니다. 첫 번째에는 요소에 무거운 획을 적용했는데, 필요한 것보다 두 배 두껍지만 경로 중앙에 위치하여 모양의 경계 바깥으로 정확한 양만큼 확장되도록 했습니다. 두 번째에는 획이 적용되지 않았지만, 모양이 그 위에 겹쳐져 원치 않는 획의 '안쪽' 부분을 가렸습니다.

<!-- This gave us what we needed visually, at the cost of only a few extra bytes, to wrap our path in <defs> and reference it with <use>. -->

이것은 우리 경로를 <defs>로 감싸고 <use>로 참조하는 데 단 몇 바이트의 추가 비용으로 우리가 시각적으로 필요했던 것을 제공했습니다.

<!-- 이미지 -->

<!-- 이미지 alt: Three images reading “Heading One”. The first has a thick stroke which obscures the letters and makes them hard to read. The second has no stroke at all. The third is a the second overlaid on the first to produce clean, legible text. -->

이미지 alt: "Heading One"이라고 쓰인 세 개의 이미지. 첫 번째 이미지는 획이 두꺼워 글자를 가리고 읽기 어렵게 만듭니다. 두 번째 이미지는 획이 전혀 없습니다. 세 번째 이미지는 깨끗하고 읽기 쉬운 텍스트를 만들기 위해 첫 번째 이미지 위에 두 번째 이미지를 겹친 것입니다.

<!-- 이미지 주석: The same path rendered in two ways, overlaid on itself, gave the effect we wanted -->

이미지 주석: 동일한 경로를 두 가지 방식으로 렌더링하여 서로 겹쳐서 우리가 원했던 효과를 얻었습니다.

```html
<svg
  viewBox="0 0 1280 400"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  <defs>
    <path id="a" d="optimised path data goes here, probably a few KB" />
  </defs>
  <use xlink:href="#a" stroke="#006" stroke-width="20" />
  <use xlink:href="#a" fill="#0cf" />
</svg>
```

## 예상치 못한 결과

<!-- The final product was lightning-fast even on the weakest data connections and most underpowered devices. Showing it off at trade shows, we found that competitive products were still displaying a loading spinner when our application was already loaded, rendered, and running. -->

최종 제품은 가장 약한 데이터 연결과 가장 저사양 기기에서도 번개처럼 빨랐습니다. 무역 박람회에서 그것을 선보였을 때, 우리 애플리케이션이 이미 로드되고, 렌더링되고, 실행되고 있을 때 경쟁 제품들은 여전히 로딩 스피너를 표시하고 있었습니다.

<!-- But perhaps the most remarkable thing was that it worked on nearly everything we tried. At first, as a bit of fun, we tried running it on the text-based browser Lynx. To our delight, it ran almost perfectly. The D-pad navigation translated very well to keyboard-based navigation, and our choice of small payloads, semantic markup, and progressive enhancement meant that Lynx handled it like a champ. -->

하지만 아마도 가장 놀라운 점은 우리가 시도한 거의 모든 것에서 작동했다는 것입니다. 처음에는 재미 삼아 텍스트 기반 브라우저인 Lynx에서 실행해 보았습니다. 놀랍게도, 거의 완벽하게 실행되었습니다. D-패드 탐색은 키보드 기반 탐색으로 매우 잘 변환되었고, 작은 페이로드, 시맨틱 마크업, 점진적 향상을 선택한 덕분에 Lynx는 그것을 능숙하게 다루었습니다.

<!-- Once we saw it working on Lynx, we wanted to see it running on everything. It was perfectly usable on the PSP and PlayStation 3 browsers (though Sony, we discovered, renders everything inside <h1> elements using the PlayStation font, regardless of your CSS!) It even ran on the weird webOS browser installed on the television in the office. -->

Lynx에서 작동하는 것을 본 후, 우리는 그것이 모든 것에서 실행되는 것을 보고 싶었습니다. PSP와 플레이스테이션 3 브라우저에서도 완벽하게 사용할 수 있었습니다 (소니는, 우리가 발견한 바로는, 당신의 CSS와 상관없이 <h1> 요소 안의 모든 것을 플레이스테이션 폰트로 렌더링했습니다!). 심지어 사무실 텔레비전에 설치된 이상한 webOS 브라우저에서도 실행되었습니다.

<!-- Of course, it didn’t always work first time on every device; we’d usually come away with a short bug list and have it patched by the afternoon. It also worked on every creaky old flip-phone we could try it on, provided it ran Opera Mini. I once spent a fun afternoon in a cell phone store in Clearwater, Florida trying our application on every phone they had. -->

물론, 모든 기기에서 처음부터 작동한 것은 아니었습니다. 보통 짧은 버그 목록을 가지고 돌아와 오후까지 패치하곤 했습니다. 또한 Opera Mini를 실행하는 한, 우리가 시도할 수 있는 모든 낡은 플립폰에서도 작동했습니다. 저는 한번 플로리다 클리어워터의 한 휴대폰 가게에서 그들이 가진 모든 폰으로 우리 애플리케이션을 시도하며 즐거운 오후를 보낸 적이 있습니다.

<!-- Equally, it ran in a variety of network conditions. It ran great on dodgy airport wifi, it worked well on a speeding train, even as the device had to hop from mast-to-mast. It ran on the crowded backhaul of a large conference centre and was even decently usable on dial-up (we checked). -->

마찬가지로, 다양한 네트워크 조건에서도 실행되었습니다. 불안정한 공항 와이파이에서도 잘 실행되었고, 기기가 기지국을 계속 바꿔야 하는 고속 열차 안에서도 잘 작동했습니다. 대규모 컨퍼런스 센터의 혼잡한 백홀에서도 실행되었고, 심지어 다이얼업에서도 괜찮게 사용할 수 있었습니다 (우리가 확인했습니다).

## 제약된 디자인의 역설

<!-- The constraints on this project didn’t limit our creativity; they channelled it toward solutions that worked universally rather than just for the privileged few with fast connections and the latest device. A persistent fallacy in web development circles is that customers have up-to-date devices and fast Internet. But even someone with the latest iPhone has poor connection when they’re on the edge of signal at a train station, or at a bus stop in the rain. -->

이 프로젝트의 제약 조건은 우리의 창의성을 제한하지 않았습니다. 그것은 빠른 연결과 최신 기기를 가진 소수의 특권층뿐만 아니라 보편적으로 작동하는 솔루션으로 창의성을 이끌었습니다. 웹 개발계의 고질적인 오류는 고객들이 최신 기기와 빠른 인터넷을 가지고 있다 생각하는 것입니다. 하지만 기차역에서 신호가 약한 가장자리에 있거나, 비 오는 버스 정류장에 있을 때는 최신 아이폰을 가진 사람조차도 연결 상태가 좋지 않습니다.

<!-- At no point did the constraints make the product feel compromised. Users on modern devices got a smooth experience and instant feedback, while those on older devices got fast, reliable functionality. Users on feature phones got the same core experience without the bells and whistles. -->

어떤 상황에서도 제약 조건과 타협한 제품처럼 느껴지게 만들지 않았습니다. 최신 기기 사용자는 부드러운 경험과 즉각적인 피드백을 얻었고, 구형 기기 사용자는 빠르고 안정적인 기능을 얻었습니다. 피처폰 사용자는 화려한 부가 기능 없이 동일한 핵심 경험을 얻었습니다.

<!-- The constraints forced us to solve problems in ways we wouldn’t have considered otherwise. Without those constraints, we could have just thrown bytes at the problem, but with them every feature had to justify itself. Core functionality had to work everywhere, and without JavaScript crutches proper markup became essential. -->

제약 조건은 우리가 다른 방식으로는 고려하지 않았을 방식으로 문제를 해결하도록 강요했습니다. 그러한 제약이 없었다면, 우리는 문제에 바이트를 그냥 던져버렸을 수도 있지만, 제약이 있었기에 모든 기능은 스스로를 책임져야 했습니다. 핵심 기능은 어디서나 작동해야 했고, 자바스크립트의 도움이 없었기 때문에 적절한 마크업이 필수적이었습니다.

<!-- This experience changed how I approach design problems. Constraints aren’t a straitjacket, keeping us from doing our best work; they are the foundation that makes innovation possible. When you have to work within severe limitations, you find elegant solutions that scale beyond those limitations. -->

이 경험은 제가 디자인 문제에 접근하는 방식을 바꾸어 놓았습니다. 제약 조건은 우리가 최고의 작업을 하지 못하도록 막는 구속복이 아니라, 혁신을 가능하게 하는 기초입니다. 심각한 한계 내에서 작업해야 할 때, 당신은 그 한계를 뛰어넘어 확장되는 우아한 해결책을 찾게 됩니다.

<!-- As I often point out to teams I’m working with, the original 1993 release of DOOM weighed in at under 3MB, while today we routinely ship tens of megabytes of JavaScript just to render a login form. Perhaps we can rediscover the power of constraints, not because we have to, but because the results are better when we do. -->

제가 함께 일하는 팀들에게 자주 지적하듯이, 1993년에 출시된 오리지널 DOOM은 3MB 미만이었지만, 오늘날 우리는 로그인 양식을 렌더링하기 위해 수십 메가바이트의 자바스크립트를 일상적으로 배포합니다. 어쩌면 우리는 제약 조건의 힘을 다시 발견할 수 있을지도 모릅니다. 그래야만 해서가 아니라, 그렇게 할 때 결과가 더 좋기 때문입니다.

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 [Korean FE Article](https://kofearticle.substack.com/)을 구독해주세요!
