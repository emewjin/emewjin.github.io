---
title: 'playwright는 진짜 cypress보다 빠를까?'
description: '진짜 더 빠르더라'
date: 2022-06-12
lastUpdated: 2022-06-12
tags: [TestCode, Playwright]
---

최근들어 실용적인 프론트엔드 테스트에는 E2E 테스트가 맞는 거 같다는 생각이 들었다. 왜냐하면 비즈니스 로직에 대해서만 테스트를 작성하려고 해도 결국엔 DOM 렌더링을 확인하는 것으로 귀결되면서 UI 테스트를 함께 하는 것 같다는 그런 애매한 생각이 들었기 때문이다. 하지만 E2E 테스트 도구로 널리 쓰이는 cypress의 끔찍하게 느린 속도는 도저히 용납이 되지 않아 고민되던 차에, 마이크로소프트에서 개발하는 (정확히는 개발팀이 마이크로소프트로 들어간거지만) playwright라는 테스트 도구를 알게 되었다. 정확히는 테스트 도구는 아니지만 어쨌든 E2E 테스트 도구로 쓸 수 있다.

여튼 주된 관심사는 어느 블로그에서 **"cypress와는 비교할 수 없을 정도로 더 빠르다"** 라고 평가한 점이었다. playwright는 병렬로 테스트를 수행하기 때문에 더 빠르다는 말이 진짜인지, 어느정도로 더 빠른지가 궁금했다.

**참고문서**

- https://junghan92.medium.com/playwright-test%EB%A1%9C-E2E-%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%95%98%EA%B8%B0-vs-cypress-473948d3b697
- https://playwright.dev/

## 설치와 환경구성

