---
  title: '사진편집툴 라이브러리 imoji editor 개발기'
  date: 2021-07-06
  lastUpdated: 2021-07-06
  tags: [Javascript, Project, Vue]
---

<p align="center">
<img alt="preview" src="https://images.velog.io/images/1703979/post/b2cb85f8-f327-4ddc-8cc6-fdb233c561ed/editor.gif">
</p>

👉 [Documentation](https://medistream-team.github.io/imoji-editor) 👉 [npm](https://www.npmjs.com/package/imoji-editor) 👉 [GitHub](https://github.com/medistream-team/imoji-editor)

6월 한 달간 메디스트림에서 기업협업으로 사진편집툴 개발을 진행했다. 사진에 대한 기능들을 담은 모듈은 `core js`로, 기능들을 사용할 UI는 `vue.js`로 개발했으며 오픈소스 라이브러리로 npm 패키징하여 배포까지 완료했다. 기억력이 안 좋은 나 스스로를 위해 개발 한 달 동안의 이야기를 정리하고자 한다. **이건 내가 투머치토커라 글이 짱짱 길어질 것에 대한 밑밥이다.**

## 목차

- [프로젝트 개요](#📝-프로젝트-개요)
- [🎨 Canvas API](#🎨-canvas-api)
- [👩🏻‍💻 라이브러리 리서치](#👩🏻‍💻-라이브러리-리서치)
- [🚧 스티커 기능 구현에 대한 고민](#🚧-스티커-기능-구현에-대한-고민)
- [🕳 UI 구조](#🕳-ui-구조)
- [👀 기능 함수 만들기](#👀-기능-함수-만들기)
- [🔥 Blocker](#🔥-blocker)
- [⚡ npm 배포와 웹팩 설정](#⚡-npm-배포와-웹팩-설정)
- [👩🏻‍🎓 배운점](#👩🏻‍🎓-배운점)
- [마무리하며](#마무리하며)

## 📝 프로젝트 개요

- 구현 기능 : 자유 크롭, 비율 크롭, 회전, 반전, 확대/축소, 스티커 추가, 결과물 png 이미지 객체로 반환
- 사용 스택 : `core js` ES6, `vue.js` 2.x
- 사용 라이브러리 : `cropper.js` 1.5.11, `fabric.js` 4.5

회사 프로덕트의 글쓰기 기능에서 사용할 사진편집툴이 필요해 단독 모듈로 개발을 진행했다. 이왕이면 회사의 브랜딩에도 도움이 되고자 회사의 캐릭터로 스티커를 추가할 수 있게끔 했다.

딱 사진 편집에 기본적으로 필요한 기능들만 컴팩트하게 담고, 스티커를 추가할 수 있는 기능까지 있는 라이브러리를 찾아보았으나 마땅한 것이 없었다. 스티커 기능이 있으면 다른 불필요한 기능들도 많이 있고, 딱 컴팩트하게 우리가 원하는 기능만 있다 싶으면 스티커 기능이 없었기 때문이다. 따라서 만든 것을 오픈 소스 라이브러리로 배포하기로 했고 이를 통해 평소 아무 생각없이 `npm install` 하던 것에서도 벗어나보기로 했다.

## 🎨 Canvas API

HTML 5의 Canvas API는 그림, 이미지 뿐 아니라 동영상과 같은 미디어를 다룰 수 있게 도와주는 API이다. 화려한 그래픽이나 게임을 만드는 등 Canvas API를 가지고 할 수 있는 것은 무궁무진하지만 초보(=나)를 위한 프로젝트로는 그림판 만들기 등이 있다 ^0^.

우리는 유저가 업로드하는 사진, 즉 이미지를 다루어야 했기 때문에 Canvas API를 사용하기로 했으나 웹 개발이랑은 또 다른 별천지 세계라고 해서 Canvas API를 쉽게 다루게 도와주는 라이브러리를 사용하기로 했다. ~~(누군가의 말에 의하면 이걸 쓰라고 만들어 둔 것인지 의심이 되는 정도라고...😂)~~

개발에 사용했던 라이브러리에 대한 부분은 후술할 것이고, 이 파트에선 날 것의 Canvas API를 사용한 부분만 간단히 되짚어 기록해본다.

### How To Use

우선 캔버스 요소를 생성한다. `div`나 `img`처럼 `<canvas id="canvas"></canvas>`로 만들어낼 수 있는데 기본 사이즈는 300x150 픽셀이다. 일반적인 html 태그들처럼 css로 조정할 수도 있지만 canvas 태그의 width, height로 설정하길 권장한다. css로 width, height값을 변경해도 레이아웃의 크기는 그대로라 때문에 그것에 맞춰서 📎[왜곡되는 현상](https://curryyou.tistory.com/265)이 발생할 수 있기 때문이다.

이제 이 캔버스를 조작할 차례~!

우리가 그림을 그릴 때 흰 스케치북 위에 색연필로 선을 긋듯이 캔버스도 마찬가지이다. 캔버스에서 흰 스케치북은 Context라고 하고, `getContext()`라는 캔버스의 메소드를 이용해 접근한다. 네이밍도 관습적으로 `context`라고 하거나 `ctx`라고 한다.

그림을 그릴 영역을 지정했으니 이제 그 위에 그릴 차례이다. 가장 기본이 되는 점이나 선을 그릴 수도 있지만 우리는 이미지를 다룰 것이므로, `drawImage()`라는 메소드를 사용할 것이다. 첫 번째 인자로는 그려낼 이미지 객체, 두 번째와 세 번째 인자로는 좌표를 지정할 수 있다.

그럼 이런 코드를 작성할 수 있다.

```js
//add sticker image on canvas
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
context.drawImage(stickerImage, 0, 0);
```

그리고 해당 캔버스를 이미지로 내보낼 수 있다. `toDataURL`메소드를 이용하면 data URL를 반환해준다. 첫번째 인자로 이미지 포맷도 지정할 수 있는데 기본값은 png이다. 이를 활용하면 다음과 같이 이미지 객체를 반환할 수 있다. (new Image()와 html image element는 다르다!)

```js
const result = new Image();
result.src = canvas.toDataURL('image/png');
return result;
```

이런 작업은 전부 스케치북 위에 올리는 이미지, 선, 점 등을 움직여 하는 것이라기보다 **스케치북을 움직여** 선을 그려내고 이미지를 그려내는 식이다. 그렇기 때문에 직관적이지 않고 어렵게 다가온다. 이런 부분을 좀 더 쉽게 이용하게 해줄 라이브러리를 찾아보았다.

## 👩🏻‍💻 라이브러리 리서치

라이브러리를 리서치 하는 과정에서 제일 고민이 되었던 부분은 수 많은 라이브러리 중에서 **무엇을 기준으로** 선택해야하는 지였다. 라이브러리를 처음 써봐서 감도 안 왔다. 그래서 그냥 아무거나 검색해서 닥치는 대로 라이브러리에 대한 글들을 읽었다. A라는 사람은 어떤 라이브러리를 선호하는데 그 이유는 무엇인지 같은거? 그런 것에 더해서 회의 때 이야기 나눈 것을 바탕으로 아래와 같은 체크리스트들을 만들 수 있었다.

    ✅ 배보다 배꼽이 더 크진 않은가? 필요 기능만 컴팩트하게 들어있는가?
    ✅ 실질적인 업데이트가 꾸준히 이뤄지고 있는 라이브러리인가?
    ✅ 문서화가 영어 또는 한국어로 상세하게 되어있는가?
    ✅ Core 자바스크립트로 개발된 라이브러리인가?
    ✅ 생태계가 활성화 되어 있는가? 깃헙 이슈, 스택오버플로우 등
    ✅ 많이 사용되는가? star, npm download 수 등
    ✅ 사용이 어려울 정도의 크리티컬한 이슈가 있는가?
    ✅ 모바일을 지원하는가?

위와 같은 기준들로 리서치를 해보니 의외로 후보가 많지 않았다. 물론 crop이나 rotate같이 기능 한 가지만 가진 라이브러리까지 포함한다면 후보가 더 많아졌겠지만, 예측할 수 없는 사이드 이펙트를 최소화 하기 위해 최소한의 라이브러리만을 사용하기로 했기 때문에 탈락시켰다.

그렇게 확정된 라이브러리가 📎[`cropper.js`](https://github.com/fengyuanchen/cropperjs)였다. 2014년에 jquery로 처음 개발된 이 라이브러리는 제작자가 지속적으로 팔로업하여 현재는 최신 자바스크립트 문법으로 업데이트 되어있다. 라이브러리를 찾다 보면 레거시 코드를 많이 보게 되는데 그렇지 않은 점이 인상적이었다.

## 🚧 스티커 기능 구현에 대한 고민

결론부터 말하면 사진 편집용 캔버스와 스티커 추가용 캔버스를 따로 두어 두 캔버스를 스위칭하기로 했다.

사진 편집을 cropper를 이용해서 할 것이지만, 스티커를 추가하는 것도 결국엔 스티커라는 사진을 추가하는 것이 아니냐는 이야기가 회의 때 나왔다. 때문에 스티커는 직접 구현하기로 이야기가 됐고 이를 위해 여러 방법을 리서치해가며 4개의 데모를 만들었었다. 아주아주 날 것의 데모를 만들어 보는 것은 아직은 낯설기만 한 라이브러리에 가장 빠르게 적응할 수 있는 방법이었다. 회의 때 설명을 하기에도 직접 보면서 이야기를 할 수 있으니 더 좋았다. 📎 [데모 코드샌드박스](https://codesandbox.io/s/image-editor-test-8584y) 📎 [참고한 방법 중 하나](https://www.youtube.com/watch?v=DQKIcWvXNLk&t=704s)

스티커 기능을 직접 구현하면서 마주한 예상하지 못했던 문제점은 `cropper.js`가 **한 캔버스 안에 여러 개의 객체를 추가하지 못한다**는 것이었다. 나와 비슷한 니즈를 가진 어떤 개발자가 문의를 했었는데 제작자가 `미안, 그건 지원 안 해`라고 대답한 것을 보았다. cropper의 사진을 조작하는 기능을 이용해서 스티커를 조작하고 싶은 니즈와 한 캔버스 안에서 여러 개의 스티커를 조작하고 싶은 니즈는 공존할 수 없는 니즈였던 것이다.

정말 별 것 아니지만, 내가 만들었던 데모는 그 문제의 해결에 대한 것이었다. 스티커 당 캔버스를 만들고 z-index를 줘서 레이어처럼 쌓고, 최종 저장 시에는 캔버스들을 합쳐서 하나의 이미지를 반환할 수 있었다. 그치만 그렇게 되면 우리가 일반적으로 생각하는 스티커 기능(=한 번에 여러 스티커를 추가 가능)과 멀어질 뿐더러 **사용자 입장에선 쓰다가 빡쳐서 더 이상 안 쓸 것 같았다.** 저 방법은 결국 한 번에 하나의 스티커만 조작이 가능하고, 두 번째 스티커를 사용하려면 첫 번째 스티커를 사용한 것을 저장하는 과정을 꼭 거쳐야 했기 때문이다.

그러면 cropper를 쓰지 않고 쌩 Canvas를 써서 구현한다면?

스티커를 캔버스 위에 추가하고 드래그앤 드랍으로 원하는 위치로 이동시키는 것까지는 구현을 했지만, 스티커가 여러 개가 되거나 특정 스티커를 돌리거나 리사이징하거나 반전하거나 하는 것은 또 다른 문제였다. 그것들을 다 직접 구현을 하면 물론 너무 좋겠지만...😇 그러면 결국 사진 편집도 직접 구현한 걸로 하면 됐기에 애초에 `cropper.js`를 쓰기로 결정했던 것에서 너무 많이 벗어나는 것 같았다. 우리 프로젝트의 목표는 '무조건 완성' 이었는데 디버깅과 배포, 문서화까지 고려한다면 남은 시간이 2주가량밖에 되지 않는 다는 것도 문제였다.

그렇게 리서치를 계속 하던 중, `fabric.js`에 대해 알게되어 이것을 쓰기로 했다. core javascript로 드래그 이벤트와 쌩 Canvas API를 이용해 구현해보려 했던 저 데모는, 동작 원리를 알게 해주는 소중한 시도였지만, fabric.js는 확실히 ✨신세계✨였다.

똑같이 canvas를 인스턴스로 생성하는 라이브러리이고 cropper와 충돌할 일이 없었다. 다만 새로운 캔버스가 생성되는 것이기 때문에 두 가지 아이디어 중에 고민했다.

- 스티커 편집 모드 진입시 하던 편집을 저장하여 스티커 캔버스의 배경으로 깔게 함. 다시 사진 편집으로 돌아갈 경우에도 스티커 캔버스의 내용을 저장하여 사진 편집 캔버스로 로드함.
- 스티커 캔버스와 사진 캔버스를 따로 두고 클릭한 모드에 따라 캔버스를 스위칭함. 스티커 캔버스가 사진 캔버스 위로 위치해서 마치 사진 캔버스가 배경인 것처럼 보고 스티커를 놓게 함. 저장시에는 두 캔버스를 합쳐 하나의 이미지로 만들어 저장함.

처음에는 첫 번째 방법으로 하려고 했으나 모드 변경시마다 캔버스를 따로 저장하여 배경으로 까는 것과 전체적인 로직의 복잡도가 두 번째 방법보다 높다고 판단되어 두 번째 방법으로 변경되었다.

### 🎨 fabric.js

fabric.js는 직관적이지 못했던 Canvas API의 동작 방식을 직관적이게 해준다. Canvas API를 그냥 쓰는 것과 가장 큰 차이점은 흰 스케치북 위에 올리는 점, 선, 이미지 등의 객체화이다. 기존에는 흰 스케치북을 조작하여 점, 선, 이미지 등을 그려내었다면 Fabric.js를 사용하면 흰 스케치북은 그대로 있고 점, 선, 이미지를 원하는 모습으로 세팅해 올릴 수 있다.

이렇게 하니까 `그럼 cropper.js도 사용하지 말고 전부 fabric으로 해볼까?`하는 생각이 들었지만 이미 시간이 좀 흐른 뒤라서, 그건 한 달이라는 프로젝트 기간 외적으로 해보기로 했다. 어디까지나 우리의 목표는 완성이었기에!

`cropper.js`보다는 raw해서 메소드를 사용해 커스터마이징이 가능한 범위가 더 넓었다. 다만 우리에게 불필요한 기능도 많아서 커스텀 빌드를 해보려 했지만, fabric의 커스텀 빌드는 npm install을 한 후 모듈 내부의 파일만 바꾸는 식이었기에 추후 업데이트가 있다면 수동으로 진행해야 하는 문제가 있었다. 그렇게 하지 않고 npm을 통해 하는 방법은 아직 찾지 못해 보류해둔 상황이다.

어쨌든 다시 돌아와서, fabric.js는 내가 했던 고민들을 완벽하게 해결해주는 마법같은 존재였다.

- 하나의 캔버스 안에 여러개의 스티커 객체를 올릴 수 있다
- 올리는 것 만으로도 반전,리사이징,이동,회전 등의 조작을 할 수 있다

이를 위한 코드는 다음과 같다.

```js
  /**
   * Add sticker image on canvas
   * @param {string} src - The src of sticker image
   * @param {Object} options - The options of sticker image
   */
  addSticker(src, options) {
    fabric.Image.fromURL(
      src,
      sticker => {
        sticker.scaleToWidth(this.stickerCanvas.width * 0.2);
        sticker.scaleToHeight(this.stickerCanvas.width * 0.2);
        this.stickerCanvas.add(sticker).renderAll();
      },
      {
        borderColor: '#39f',
        cornerColor: '#39f',
        cornerSize: 5,
        transparentCorners: false,
        ...options
      }
    );
  }
```

~~데모에서처럼 스티커를 추가할 때마다 랜덤한 위치에 생성되게끔 해보려고 했는데... 생각해보니 그것보다는 0,0 이라는 **예측할 수 있는** 위치에 추가되는 것이 더 좋은 사용자 경험일 것 같아서 따로 옵션을 주지 않고 기본 위치인 0,0에 생성되게 했다. 마치 사용자를 생각한 것처럼 썼는데 사실 걍 나라면 그럴 것 같았다.~~
version 0.1.7에서 스티커가 정 가운데에 생성되게 바꾸었다. 확대된 이미지가 ui 밑으로 깔려버리면 0,0에 놓인 스티커에 유저가 접근할 수 없기 때문이다.

스티커의 사이즈가 너무 크지도 작지도 않게 캔버스 상에서 보일 수 있도록 fabric의 `scaleToWidth(), scaleToHeight()` 메소드를 사용해 상대적인 크기를 지정했다. 마지막으로 cropper의 스타일과 똑같이 하기 위해서 코너 사이즈와 테두리 색상을 옵션으로 지정했다. 원래는 흰색으로 통일하려 했는데, cropper의 경우 그렇게 하면 커스텀 빌드를 해야해서 보류했다. 이 외에도 모듈을 사용하는 사용자가 추가로 지정하고 싶은 옵션이 있다면 받아올 수 있게끔 했다.

이런 식으로 우리에게 필요한 기능들을 모아서 class로 모듈을 만들었다. cropper과 fabric이 캔버스 인스턴스를 만들어내서 동작하는 방식이라 라이브러리의 메소드를 사용하려면 각 인스턴스가 필요했기 때문이다.

원래는 내 할 일은 여기서 끝인 줄 알았다. 그래서 `'읭? 나 너무 할 일이 없는데? 일은 라이브러리들이 다 했는데?'` 싶어서 자괴감에 빠지려던 참에... 모듈이 제대로 동작하는지 테스트하기 위해서는 UI가 필요했고, Vue를 사용해 UI를 만들기로 했기 때문에 결국 나도 Vue를 쓸 줄 알아야 했다. 원래는 모듈만 만들면 되는줄 알았는데 아니었음. Vue UI는 함께 프로젝트를 진행한 준현님이 맡아주셨고, 준현님이 UI 작업을 진행하시는 동안 UI에 연결할 vue에서의 기능 함수를 만드는 것은 내가 진행했다.

## 🕳 UI 구조

준현님이 Vue로 UI를 만드시는 과정에서 `Vue Slot` 구조에 대해 함께 고민했는데 좋은 경험이었어서 기록하고자 한다.

우리가 개발하려는 사진 편집툴은 거대한 규모가 아니기도 하고, 단독 기능 모듈이기에 UI가 복잡하지도 않았다. 코드의 양도 많지 않아 하나의 파일 안에서 코드 작성을 마칠 수 있었다.

그렇지만 **명시적으로 이게 UI적 부분인지, 모듈을 이용하는 부분인지 구분하기 위해**서 두 개의 컴포넌트로 나누었다. 컴포넌트를 나누는 것은 재사용성이 있을 때라고만 알고 있었는데, 회의 때 단순히 그 뿐만이 아니라 명시적으로 기능을 구분하기 위해 나누기도 한다는 것을 알게되었다.

리액트를 공부하다 와서 그런지 vue의 기능들을 쓸 때마다 리액트를 떠올리게 되는 것은 어쩔 수 없는 것 같다. slot은 리액트의 props children과 유사했다. `ImojiEditor.vue`는 다음과 같이 `ImojiEditorCanvas.vue` 컴포넌트를 하위로 갖고, named slot으로 각 파트의 UI를 그려낸 후 `ImojiEditorCanvas.vue`의 기능들을 넘겨받아 연결한다.

```html
// ImojiEditor.vue 간소화 코드
<template>
  <imoji-editor-canvas>
    <template
      #controllerBar="{reset, stickerCanvas, onInputImage, crop, layout, photoCanvas}"
    >
    </template>
    <template #toolBar="{photoCanvas, layout, zoom, rotate, clearCrop}">
    </template>
    <template #stickerToolBar="{stickerCanvas , layout}"> </template>
    <template #toolNavigation="{openImageEditor, openStickerEditor}">
    </template>
  </imoji-editor-canvas>
</template>
```

이렇게 하면 모듈을 이용해서 사진 편집 기능과 관련된 함수를 만드는 부분은 `ImojiEditorCanvas.vue`에서만 관리할 수 있었다. 이걸로 나는 `ImojiEditorCanvas.vue`에서만 주로 작업하여 UI를 작업하시는 준현님과 서로 충돌하지 않을 수 있었다.

## 👀 기능 함수 만들기

`ImojiEditorCanvas.vue`에서는 모듈을 불러와서 기능 함수를 만들었다. 그리곤 각각의 UI에 slot props로 필요한 함수 또는 데이터를 넘겨주었는데, 해당 부분은 간략함을 위해 아래의 코드에서는 지웠다.

이 컴포넌트의 포인트는 캔버스를 다루는 부분이었다.

```html
// ImojiEditorCanvas.vue 간소화 코드
<template>
  <section
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      position: 'relative'
    }"
  >
    <slot name="controllerBar"></slot>
    // Point !
    <div class="imoji-editor-wrapper">
      <div class="imoji-editor-container">
        <div id="sticker-wrapper" :class="[hide ? 'hide' : '']">
          <canvas id="sticker-canvas"></canvas>
        </div>
        <div
          id="uploaded-photo-wrapper"
          :style="{
            width: `${width}px`,
            height: `${height}px`
          }"
        >
          <img id="user-photo" ref="uploadedPhoto" :src="uploadedImageSrc" />
        </div>
      </div>
    </div>
    <div class="all-tool-bar-wrapper">
      <slot name="toolBar"></slot>
      <slot name="stickerToolBar"></slot>
      <slot name="ratioCropToolBar"></slot>
      <slot name="toolNavigation"></slot>
    </div>
  </section>
</template>
```

사진 편집만을 담당하는 `uploaded-photo-wrapper`가 있고, 스티커 편집을 담당하는 `sticker-wrapper`가 있다. 각각의 캔버스는 모듈에 의해 생성될 것이고 건드릴 수 없기 때문에 각각을 감싸는 div를 만들어서 위치 조정 등 원하는 작업을 했다.

기본은 사진 편집 캔버스이고 스티커 모드로 진입시에는 스티커 캔버스가 그 위에 쌓여 아래에 놓인 사진 편집 캔버스를 보면서 원하는 위치에 스티커를 생성할 수 있게 했다. 위에 놓여있기 때문에 스티커 모드에서는 사진 편집 기능을 사용할 수 없다. 다시 사진 편집 모드로 진입하면 스티커 캔버스가 숨겨지며 사진 편집을 다시 할 수 있다. 이 부분은 Vue의 reactive data를 활용하여 `display:none` 속성의 class를 추가했다 제거했다 한 것인데, 리액트 이용자라면 setState를 활용한 것이라고 보면 쉽다.

UI에 모듈을 연결하는 과정은 디버깅의 연속이기도 했다. 생각보다 다양한 경우의 수가 있었기 때문이다.

<p align="center">
<img alt="debugingmeme" src="https://images.velog.io/images/1703979/post/b6163c1e-9d85-4a62-b215-cd832f944f27/17228535bf34a85fd.gif" >
</p>

2주차까지 필수 기능들을 담은 1차 프로토타입을 완성한 후에는 에러없이 잘 돌아가도록 다양한 사용 흐름을 확인하고 안드로이드/ios/구글크롬/웨일/삼성인터넷 등 다양한 환경에서 테스트해보며 이슈를 체크하고 fix하는데 집중했다. <span style="color:gray">아래는 이슈보드인데 이슈 하나를 해결하면 집에 갈 때 쯤 새로운 이슈가 생겨나는 하루하루를 보냈다...😇</span>

<p align="center">
<img alt="issueboard" src="https://images.velog.io/images/1703979/post/1615f32e-adec-4a4a-858e-e2d12a88f9f6/Screen_Recording_20210701-084002_Trello_1_1.gif">
</p>

특히 사용자 입장에서 이 라이브러리가 어떤 흐름을 가지고 있어야 좋을지, 오픈 소스인만큼 개발자들이 코드만 보고도 알아차릴 수 있게끔 네이밍과 구조적인 부분 또는 자잘한 순서같은 것에도 신경썼다. 이 기간동안 내가 겪었던 블로커는 아래와 같다. 솔직히 지금와서 생각해보면 왜 그렇게 끙끙댔을까 싶기도 하지만... 현재의 내가 그때의 나보다 성장해서 그런거라고 믿고 싶다 🤦‍♀️

## 🔥 Blocker

### 라이브러리 사용에 대한 어려움

라이브러리를 쓰면 무조건 쉽고 편하고 좋기만 할 줄 알았다. 절대 그렇지 않고 오히려 라이브러리를 쓰면 틀 안에 갇히게 될 수도 있다는 점을 이번에 좀 많이 느꼈다.

예를 들어서 `cropper.js`의 특정 캔버스를 position relative로 두고 스티커 캔버스가 cropper의 캔버스를 따라가도록 만들고 싶은데, cropper의 캔버스는 무조건 position absolute여야만 하는 상황이 있었다. 또, cropper의 색상 스타일을 흰색으로 바꾸고 싶은데, 그럴라면 커스텀 빌드를 해야하는 상황도 있었다.

이런식으로 라이브러리가 인스턴스를 제공하고 그에 따른 메소드들을 제공한다면, 그리고 그런 라이브러리들을 여러 개 사용한다면 틀 안의 틀 안에 갇히게 되어 답답해지는 상황을 마주할 수도 있겠다 싶었다. 이런 부분을 경계하며 라이브러리를 사용해야 하고, 선택해야 하지 않았을까? 다음에 또 라이브러리를 쓸 일이 있다면 얼마나 자유로운지를 꼭 확인해야겠다 싶었다.

### 이미지 최종 저장과 비동기

이번 프로젝트에서 제일 간과했던 부분은 비동기였다. <span style="color:gray">~~만악의 근원~~</span>

<p align="center">
<img alt="asyncmeme" src="https://images.velog.io/images/1703979/post/a740f399-2c9c-421e-bc95-27a9862f898f/1_hIKZmUvo5WIj6EqwzVnsYw.jpeg" >
</p>

외부에서 이미지를 불러오는 것 자체가 비동기로 처리되기 때문에, 내가 원하는 순서로 일련의 코드들이 실행되게 보장하는 것이 중요했다. 그리고 우리가 개발하는 이 프로젝트가 이미지를 다루는 것이기 때문에, 내가 마주한 문제들의 한 80%는 원인이 비동기였던 것 같다.

그 중에서 기억나는 것을 꼽자면 이미지의 **최종 저장**과 관련된 부분이었다. 나는 유저가 선택한 모드에 따라 두 캔버스를 스위칭하고 있었고, 최종 저장시에는 두 캔버스를 하나로 합쳐서 이미지 객체로 내보내야 했다. 합치는 방법은 두 가지가 있었다. (1) 편집된 사진을 이미지로 내보내 스티커 캔버스의 배경으로 까느냐, (2) 스티커 캔버스를 이미지로 내보내 사진 편집 캔버스 제일 상위에 두느냐.

결론부터 말하자면 후자의 방법을 적용했다. 사진 편집 캔버스에서는 보여지는 것만 레이아웃의 크기에 따라 줄어보이는 것일 뿐 아웃풋은 실제 사진의 크기였기 때문이다. 반면 스티커 캔버스의 크기는 레이아웃의 크기와 완벽히 일치했기 때문에 편집된 사진을 스티커 캔버스의 배경으로 설정하는 경우, 최종 저장시 사진이 원본 크기로 저장되는 것이 아니라 유저가 어느 사이즈의 에디터를 쓰고 있냐에 따라 크기가 결정되는 문제가 있었다. 예를 들어 모바일에서 편집하고 있다면 딱 모바일 화면만한 사이즈의 사진이 반환되고, 데스크탑에서 편집하고 있다면 데스크탑 UI의 모달창 사이즈의 사진이 반환되게 생긴 것이다. 이건 우리가 원하는 것도 아니고, 사용자도 절대로 원하지 않을 것이다.

후자의 방법은 그런 문제를 해결할 수 있었다. 아래와 같이 모듈에서 fabric의 메소드를 써서 리사이징 함수를 만들었다. 목표하는 크기 (원본 사진의 크기)에 맞게 캔버스의 크기와 캔버스 안의 스티커 객체들의 크기를 늘렸다.

```js
  resizeStickerToNatural(naturalWidth) {
    if (this.stickerCanvas.width != naturalWidth) {
      const scaleMultiplier = naturalWidth / this.stickerCanvas.width;
      const objects = this.stickerCanvas.getObjects();
      for (let i in objects) {
        objects[i].scaleX = objects[i].scaleX * scaleMultiplier;
        objects[i].scaleY = objects[i].scaleY * scaleMultiplier;
        objects[i].left = objects[i].left * scaleMultiplier;
        objects[i].top = objects[i].top * scaleMultiplier;
        objects[i].setCoords();
      }

      this.stickerCanvas.discardActiveObject();
      this.stickerCanvas.setWidth(
        this.stickerCanvas.getWidth() * scaleMultiplier
      );
      this.stickerCanvas.setHeight(
        this.stickerCanvas.getHeight() * scaleMultiplier
      );
      this.stickerCanvas.renderAll();
      this.stickerCanvas.calcOffset();
    }
  }
```

이렇게 했을 때 스티커가 svg파일이라 화질의 저하는 발생하지 않았다. 그래서 문서에 우리는 스티커의 형식을 svg를 권장한다고 강조해놨다. 이제 다른 문제점은 스티커 캔버스를 이미지로 변환한 것(=이하 스티커 이미지)을 불러오는 과정이 비동기라는 것이었다. **이 부분을 무시하면 스티커 없는 결과물이 반환**되었다 🤦‍♀️

스티커 이미지의 로딩이 끝난 후, 사진 편집 캔버스에 그려내어야 했는데 그 순서를 보장하기 위해 promise를 만들어 처리하니 해결 됐다.

```js
// ImojiEditor.js
 exportResultPhoto(stickerImage) {
   // 스티커 편집 없이 사진 편집만 하는 경우엔 그대로 이미지 객체로 만들어 반환한다.
    const canvas = this.cropper.getCroppedCanvas();
    const editedPhoto = new Image();
    editedPhoto.src = canvas.toDataURL('image/png');
    //return Image Object
    if (!stickerImage) return editedPhoto;

    //add sticker image on photo canvas
    const context = canvas.getContext('2d');

    let loadResultPhoto = new Promise(resolve => {
      stickerImage.onload = () => {
        context.drawImage(stickerImage, 0, 0);
        resolve(canvas);
      };
    });

    //return promise
    return loadResultPhoto.then(res => {
      const withStickerImage = new Image();
      withStickerImage.src = res.toDataURL('image/png');
      return withStickerImage;
    });
  }
```

반환된 promise는 vue 컴포넌트에서 아래와 같이 처리하고 있다.

```jsx
// ImojiEditorCanvas.vue
    async exportResultPhoto() {
      // case 1. only Edit
      if (!this.stickerCanvas && this.photoCanvas) {
        return this.photoCanvas.exportResultPhoto();
      }
      // case 2. only Sticker
      if (!this.photoCanvas && this.stickerCanvas) {
        const width = this.photoCanvas.getNaturalSize()[0];
        return await this.photoCanvas.exportResultPhoto(
          this.stickerCanvas.saveStickerImage(width)
        );
      }
      // case 3. Edit & Sticker
      if (this.photoCanvas && this.stickerCanvas) {
        const width = this.photoCanvas.getNaturalSize()[0];
        return await this.photoCanvas.exportResultPhoto(
          this.stickerCanvas.saveStickerImage(width)
        );
      }
    },

// ImojiEditor.vue
    async done() {
      const resultImage = await this.$refs.Imoji.exportResultPhoto();
      this.$emit('done', resultImage);
    }
```

`$refs`를 사용한 이유는 vue의 부모 컴포넌트에서 자식 컴포넌트의 메소드를 이용하기 위함이다. 검색해봤을 때 이벤트 버스를 이용하기도 한다는데, 내 짧은 검색 실력으로는 이벤트 버스로 데이터는 주고받아도 자식 컴포넌트 메소드의 실행 제어를 주고받는 예제는 찾아보지 못했다. 그렇다고 커스텀 이벤트를 만들어서 emit을 두 번 넘기고 그러느니, 그냥 `$refs`를 썼다.

어쨌든 ! 이제 잘 저장된다 😆

<p align="center">
<img alt="itworkswell" src="https://images.velog.io/images/1703979/post/3fe6f1ee-893b-44ff-a2b9-ea0630103388/%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%20(3).png" />
</p>

### 서로 다른 두 라이브러리가 제공하는 캔버스 연동하기

사진 편집을 담당하는 캔버스 하나, 스티커 편집을 담당하는 캔버스 하나, 이렇게 두 캔버스를 놓고 쓰다 보니까 두 캔버스의 사이즈를 연동되게 하는 것이 중요했다. 정확히는 스티커 캔버스가 사진 편집 캔버스를 따라가게 해야 했다. 왜냐하면 스티커는 사진 위에서만 움직이게 하는 것이 자연스러우니까!

이 과정에서 사진 편집 캔버스 사이즈의 변화를 감지하여 스티커 캔버스의 사이즈가 자동으로 재조정되도록 vue의 watch를 사용할까도 싶었으나, 다음과 같은 이유로 사용하지 않았다.

- watch를 사용할 경우 디버깅 시 흐름을 추적하기 어려움. watch를 사용하지 않을 수 있는 방법이 있는지 최대한 찾아보고, 정 방법이 없을 경우 최후의 수단으로 사용하는 것을 권장함
- 하지만 컴포넌트 외부의 동작이나 비동기를 처리해야 하는 경우에는 watch를 사용하도록 권장함
- 그리고 잘못 쓰면 리액트 useEffect처럼 무한루프가 발생한다 😅 아래는 순식간에 에러가 몇백개 쌓여서 깜놀해서 찍어둔 스샷. ![](https://images.velog.io/images/1703979/post/90db1481-a940-43dd-88c0-d596929ef188/%EB%AC%B4%ED%95%9C%EB%A3%A8%ED%94%84.png)

watch 대신 **사진 편집 캔버스의 사이즈를 얻는** 함수와, **스티커 캔버스의 사이즈를 리사이징** 하는 함수를 만들었다. 핵심은 crop할 때 뿐만 아니라 **사진 재업로드, rotate 시에도** 변경된 사이즈를 얻어야 하는 것이었다. 그리고 역시 비동기가 말썽이였다 ㅎㅎ

어떤 조작이 이루어진 이미지가 로드된 후에, 그에 맞게 재조정된 캔버스의 사이즈를 가져와야 했고, 그 사이즈를 가져온 후에 data에 저장해야 했다. 그런데 이게 순서가 보장이 되질 않으니 자꾸 undefined가 뜨고, 스티커 캔버스의 사이즈가 변하질 않고 그랬던 것이다. 얘도 마찬가지로 promise, await, `cropper.js`에서 제공하는 'ready'이벤트를 이용해서 해결했다.

```js
// ImojiEditor.js
 getPhotoCanvasSize() {
    return new Promise((resolve, reject) => {
       try {
          this.userImage.addEventListener(
             'ready',
          () => {
             const { width, height } = this.cropper.getCanvasData();
            resolve([width, height]);
          },
          { once: true }
        );
      } catch (error) {
         reject(error);
      }
    });
  }

// ImojiEditorCanvas.vue
  async setPhotoCanvasSize() {
  const [width, height] = await this.photoCanvas.getPhotoCanvasSize();

  this.$set(this.photoCanvasSize, 0, width);
  this.$set(this.photoCanvasSize, 1, height);
  this.resizeStickerCanvas();
},
```

### 다양한 케이스에 대응하기

만들어둔 기능들을 에러없이 제공하기 위해 다양한 케이스를 테스트해보았는데, 생각보다 경우의 수가 많음을 알게 되었다. 나의 뇌🧠 용량으로는 도저히 쓰지 않고는 기억하기 어려워 흐름도를 대충이라도 써서 예외처리 할 부분은 예외처리 하고 if문을 써서 조건 분기를 하기도 했다.

<p align="center">
<img alt="whatIDo" src="https://images.velog.io/images/1703979/post/547eda43-32d7-4e19-8b36-da5d2bc24bf5/eocnd.png" >
</p>

이 과정에서 우리의 의도와 맞지 않게 행동하는 코드들을 바로잡느라 시간을 많이 썼다. 개발자의 귀찮음을 사용자의 불편함으로 떠넘기면 안되다는 어디서 주워들은 멋진 말을 실천하느라 그랬다. 항상 주어진 일정(시간)안에 완성을 우선시 할 것인지 **완성도**를 우선시 할 것인지 딜레마에 빠지는 것 같다. 난 언제쯤 두 가지를 완벽하게 만족시킬 수 있는 사람이 될 수 있을까? 🤧

## ⚡ npm 배포

npm 배포는 npm 계정을 만든 뒤 우리 프로젝트를 build, 패키징해서 등록하면 된다. vue의 경우에는 다음과 같이 해서 사용자가 플러그인처럼 우리 라이브러리를 컴포넌트로 사용할 수 있게 했다.

```jsx
import ImojiEditor from '@/components/ImojiEditor.vue';

export default {
  install(Vue) {
    Vue.component('imoji-editor', ImojiEditor);
  },
};

//usage
import ImojiEditor from 'imoji-editor';

Vue.use(ImojiEditor);
```

그리고 우리 라이브러리가 업데이트되면 (master브랜치 업데이트) npm 배포도 자동으로 진행될 수 있도록 깃허브 액션을 이용했다.

```
name: Npm Publish
on:
  push:
    branches:
      - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        ref: master
    - uses: actions/setup-node@v2
      with:
        node-version: '14'
    - name: Install Dependencies
      run: npm install

    - name: Webpack build
      run: npm run build

    - uses: JS-DevTools/npm-publish@v1
      with:
        token: ${{ secrets.NPM_TOKEN }}
```

이런 패키징 과정은 보현님이 도와주셨는데, 마주했던 문제점은 기본 스티커로 넣어둔 메디스트림 캐릭터 svg가 패키지에 포함되지 않는다는 점이었다. 패키징-배포 과정에선 **웹팩과의 싸움**이 가장 큰 지분을 차지하는 느낌이었다.

![](https://images.velog.io/images/1703979/post/7d866307-5858-4f01-b0d7-f97c4449e7a1/error.png)

이 부분을 어떻게 해결했는지 📌[이슈 탭](https://github.com/medistream-team/imoji-editor/issues/3)에 자세하게 공유해주셨다. 나는 그동안 마주했던 이슈들을 트렐로의 이슈 보드에 등록만 해두고 자세한 내용은 매일 가졌던 스크럼 미팅이나 주간 회의, 또는 옆 자리의 준현님과 **말로만 주고 받으며** 해결했었는데... 저렇게 이슈탭에 문서화를 해두는 것을 또 한 번 배워갔다 👍🏻😇

### ✏ README 작성

vue로 ui 랩핑을 했기 때문에 vue에서는 그냥 설치해서 플러그인처럼 컴포넌트를 사용하면 되니까 어떤 옵션들을 컴포넌트에 prop으로 넘겨줄 수 있는지를 문서에 남겼다. 어떤 기능들을 지원하는지도 문서로 남겼다.

헷갈렸던 부분은 모듈에 대한 것도 문서화를 하는 것인지 아닌지였다. 모듈 자체는 리액트나 앵귤러 개발자도 사용할 수 있게끔 core javascript로 개발했는데 이 부분도 리드미에 남기는 건가? 하고 막 쓰다가, 회의 때 여쭤보니까 물론 그렇게 개발자를 위한 문서를 남기기도 하지만 대부분은 코드의 주석을 보고도 알 수 있게 하는 것이 베스트이고 당장 급한 우선순위는 아니라 해서 보류하기로 했다. 모듈에서 주석은 달아두긴 했지만 사용 예제까지 따로 시간되면 정리하고 싶다.

깃허브의 README와 Vuepress 두 가지로 작성했는데, 깃허브의 README는 npm의 readme로 함께 올라가고 vuepress는 따로 폴더 구성을 해서(docs) 작성했다. 깃허브 페이지와 연결된다. 기존 깃허브 리드미와의 차이점은 컴포넌트를 직접 불러와서 playground를 구현할 수 있다는 점인데, 아직 하지는 못했고 나의 투두리스트에 담겨있다. 아마도 곧...😅 playground 대신 우선은 gif로 어떤 라이브러리인지를 보여줄 수 있게 해두었다.

### 🤝🏻 지속적인 팔로업

우리가 라이브러리를 리서치하면서 세웠던 기준 중 하나가 지속적으로 업데이트 되는 라이브러리인지, 아닌지였다. 사실 한 달간의 프로젝트 끝에 초기버전을 배포하긴 했지만, 좀 더 수정하고 보완해야하는 부분이 많다. 당장 해결해야 하는 에러도 이슈탭에 달아두었고... 큰 이미지일수록, 형식이 png가 아닐수록 작업이 지연되는 현상이 있는데 그 부분도 의심되는 부분이 있어서 해결하고 로딩중 ui도 보여주어야 한다.

지속적인 팔로업을 위해 가장 중요한 코드의 가독성도 더 고민하고 수정해야할 부분이 많다. 가독성을 위해 구조분해할당을 시도했었으나 적용에 실패했다.

vue에서의 핵심은 this였는데, 이 this가 너무 많이 보이는 것이 지저분해 보여서 구조분해를 쓰고 싶었다. 나만 이런 생각을 하는 건가? this를 구조분해하는 건 뷰스럽지 않은 일인가? 싶어서 검색해보니 다행히 나랑 똑같은 생각을 하는 사람들이 있었다.

👉🏻 [링크](https://blog.logrocket.com/cleaning-up-your-vue-js-code-with-es6/)

그런데 막상 써보니까, reactive data값을 업데이트 할 때에는 구조분해를 쓸 수가 없었다.

![](https://images.velog.io/images/1703979/post/b006315f-7076-426c-b949-678de37ad994/%EA%B5%AC%EC%A1%B0%EB%B6%84%ED%95%B4.png)

왜냐면 constant가 되어버리기 때문이다... 뷰는 리액트처럼 state값을 업데이트할 때 쓰는 setState같은 게 없고 그냥 `this.something = 'update'` 이런식으로 쓰기 때문에 발생한 일이었다.

그래서 나는 선택을 해야 했다. 업데이트가 발생하는 부분만 구조분해를 쓰지 않고 다른 것들은 구조분해를 쓸지, 아니면 아예 전체적으로 구조분해를 쓰지 않을지. 아무리 생각해봐도 일부분만 구조분해를 쓰는 건 이상한 것 같았다. 안 쓸거면 전체 다 안 쓰는게 통일감 있고 코드를 읽는 사람이 예측가능해서 좋은 것 같았다. 그래서 안 쓰기로 결정함. 이것 때문에 vue 코드들에서 this를 구조분해하는 경우를 찾기 어려웠던 거였나보다 싶었다. 다른 방법을 아직 못 찾은 상황인데 더 찾아봐야지.

부족함이 많은 완성이라고 생각한다. 여기서 끝인 라이브러리가 아니라 지속적으로 수정 보완하여 더 안정적인 라이브러리를 위해 팔로업하겠다 🦾💪

## 👩🏻‍🎓 배운점

위에서 언급하지 않은 부분들 몇 가지만 꼽아보겠다.

### 설계적인 관점을 가지는 개발자가 되기

팀장님 말씀 중에 가장 인상깊었던 부분이다.  
**기능 구현은 누구나 할 수 있다. 중요한 것은 설계적인 관점을 가질 수 있냐, 아니냐이다.**

기능 구현에만 급급한 사람이 아니라 넓은 시야를 가지고 미래까지 생각하여 설계하는 개발자가 되어야 한다는 것을 느꼈다. 단순히 외주 개발을 하고 끝~! 하는 것이 아니라, 라이브러리의 경우에는 지속적인 업데이트가 이루어져야 하고 자체서비스를 개발하는 경우에도 유지-보수-업데이트가 지속적으로 이루어져야 한다. 이렇게 버전업을 할 때를 대비해서 초기단계에서부터 미래를 제한할 수도 있는 네이밍을 지양하고, deprecated될 우려가 있는 코드나 구조인지 항상 생각하는 것이 중요함을 배웠다. 간단한 기능이라도 이런 것을 항상 생각하는 개발자가 되어야 한다.

미래에 일어날 일은 아무도 예측할 수 없다. 그렇기 때문에 당장의 단계에서 이게 deprecated될 코드인지 아닌지도 정확히 예상할 수 없지만, **그래서 어렵지만**, 그럼에도 불구하고 라이브러리에 기여할 누군가와 미래에 유지-보수-확장할 나를 위해 지금 미리미리 생각을 많이 하고 코드를 짜야함을 다시 한 번 깨닫는다.

### 사용자 flow를 생각해야 함은 여러 번 강조해도 지나치지 않다

특히 프론트엔드 개발을 공부한다면 지겹도록 들었을 말이라고 생각한다. 아무리 멋지고 좋은 기술이라도 사용자가 안 쓰면 안 쓰는거다. 불편해서 손이 안 가면 그 프로젝트는 그냥 코딩 지식 자랑밖에 되지 않는다. 사실 처음 들었을 때 무슨 말인지는 알겠는데, 머리로는 이해는 되는데 온 몸으로 체감은 잘 안됐었다. 그런데 이번에 imoji editor 프로젝트를 진행하면서 항상 모든 회의에서 1순위로 생각한 것이 이거였다보니까 이제는 와닿는다. ~~역시 뭐든지 직접 겪어봐야...~~

솔직히 UX 디자이너나 PM이 하듯이 사용흐름에 대한 데이터를 분석하고 그로부터 결과를 도출해내서 근거로 쓰는 그 정도를 할 줄 아는 것은 아니지만, '나라면 이렇지 않을까?' 부터 시작해서 '이런 사람도 있을 수 있지 않을까?' 하고 넓고 다양하게 생각해보는 연습을 할 수 있었던 것 같다.

### 문제를 해결할 때에는 생각에 갇히는 것을 경계하자

이슈보드의 이슈들을 해결하는 과정에서 팀의 도움을 받기도 했다. 어떤 문제가 있는데 시도한 것은 이거였지만 이래서 안됐다...로 시작하면 모두 함께 고민해주셨다. 그 과정에서도 또 하나 배웠던 것은 특정 사고나 생각에 갇히는 것을 경계해야 한다는 것이다. '문제를 해결할 방법이 a같은데...' 싶은 생각이 들면 자꾸 그 a로 답을 정해두고 생각하고 리서치하게 된다는 것이다. 그럼 사실 b라는 아주 간단한 해결책이 있음에도 그걸 보지 못하게 된다. 이런 부분들을 경계하며 좀 떨어져서 구조적인 관점에서도 보는 등, 지엽적인 사고를 피해야 한다.

## 마무리하며

이 긴 글을 끝까지 읽으신 인내심 많은 당신에게 고맙다는 말을 전합니다. ~~어케 했누~~
