---
title: gatsby 블로그 OG 이미지 자동 생성하기
description: sns에 블로그 글을 공유할 때 보여질 깔끔한 썸네일을 만들어보자
date: 2022-09-05
lastUpdated: 2022-09-05
tags: [Gatsby, SideProject]
---

우리 회사 기술 블로그는 프론트엔드 개발자들의 리소스가 매우 부족하기 때문이다 가성비를 따져서 운영되고 있다.  
og image의 경우에도 그러했다.  
일단 블로그 메인 이미지로 버티자! 였고 블로그 포스트의 제목을 가지고 og image 만들기? 그런건 관심도 없었다.

하지만 최근들어 블로그 글이 그래도 한 달에 한 개를 목표로 꾸준히 올라오고 있어,
문득 아주 작은 사이드프로젝트로 자동으로 og image를 만들어주게 개선하면 좋겠다는 생각이 들었다.

그래서 우선 내 블로그에 실험 적용 해보았다.

## 누가 만들어둔 거 없나?

일단 블로그 포스트의 제목을 가지고 og image를 만들어주는 gatsby 플러그인이 당연히 있다.  
검색해보면 꽤 많이 나온다. 직접 만들기가 귀찮은 분들께는 플러그인 사용을 추천드린다.  
아래 항목 중에서는 첫 번째 것이 가장 최근까지도 유지보수가 되고 있는 것 같다.

- https://github.com/squer-solutions/gatsby-plugin-open-graph-images
- https://github.com/MelMacaluso/gatsby-plugin-og-images
- https://github.com/akr4/gatsby-plugin-og-image
- https://github.com/prismicio-community/gatsby-og-image-demo
- https://github.com/codepunkt/gatsby-remark-opengraph

플러그인을 써도 되지만, 간단한 작업으로 생각되기도 하고 무엇보다 오픈소스의 단점은 '메인테이너가 만들고 싶은 것만 만든다'이기 때문에, 직접 만들어보기로 했다.

## 어떻게 만들지?

오픈소스로 공유할 목적이 아니고 그냥 내 블로그에서만 쓰거나 괜찮으면 회사 기술 블로그에 적용할 목적이어서, 간단하게 구성하기로 했다.  
플로우는 다음과 같다.

1. 빌드시, node에서 아래 작업들이 이루어진다.
2. canvas를 이용해서 썸네일을 그린다.
3. 그걸 이미지 파일로 생성한다.
4. blog post template에서는 생성한 이미지 파일의 경로를 잡아서 og image 메타 태그를 만들어 등록한다.

## 1. canvas를 이용해서 썸네일을 그린다.

