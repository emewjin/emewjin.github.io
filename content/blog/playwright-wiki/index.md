---
title: 'playwright 위키'
description: 'playwright를 이용해 테스트를 작성하며 마주한 이슈나 새로 알게된 점들을 기록한다.'
date: 2022-05-29
lastUpdated: 2022-06-11
tags: [TestCode, Playwright]
---

## page url이 보장이 되지 않는 현상

아래와 같은 테스트를 작성시 간헐적으로 `currentUrl` 이 필터 클릭 결과가 반영되지 않은 url, 즉 **이벤트 발생 이전의 url**로 잡히는 경우가 있었다. 그래서 테스트가 깨질 때도 있고 안 깨질 때도 있었는데 이 현상은 병렬로 돌리는 테스트의 수가 늘어날 수록 더 심해졌다.

```ts
test('지역 선택시 기존 필터를 유지한다', async ({
  page,
  regionFilter,
  seoulFilter,
}) => {
  await page.goto('/positions?job=BACKEND_DEVELOPER&jobGroup=DEVELOPER');

  await regionFilter.click();
  await seoulFilter.click();

  const currentUrl = page.url();
  const { search } = new URL(currentUrl);
  const queryObject = parse(search);

  expect(queryObject.addressRegion).toBe('SEOUL');
  expect(queryObject.jobGroup).toBe('DEVELOPER');
  expect(queryObject.job).toBe('BACKEND_DEVELOPER');
});
```

이 문제는 아래와 같이 `expect` 의 `toHaveURL` 메서드를 이용할 경우 순서가 보장되어 해결할 수 있었지만, url을 문자열로 통째로 넘겨야 하기 때문에 테스트를 유지보수하기도 어렵고 가독성도 안 좋아진다는 단점이 있다.

```ts
test('지역 선택시 기존 필터를 유지한다', async ({
  page,
  regionFilter,
  seoulFilter,
}) => {
  await page.goto('/positions?job=BACKEND_DEVELOPER&jobGroup=DEVELOPER');

  await regionFilter.click();
  await seoulFilter.click();

  await expect(page).toHaveURL(
    'http://localhost:4010/positions?addressRegion=SEOUL&job=BACKEND_DEVELOPER&jobGroup=DEVELOPER&pageNumber=1'
  );
});
```

이렇게 하지 않고 url을 파싱해서 쓰기 위해, `page.url`이 현재의 url을 반환하는 것을 보장할 필요가 있다. 아래는 참고한 글이다.

- https://github.com/microsoft/playwright/issues/4684
- https://stackoverflow.com/questions/68488352/using-playwright-page-url-is-getting-a-previous-url-instead-of-the-current-ur

공식문서에 관련해 활용할 수 있는 다양한 `waitFor` 함수들을 제공한다. 용도에 맞게 쓰면 되는데, 그중에서 내가 사용한 것은 `page.waitForNavigation([options])` 이었다. 이름 그대로의 역할을 해준다.

```ts
test('지역 선택시 기존 필터를 유지한다', async ({
  page,
  regionFilter,
  seoulFilter,
}) => {
  await page.goto('/positions?job=BACKEND_DEVELOPER&jobGroup=DEVELOPER');

  await regionFilter.click();
  await seoulFilter.click();

  await page.waitForNavigation();

  const { addressRegion, jobGroup, job } = parseSearch(page);

  expect(addressRegion).toBe('SEOUL');
  expect(jobGroup).toBe('DEVELOPER');
  expect(job).toBe('BACKEND_DEVELOPER');
});
```

## page와 locator의 차이점

공식문서를 바탕으로 테스트를 짜다보니 `page.locator().click()` 과 `page.click()`의 차이점이 궁금해졌다. 그리고 이에 대한 답을 [깃허브 디스커션](https://github.com/microsoft/playwright/discussions/13649)에서 발견할 수 있었다.

**locator를 이용해 특정한 요소는 재사용이 가능하지만 page를 이용한 것은 그렇지 않다는 것이다.**

즉, `page.locator(sel).click()`과 `page.click(sel)` 는 완전히 동일하지만 재사용이 가능하냐 아니냐만 다르다. locator를 이용해서 해당 요소를 재사용하지 않을 거라면 타이핑 해야 하는 코드양이 더 적은 후자를 사용하는 것이 낫다. 반면 미리 정의한 locator가 있다면 `page.locator().click()`을 쓰는 것이 재사용성을 위해 좋다.

```ts
const button = page.locator('main button[name="직군 개발"]');
// locator를 이용해서 특정 요소를 선택하고, 여러 method에 재사용할 수 있음
await button.click();
await button.hover();
```

## 컴포넌트 테스트

이제 playwright에서 컴포넌트 테스트를 지원한다는 소식을 접했다.
![image](https://user-images.githubusercontent.com/76927618/170854817-ca21c54c-5d9a-4516-9a0b-6f409c588ab2.png)

기존에 컴포넌트 테스트는 RTL로 작성했기 때문에 cypress와 비교할 건 아니다. RTL로 작성된 테스트와 비교했을 때 속도가 더 느리지만 않는다면 e2e도 컴포넌트 테스트도 모두 playwright 하나로 해결할 수 있다는 점이 끌렸다. playwright 문법에만 익숙해지면 되니까.

그래서 아주 간단하게 동일한 컴포넌트 테스트를 RTL, playwright로 짜서 비교해보았는데 속도차이가 없었다. 다만 이 부분도 테스트가 너무 간단해서 그럴 수 있어 대규모 spec에서도 차이가 없는지 확인이 필요하다.

속도보다도 더 중요한 부분을 발견했는데, playwright의 컴포넌트 테스트가 아직 실험적 기능이다보니 아주 간단한 테스트를 작성하던 중에도 버그를 발견하는 등 불안정한 것 같단 생각이 들었다. 발견한 버그는 이슈리포팅(https://github.com/microsoft/playwright/issues/14339) 했고, 다음 버전에서 수정 예정인듯.

1. tailwind의 [] 표현 (arbitrary value)이 사용된 컴포넌트 테스트시 에러나는 점
2. React의 fragment를 인지하지 못해 에러나는 점 (div로 바꿔주어야 했음)

따라서 당장 활용은 불가능할거 같고 stable될 때까지 좀 더 지켜보기로 했다.