[공식문서](https://playwright.dev/docs/intro#manually)를 참고해 진행한다. cypress처럼 샘플 테스트를 작성해주지 않아서 그런가 설치 속도는 더 빨랐다.

```
yarn add -D @playwright/test
# install supported browsers
npx playwright install
```

### Config 작성

- https://playwright.dev/docs/intro#configuration-file

아직 찍먹 단계이기 때문에 config 파일에 어떤 것들을 설정할 수 있는지 상세하게 보지는 못하고 기본적인 것들만 설정했다.

- headless 테스트가 당연히 GUI가 보이는 것보다 더 빠를 것이므로 headless를 false로 설정했다.
- 테스트 대상이 되는 baseUrl 를 지정했다.
- 테스트 돌릴 브라우저 환경을 지정했다.

```js
import { playwrightTestConfig, devices } from '@playwright/test';

const config: playwrightTestConfig = {
  use: {
    baseURL: 'http://localhost:4010',
    headless: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};
export default config;
```

### 스크립트 추가

테스트 파일을 playwright 폴더에 모아두고 이 폴더에 있는 테스트만 돌리는 스크립트를 추가한다.

```
"playwright": "playwright test playwright"
```

공식문서에서 제공하는 샘플 테스트가 스크립트에 의해 잘 돌아가는지 확인한다.

```ts
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  const title = page.locator('.navbar**inner .navbar**title');
  await expect(title).toHaveText('playwright');
});
```

![e9f6cd4b-3dfe-42ad-bb7e-d370692f3623](https://user-images.githubusercontent.com/76927618/173226137-b21c9d02-a04f-454a-bcf5-6cc0434c6885.png)

config 파일에서 세 가지 브라우저 환경을 지정했기 때문에 한 번의 실행으로 여러 브라우저 환경을 동시에 테스트 할 수 있다. 서로 다른 브라우저 환경이기 때문에 병렬로 테스트를 수행해 총 10초가 아니라 5초 걸렸다.

![onlyone](https://user-images.githubusercontent.com/76927618/173226227-1995f556-fb50-4a2d-8af4-3765eb1e1f77.gif)

vsc 기준이지만 IDE에서도 테스트가 잘 돌아간다. IDE 속의 test runner GUI를 통해 spec 안에서 원하는 test만 돌릴 수도 있다.

![감동짤방격한감동짤방,_대화_필수템_주워가세요](https://user-images.githubusercontent.com/76927618/173226140-9dfe0668-2318-43f1-88ca-5c64bfbe2bcb.gif)

## 문법

playwright로 테스트를 작성할 때 꼭 알아야 하는 개념과 문법들은 다음과 같다.

- test function : https://playwright.dev/docs/api/class-test
- assertions : https://playwright.dev/docs/test-assertions#locator-assertions-not
- expect function : jest와 동일하다. https://jestjs.io/docs/expect
- locator : https://playwright.dev/docs/api/class-locator  
  주로 재사용을 목적으로 요소를 찾는데 쓰인다. `page`와 자주 헷갈리는데 둘의 차이점은 [위키 글](https://emewjin.github.io/playwright-wiki/#page%EC%99%80-locator%EC%9D%98-%EC%B0%A8%EC%9D%B4%EC%A0%90)에 기록해두었다.

  ```js
  // button.subscribe를 가진 article
  page.locator('article', { has: page.locator('button.subscribe') });

  // 특정 text를 가진 button
  await page.locator('button', { hasText: 'Sign up' }).click();

  // Find by text.
  await page.locator('text=Sign up').click();

  // Find by CSS.
  await page.locator('button.sign-up').click();

  // Find by test id.
  await page.locator('data-testid=sign-up').click();
  ```

- page : https://playwright.dev/docs/api/class-page
- selector : https://playwright.dev/docs/selectors
- fixture : https://playwright.dev/docs/api/class-fixtures, https://playwright.dev/docs/test-fixtures
  - fixture는 독립적이다.
    - 테스트에 필요한 환경을 구축하는 데 쓴다, 가 맞는거 같다.
  - fixture를 만들고 `test.extend(fixtures)` 으로 fixture를 포함한 test func을 만들어 사용한다. test func의 두 번째 인자 함수의 첫 번째 매개변수가 fixture이다.
  - fixture는 Page Object Model pattern을 따라 만든다.
  - cypess에선 매번 `beforeEach` 로 특정 페이지로 이동하는 코드, 즉 테스트를 위한 셋업을 짰다면 playwright에서는 아래와 같이 fixture로 만들어 둘 수 있다. 당연히 재사용도 가능하다. cypress에 대한 지식이 짧아서 거기서도 되는진 모르겠다.
  ```js
  // 기본 제공되는 page fixture를 수정
  const test = base.extend({
    page: async ({ page }, use) => {
      await page.goto(url);
      await use(page);
    },
  });
  ```

그리고 jest 와 달랐던 점은 `context` 가 없다는 것 정도? 지원하는 써드파티 라이브러리가 있는지는 모르겠으나 일단 공식적으로는 없었다. `test.describe` 와 `test` 만 사용 가능했다.

## 테스트 속도가 Cypress보다 진짜 더 빠를까?

문법을 대강 알아보았으니 cypress로 작성했던 테스트를 똑같이 playwright로도 작성해서 속도를 비교해보았다. 인텔 맥북에서 측정한 속도라서 m1 pro 맥북에서 측정한 속도와는 약간 차이가 있을 수 있다.

- 테스트 대상 : 랠릿의 회사 소개 페이지, 포지션 탐색 필터
- 테스트 환경 : headless off, chrome 브라우저 1개 only, 클라이언트와 서버 모두 localhost로 띄워둔 상황

| headless off 기준 | case 7개 spec 1개 | case 7개 spec 2개 |
| ----------------- | ----------------- | ----------------- |
| cypress           | 49.79s            | 92.94s            |
| playwright        | **30.37s**        | **35s**           |

다양하게, 많이 테스트를 작성해본 것은 아니지만 다음과 같은 결론을 낼 수 있었다.

- spec 1개 기준으로 드라마틱하게 더 빠르거나 하진 않다.
- 하지만 spec이 여러 개일 경우 병렬로 수행되기 때문에 cypress보다 드라마틱하게 빨라진다.
- 물론, 그렇게 빨라져도 단위/통합 테스트보다는 느리다. 아주 많이 느리다.

결국 핵심은 **병렬로 테스트를 돌릴 수 있냐 아니냐**였다.

playwright는 무료로, 기본적으로 병렬 테스트 기능을 제공하지만 cypress는 유료 플랜에 가입했을 경우 통합 CI CD 환경에서만 병렬로 테스트를 수행할 수 있다. 다음은 cypress의 공식문서 내용을 의역한 것이다.

> 프로젝트가 많은 spec을 가지고 있다면 하나의 기기로 모든 테스트를 수행하는데 긴 시간이 필요합니다. CI 환경에서 많은 가상 머신을 이용해 병렬적으로 테스트를 수행하는 것은 팀의 시간과 비용을 아껴줍니다.
>
> Cypress는 3.1.0버전부터 여러 가상머신을 이용해 recorded test 수행을 지원합니다. 병렬 테스트는 하나의 기기로도 수행할 수 있긴 하지만, Cypress에서는 추천하지 않습니다. 왜냐하면 하나의 기기로 병렬 테스트를 수행하게 되면 너무나 많은 리소스를 필요로 하기 때문입니다.
>
> 따라서 Cypress에서 제공하는 병렬 테스트 가이드는 개발자가 이미 CI를 이용해 테스트를 수행하고, 녹화하고 있음을 전제로 합니다. 만약 개발자가 아직 그런 세팅을 하지 않았다면, Cypress에서 제공하는 CI 가이드 (Continuous Integration guIDE.)를 참고하세요. 만약 테스트를 여러 브라우저에서 동시에 수행하고 싶다면, 병렬 테스트를 이용한 효과적인 CI에 도움이 될 수 있는 Cross Browser Testing guIDE 를 참고하세요.

아무리 병렬로 돌린다 한들 E2E 테스트는 비용이 크기 때문에 CI에서 활용할 계획이 없는 우리 팀에겐 쓸모없는 플랜이었고 결론적으로 병렬로 테스트가 가능한건 playwright 하나였다.

## 그외 playwright와 Cypress 비교

가장 궁금했던 점을 해결했으니 속도 외에 cypress에서 playwright로 옮길 때 어떤 차이들이 있는지도 확인해보았다. 아래에 나열된 정보들은 내가 생각했을 때 상대 도구에 비해 가지는 장점이다. 역시 cypress에 대한 지식이 짧기 때문에 사실 cypress에서도 할 수 있는 것들이 playwright의 장점으로 들어가 있을 수도 있다.

**playwright**

- VSC와 같은 회사라 그런지 몰라도 제공하는 익스텐션 (Playwright Test for VSCode) 이 있다. 이를 이용해 코드 수정 없이 spec 안에서 원하는 테스트케이스 (test)만 손쉽게 돌릴 수 있다. cypress에는 이게 안되는데 정말 불편했던 점이었음...
  ![onlyone](https://user-images.githubusercontent.com/76927618/173226227-1995f556-fb50-4a2d-8af4-3765eb1e1f77.gif)

- 데스크탑, 모바일 등 다양한 기기를 한 번에 테스트할 수 있음
- hover, drag 가능 : cypress는 자바스크립트를 이용한 hover 만 테스트할 수 있다.
- 로그인 정보 저장 : 테스트 할 때 필요한 auth 정보를 json으로 저장해두었다가 테스트시 활용할 수 있다.
- playwright 문법에 익숙해지고나면 component 테스트도 playwright로 할 수 있다. 지금 아직 실험적 단계이긴 하지만 테스트 속도 측면에서 jest와 크게 차이가 없었다.
- test generator : cypress에서도 크롬 익스텐션을 설치하면 code gen을 이용할 수 있다고 하던데 playwright는 좀 더 공식적으로 지원하는 느낌이었다. code gen으로 테스트를 그냥 막 만들 수는 없지만, 요소를 선택한다거나 유저 인터랙션을 코드로 옮길 때 아주 용이했다. 특히 happy path 테스트를 작성할 때 굉장히 유용할 거 같다.
  ![codegen](https://user-images.githubusercontent.com/76927618/173226030-3905f610-febf-4dc5-b1a7-018c9863a16e.gif)

**cypress**

- array loop가 불편하다.

  - 테스트를 작성하다보면 분명히 배열을 가지고 반복을 해야하는 순간이 온다. 이때 가장 많이 쓰는 것이 개인적으로는 forEach 인데 [playwright 깃허브의 이슈](https://github.com/microsoft/playwright/issues/13071) 에 따르면 playwright에서는 사용할 수 없다. 니즈는 있는데, 기술적으로 한계라는 입장 (자세한 내용은 이슈 링크 참고)이라 앞으로 개선이 될지 모르겠다. 불편하게 `for loop` 로 힘들게 작성해야 하다는 게 개인적으로 playwright의 가장 큰 단점이었다.
  - 반면 cypress에서는 사용할 수 있다. 다음과 같이 `cy.wrap` 을 이용하면 된다.
    ```ts
    cy.wrap([
      '홈페이지',
      '주소',
      '직원 수',
      '산업군',
      '투자금액 (억)',
      '연 매출 (억)',
    ]).each((label) => {
      cy.contains(`${label}`).should('be.visible');
    });
    ```

- GUI 도구: playwright에서도 GUI로 테스트를 확인할 수 있는 방법(https://playwright.dev/docs/inspector/)이 있긴 하다. 하지만 둘을 비교해보았을 때 cypress의 GUI가 보다 이용하기 쉽고 직관적이었다.
- watch mode : cypress의 테스트 러너는 실행 이후 코드가 변경되면 테스트를 다시 수행하는 watch mode로 동작한다. 그러나 playwright는 내가 못 찾는 건지 모르겠는데 cypress와 같은 watch mode는 없었다. 단, component 테스트에는 추가할 계획인듯.

## 결론

프론트엔드 진영에서 테스트 코드 자체가 보편적이지 않은 상황이라 cypress를 하드하게 쓰지 않았다고 해도 대부분이 E2E하면 cypress가 친숙할텐데 playwright를 **새롭게 학습**하면서까지 옮겨가야 할 이유가 있을까?

나는 그 이유가 '속도'라고 생각했다.  
cypress를 탈출하고 싶은 가장 큰 이유가 너무 느린 테스트 속도였기 때문이다.

playwright를 쓰더라도 단위테스트에 비해 속도가 느리기 때문에 비용이 높은 것은 여전하지만, **cypress보다는 빨라짐을 확인할 수 있었다.** 비록 cypress가 GUI나 array loop 면에서 강점을 가지긴 하지만 속도가 가장 중요했던 입장에서 playwright로 넘어갈 이유는 충분하다고 생각했다.