일반적으로 canvas하면 엥 그거 html에서 canvas 태그로 만지는 거 아니냐, 할 수 있는데 node에서도 canvas를 다룰 수 있다.  
나는 [node-canvas](https://github.com/Automattic/node-canvas)를 사용했다.

근데 플로우를 세운 것 까지는 좋았는데 한 가지 문제에 봉착했다.  
내가 갯츠비에 대해 문외한이라는 것이다.

node 스크립트를 넣으려면 `gatsby-node.ts`에 넣어야 하는 건 알겠다.  
아는 것이 이것 뿐이라 후술할 코드들, 즉 og image generator 로직은 전부 저기 안에 들어가있다... 😅

node-canvas를 이용해서 canvas를 생성해서 그 안에 마음껏 그리면 되는데, 정신건강상 브라우저 혹은 CodePen, Replit, CodeSandbox, JSFiddle 와 같은 online editor에서 먼저 스타일 작업을 하고 코드를 옮기는 것을 추천한다.  
canvas는 html, css와는 또 다른 존재이기 때문이다.

### 1-1. 캔버스 기본 세팅

어쨌거나 내가 그린 캔버스는 다음과 같다. 일단 가장 기본적인 세팅을 해준다.

```ts
import { createCanvas, registerFont } from 'canvas';

const generateOGImage = () => {
  // 필요한 상수를 선언한다.
  const HEIGHT = 400;
  const WIDTH = 800;
  const PADDING = 20;

  // 필요한 폰트를 등록한다. 라이브러리에 의하면 캔버스를 생성하기 전에 등록해야 한다.
  registerFont('src/fonts/Pretendard/Pretendard-Black.ttf', {
    family: 'Pretendard',
  });

  // 캔버스를 생성한다.
  const canvas = createCanvas(WIDTH, HEIGHT);
  const context = canvas.getContext('2d');

  // 썸네일의 배경을 설정한다. 나는 흰색 배경으로 설정했다.
  context.fillStyle = '#fff';
  context.fillRect(0, 0, WIDTH, HEIGHT);
};
```

가장 중요한, 이미지 생성이 제대로 되는지 확인하기 위해 아무것도 쓰여있지 않지만 일단 이미지로 만들어본다.  
위의 코드에 아래 코드를 추가로 작성한다.

```ts
import { existsSync, mkdirSync, writeFileSync } from 'fs';

// 임시 데이터 같은 개념이다. 화질이 조금이라도 좋게 png 형식을 선택했다.
const buffer = canvas.toBuffer('image/png');

// 노드에 내장된 함수를 이용해서, 특정 path가 존재하는지 확인해보고 존재하지 않는다면 디렉토리를 만들어준다.
if (!existsSync(`public/og-image`)) {
  mkdirSync(`public/og-image`);
}

// 마찬가지로 노드에 내장된 함수를 이용해서 특정 path에 이미지 파일을 생성한다.
writeFileSync(`public/og-image/index.png`, buffer);
```

빌드시 `generateOGImage`가 실행되게 하기 위해, `gatsby-node.ts`의 `createPages` 함수 안에 추가한다.  
아마 블로그 템플릿마다 코드가 조금씩 다르겠지만 대부분 `createPages` 함수는 무조건 있을 것이다.  
코드를 잘 읽어보고 적절한 위치에서 `generateOGImage`를 실행시키자.

이렇게 하고 `yarn build`를 실행하면 `public/og-image/index.png` 파일이 생성되었음을 확인할 수 있었다.

### 1-2. 포스트 제목을 캔버스에 그리기

그 다음으로 가장 중요한, 포스트 제목을 그려보자.

우선 포스트 제목이 제대로 불러와지는지 확인하는 것이 중요하기 때문에 폰트 스타일은 대충 했다.
`generateOGImage` 함수 안에 다음 코드를 `buffer`를 선언하기 전에 추가한다.

```ts
// 기본적인 폰트 스타일을 적용한다.
context.fillStyle = '#000';
context.font = '50px Pretendard';
context.textAlign = 'left';

// x, y축은 취향껏 설정한다.
context.fillText(post.frontmatter.title, PADDING, HEIGHT * 0.3);
```

포스트 제목은 frontmatter에서 꺼내면 될 것 같다.  
[1-1](#1-1-캔버스-기본-세팅)에서 보았던 `createPages` 내부를 잘 보면, frontmatter를 꺼내는 부분이 있을 것이다.  
만약에 없으면 필드를 추가해서 꺼내면 된다. 나도 없어서 요로코롬 추가해서 꺼냈다.

```ts
await graphql(`
  {
    allMarkdownRemark(
      sort: { fields: [frontmatter___lastUpdated], order: ASC }
      limit: 1000
    ) {
      nodes {
        id
        frontmatter {
          title
        }
        fields {
          slug
        }
      }
    }
  }
`);
```

nil 체크를 해준 다음, `generateOGImage` 함수에 인자로 title을 넘겨준다.

```ts
generateOGImage(post.frontmatter.title);
```

다시 이미지를 생성해서 확인해보자. 생성된 이미지를 열어보니 아주 놀라운 일이 발생해있는데, 바로 텍스트가 wrap되지 않고 잘려있는 것이다.

위에서도 말했지만 캔버스는 html, css와 다르기 때문에 자동으로 텍스트가 캔버스 크기에 맞춰 wrap되지 않는다. 텍스트는 계속해서 한 줄로 뻗어나가고 캔버스는 width가 정해져있기 때문에 그만큼만 보이는 것이다.

즉, 문제 해결을 위해서 수동으로 wrap을 해주어야 한다.  
이 문제는 예전부터 많은 사람들이 해결한 문제이기 때문에, 구글링을 해보면 수많은 코드를 찾을 수 있다. 그중에서 괜찮아 보이는 친구를 가져왔다.

동작 원리는 간단한데, 일단 string을 한 글자 한 글자 다 쪼갠 다음에 다시 한 글자 한 글자 붙이다가 지정한 텍스트 한 줄의 max width가 되면 붙여 이은 텍스트를 한 줄로 판단하고 배열에 넣고, 그 다음 글자를 첫번째로 동일 루트를 반복하는 것이다.

```ts
import type { CanvasRenderingContext2D } from 'canvas';

function wrapPostTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const currentWidth = ctx.measureText(currentLine + ' ' + word).width;
    if (currentWidth < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
```

이렇게 하면 배열에는 요소로 각 라인이 담기게 되는 것이고, 이 라인을 y축으로 이어 붙이면 wrap된 텍스트를 그릴 수 있게 되는 것이다.

```ts
const wrappedPostTitleLines = wrapPostTitle(context, postTitle, WIDTH * 0.7);

const LINE_HEIGHT = 60;
wrappedPostTitleLines.forEach((line, index) => {
  context.fillText(line, PADDING, HEIGHT * 0.3 + index * LINE_HEIGHT);
});
```

이렇게 하면 wrap된 텍스트가 잘 그려지는 것을 확인할 수 있다.  
다만 텍스트가 그저 검정색이라 좀 심심해보여, 그라데이션을 추가해주었다.

```ts
// 폰트 스타일
// 그라데이션 각도를 315도로 할 것이다.
const angle = (315 * Math.PI) / 180;
const x2 = 300 * Math.cos(angle);
const y2 = 300 * Math.sin(angle);

// 그라데이션을 생성한다.
const gradient = context.createLinearGradient(0, 0, x2, y2);
gradient.addColorStop(0, '#bcb2f5');
gradient.addColorStop(1, '#40c9ff');

// 그라데이션을 적용한다.
context.fillStyle = gradient;
context.font = '50px Pretendard';
context.textAlign = 'left';
context.textBaseline = 'bottom';
```

### 1-3. 블로그 로고를 캔버스에 그리기

포스트 제목까지 그리는 데 성공했으나 제목만 있으니 좀 심심해서 블로그 로고를 넣어보았다.  
보통 작성일자, url, 작성자 이름 등을 넣기도 하는데 나는 깔끔하게 블로그 로고만 넣고 싶었다.

블로그 로고라는 것이 별 건 아니고, 블로그의 헤더 부분의 이 부분이다.
![image](https://user-images.githubusercontent.com/89953090/188475943-368235a0-eb76-4166-b447-f5115c5904e3.png)

저 부분을 캡쳐해서 배경 이미지를 만든 다음 캔버스 배경으로 넣어줄지, 아니면 그냥 캔버스에서 그려줄지 고민했는데 결론적으론 두 번째 방법을 적용했다. 로고가 간단하기 때문이다.  
하지만 회사 기술 블로그에서는 이미지를 이용하는 방법을 선택했기 때문에 둘 다 기록해보겠다.

먼저 캔버스에 그대로 그리는 방법이다.

```ts
// 블로그 로고
const LOGO_TEXT_WIDTH = 189;
const LOGO_HEIGHT = 40;

// 로고의 위치를 우측 하단 모서리로 계획했는데, 좌측 상단 모서리를 (0,0)으로 두고 좌표 계산하기가 머리아파서 좌표 기준점을 우측 하단으로 옮겼다.
context.setTransform(1, 0, 0, 1, WIDTH - PADDING, HEIGHT - PADDING);

// 로고의 원 부분을 만들어준다.
context.beginPath();
context.arc(-LOGO_TEXT_WIDTH, -LOGO_HEIGHT, LOGO_HEIGHT, 0, 2 * Math.PI);
context.fillStyle = '#bcb2f5';
context.fill();

// 로고의 블로그 제목 부분을 만들어준다.
context.fillStyle = '#2d3748';
context.font = '32px Pretendard';
context.textAlign = 'right';
context.textBaseline = 'bottom';
context.fillText('emewjin.log', 0, -LOGO_HEIGHT / 2);
```

이게 끝이다. 결과적으로 블로그 제목과 합쳐져서 다음과 같은 모습이 된다 🥰
![](https://raw.githubusercontent.com/emewjin/emewjin.github.io/deploy/og-image/playwright-vs-cypress/index.png)

### 1-4. 배경 이미지를 캔버스에 그리기

만약 배경 이미지를 따로 만들었고 요걸 캔버스의 배경으로 깔고 싶다면 다음과 같이 하면 된다.  
이미지를 로드하고 그리는 방법은 [node-canvas에서 여러가지를 소개하고 있는데](https://github.com/Automattic/node-canvas#imagesrc), 나는 어디 cdn에 이미지를 올리는 것이 아니고 로컬에 있는 이미지를 불러오는 것이기 때문에 공식문서에 따라 다음과 같이 코드를 작성했다.

```ts
// 배경 이미지
const img = new Image();
img.onload = () => context.drawImage(img, 0, 0);
img.onerror = (err) => {
  throw err;
};
img.src = 'static/og-image-bg.png';
```

## 2. 이미지 파일로 생성한다.

캔버스가 완성되었으니 파일을 생성할 차례이다.  
파일을 생성하는 방법은 위에서도 간단하게 보았으나 그건 sample이고, 블로그 포스트 컴포넌트에서 og image의 path를 쉽게 찾아갈 수 있도록 적절한 경로에 이미지를 생성해주는 것이 포인트이다.

내 경우엔 아예 `og-image` 라는 별도의 폴더를 만들어서, `slug`별로 디렉토리를 만들고 파일 이름은 `index.png`로 통일했다.

```ts
const buffer = canvas.toBuffer('image/png');

if (!existsSync(`public/og-image${slug}`)) {
  // recursive: true 옵션을 설정해주어야 경로에서 /로 구분된 디렉토리를 재귀적으로 생성해준다.
  mkdirSync(`public/og-image${slug}`, { recursive: true });
}

writeFileSync(`public/og-image${slug}index.png`, buffer);
```

## 3. 포스트 템플릿에서 og image를 사용한다.

사용하는 블로그 템플릿마다 다 다르겠지만, 내가 쓰는 블로그 템플릿에서는 `Seo` 컴포넌트 내부에서는 공통되는 메타 태그들만 등록해두었고 블로그 포스트처럼 다 다를 수 있는 메타 태그는 직접 prop으로 넘기도록 되어있다.

회사 블로그에선 그렇게 되어있지 않아 내 블로그와 같은 방식으로 수정했다. 블로그 포스트의 경우 우리가 generate한 이미지를 사용하고, 그 외의 페이지들에 대해서는 기본 이미지를 사용하게끔.

앞서 생성한 이미지들을 올바른 경로로 가져오는 코드는 다음과 같이 작성했다.

```ts
const post = data.markdownRemark!;
const ogImage = post.fields?.slug
  ? `${siteUrl}/og-image${post.fields.slug}index.png`
  : '';

// og image meta tag를 만들어준다.
function generateOgImageTags(content) {
  const properties = ['og:image', 'twitter:image'];
  return properties.map((property) => {
    return {
      property,
      content,
    };
  });
}

const meta: Metadata[] = !ogImage ? [] : generateOgImageTags(ogImage);

return (
  <Layout location={location} title={siteTitle}>
    <Seo
      lang='en'
      title={title ?? ''}
      description={description ?? post.excerpt ?? ''}
      meta={meta}
    />
    ...
  </Layout>
);
```

## 4. 배포!
