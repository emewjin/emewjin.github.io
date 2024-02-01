---
title: 합성형 컴포넌트로 에디터 리팩토링하기
description: 2023년 겨울, 사내 에디터 라이브러리의 복잡도를 낮추기 위해 합성형 컴포넌트로 리팩토링한 경험에 대해 글로 기록하려고 한다.
date: 2023-12-31
lastUpdated: 2023-12-31
tags: [Refactoring]
---

2023년 겨울, 사내 에디터 라이브러리를 리팩토링한 경험에 대해 글로 기록하려고 한다.

## 리팩토링 계기

> XP 팀은 나누고 정복하지 않고, 정복하고 나누고 또 정복한다. 처음에는 소규모 팀이 소규모 시스템을 작성한다. 그런 다음 자연스러운 분할선을 찾아 시스템을 비교적 독립적인 부분으로 나누어 확장한다.” - 켄트 벡, 익스트림 프로그래밍

나누고 정복하지 않고, 정복하고 나누고 또 정복하는 이유는 우리가 만들 대상을 처음부터 잘 알지 못하기 때문이라고 한다. 일단 정복한다는 것은 일단 학습한다는 의미이며, 일하면서 정복하다 보면 학습의 수준이 올라간다. 그 올라간 수준에 맞게 다시 나누고, 다시 학습하고, 나누고를 반복하다 보면 더 정밀하게 나눌 수 있다. 잘못 나누었던 것을 다시 합칠 수도 있다.

지금의 회사에서 개발한 에디터가 이랬다.

[tiptap](https://tiptap.dev/)을 이용한 에디터에는 시간이 지나며 작은 요구사항들이 쌓였지만, 진짜 큰 변화를 맞은 것은 <구텐베르크> 프로젝트라고 할 수 있다.

<구텐베르크> 프로젝트는 온라인 강의를 업로드하는 ‘지식공유자'들이 직접 강의 소개글을 손쉽게 작성할 수 있도록 에디터를 개선하는 프로젝트이다. 이 프로젝트에서 내가 맡은 역할은 기존의 에디터에 <구텐베르크>를 위한 기능을 추가하는 일이었다. 해당 업무를 진행하며 가장 중요했던 부분은,

**에디터는 사내 라이브러리라는 점이다.**

인프런의 각 서비스는 도메인 별로 나뉘어 담당하는 팀이 있고, 이 팀은 각기 다른 기획자와 디자이너와 개발자로 이루어져 있다. 에디터를 주로 담당하는 플랫폼 팀은 존재하지 않기 때문에 필요한 팀이 직접 사내 라이브러리를 수정한다. 그러다 보면 사내 라이브러리가 특정 비즈니스 로직에 종속되기 쉽다. 그렇게 되지 않게 신경 써서 개발하는 것은 물론, 다른 팀의 서비스에 장애가 발생하지 않도록 하위호환성도 지켜져야 한다.

### 하위호환성

<구텐베르크> 프로젝트에 맞게 기능 명세와 디자인이 나오면, 개발자인 나는 이 스펙이 ‘사내 라이브러리'로서 적용될 것인지 아니면 <구텐베르크> 한정으로 적용될 것인지를 먼저 판단해야 했다. 팀의 기획자와 디자이너와 가장 많이 이야기 나눈 것도 이 부분이었다.

사내 라이브러리를 개발할 때 특히 챙겨야 할 것은 인터페이스이다. 라이브러리의 인터페이스는 직접 개발하지 않은 사람이 README 또는 타입 선언만 읽고도 사용하는 데 문제가 없도록 쉽고 직관적이어야 한다고 생각한다. 사용뿐만 아니라 직접 기여하게 될 때에도 마찬가지이다. 그런데 처음부터 그게 가능하게 인터페이스가 구축되어 있다면 몰라도, 그렇지 않다면 breaking change 수준의 변경이 발생해야만 그게 가능할 수도 있다. <구텐베르크> 프로젝트가 그랬다. 정확히 어떤 문제점이 있었는지는 뒤에서 자세히 후술 하겠다.

### 일정에 맞춘 개발

자연스럽게 개발 시 고민이 많아졌다. 하지만 늘 그렇듯, 고민만 하고 있을 수는 없다. 2주 단위로 스프린트가 운영되기 때문에 QA 전에는 기능 개발이 완료되어야 하기 때문이다. 우리 팀은 일정을 맞추는 것이 가장 중요하고, 그러다 보면 코드 퀄리티는 뒷전이 되기 마련이다. 지극히 인간적인 이유라고 생각한다.

### 어려워진 유지보수

결과적으로 <구텐베르크> 작업으로 인해 에디터의 유지보수가 어려워졌다. 하위호환성을 고려하여 다른 팀에서 에디터를 사용할 때 장애가 발생하지 않고 업데이트 시 수정이 필요 없게끔 하기 위해, <구텐베르크> 프로젝트의 일정에 맞추기 위해, 에디터 내부 코드가 지저분해졌기 때문이다. <구텐베르크> 작업자가 아니면 코드를 이해하기 어려워졌고 특히 <구텐베르크> 이전에 에디터를 개발하던 사람도 코드를 수정하려고 하면 많이 헷갈려했다.
![](https://github.com/emewjin/emewjin.github.io/assets/76927618/eed98f65-c6a9-4960-a53a-aa7412c7e62d)

에디터는 한 번만 쓰고 버릴 프로덕트가 아니었기 때문에 위기감을 느꼈다. 리팩토링을 통해 반드시 변경에 유연하고 유지보수가 어렵지 않은 코드로 개선해야 한다는 목표가 생겼다.

## 리팩토링 계획

<구텐베르크> 프로젝트가 성공적으로 마무리되고, 다음 프로젝트를 시작하기 전까지 여유가 생겼다. 업무 시간 중 생긴 빈 자투리 시간을 포함하여 퇴근 후 개인 여가시간을 활용해 사이드 프로젝트처럼 리팩토링을 진행했다.

> 누군가는 리팩토링도 업무이기 때문에 업무 시간 중 리팩토링을 위한 시간을 따로 확보해 진행해야 한다고 생각할 수도 있지만, 개인적으로는 항상 꼭 그렇게 하지 않아도 된다고 생각했다. 물론 자발적 노예가 되려고 한 것은 아니고 😅 에디터 리팩토링 자체를 업무보다는 재미있는 개발 소재라고 생각했고 빨리 해보고 싶은 욕심이 있었다.

아래에서는 리팩토링을 진행하기로 마음먹은 뒤 어떻게 진행할 것인지와 필요하다고 생각한 준비물에 대해 간략하게 구상한 내용을 소개하겠다.

### 테스트코드

테스트코드는 왜 필요할까?

전통적인 관점에서 소프트웨어는 공산품에 가깝게 봤다고 한다. 반면 최근에는 소프트웨어를 생물에 가깝게 보며, 생물을 키우는 관점으로 소프트웨어에 접근한다고 한다. 이때 '키운다'의 의미는 처음부터 완성하려 하는 것이 아니라 작게 시작해서 조금씩 환경에 맞춰 적응할 수 있게 해 나가는 것을 의미한다. 딱 우리 회사 에디터 프로덕트가 그렇다.

만약 테스트코드를 통해 변경 안전망을 구축한다면 피드백 주기를 좀 더 공격적으로 가져갈 수 있다. 에디터는 사내 라이브러리인 만큼 여러 서비스에 영향을 주기 때문에 안정성이 중요하고, 테스트코드로 안전망을 구축한다면 두려움 없이 빠르게 개선할 수 있을 것이라고 판단했다. 이번 리팩토링은 breaking change를 계획하고 있기 때문에 이 점이 더더욱 중요했다. 그래서 현재의 구조를 최대한 유지하는 선에서 기본적인 기능에 대한 E2E 테스트코드를 먼저 작성했다.

### prerelease

리팩토링의 범위는 당연히 메이저 업데이트로 계획했다. 이번 리팩토링 결과물이 릴리즈 되면 에디터를 사용하던 곳에서는 전부 breaking change를 감수해야 할 것이다.

기존에 [changesets](https://github.com/changesets/changesets)을 이용해 버전 릴리즈를 하고 있었기 때문에, 새로운 메이저 버전의 브랜치를 생성하고 [prerelease](https://github.com/changesets/changesets/blob/main/docs/prereleases.md) 액션을 작성했다. 어느 정도 준비가 되면 changesets의 prerelease를 통해 next 버전을 생성하고 <구텐베르크>에 설치하여 테스트를 해본 뒤 문제가 없으면 정식으로 릴리즈를 할 생각이었다.

```yaml
name: Prerelease
on:
  push:
    paths:
      - '.changeset/**'
      - 'packages/**'
      - '.storybook/**'
      - '.github/workflows/**'
      - 'package.json'
    branches:
      - v5-editor

...중략...

jobs:
  changesets:
    name: Run changesets
    runs-on: ubuntu-latest
    outputs:
      published: ${{ steps.changesets.outputs.published }}
      packages: ${{ steps.changesets.outputs.publishedPackages }}
    steps:
      ...중략...

      - name: Create release Pull request or Publish npm
        id: changesets
        uses: changesets/action@v1
        with:
          publish: yarn release
          commit: '[PRERELEASE] Release new version packages'
          title: '[PRERELEASE] Release new version packages'
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

...중략...
```

prerelease를 새 브랜치에서만 진행하는 이유는 리팩토링을 진행하는 동안 기존 에디터의 배포 파이프라인에 영향을 주지 않기 위함이다. 새 버전을 준비하는 동안 기존 에디터에 버그 수정과 같은 patch 업데이트가 발생하지 않으리란 보장이 없기 때문이다. 물론 가장 이상적인 방법은 현재의 최신 버전에서 코드 프리징을 하는 것일 테지만, 빠르게 비즈니스 로직 업데이트가 이루어지고 배포가 빈번한 회사의 사정상 자투리 시간에 하는 리팩토링을 이유로 한 달 이상 코드 프리징을 할 수는 없었다.

만약 코드 프리징을 해서 main 브랜치에 리팩토링 코드를 바로바로 병합할 수 있다고 해도 prerelease를 위한 브랜치를 따로 두는 것이 합리적이다. 왜냐하면 에디터 코드가 위치한 디자인 시스템 레포지토리 특성상 다른 패키지의 배포에 영향을 줄 수 있기 때문이다. changesets은 prerelease를 하려면 pre 모드에 진입하는데, 이때 pre.json이 생성된다. 이 파일이 존재하면 changesets이 새 패키지 버전을 배포할 때 next 버전으로 (beta, alpha 등 명칭은 붙이기 나름이다) 배포하기 때문에 main 브랜치에 코드를 바로바로 병합할 수 없었다.

### 목표

간단히 말해, 리팩토링의 목표는 복잡성을 줄이는 것이다.

1. 변경에 유연한 프로덕트로 개선하기. 특히 Control.
2. 유지보수가 쉬운 코드로 개선하기.
   - 중복 코드 제거
   - 하나의 소스 출처로 개선

이 두 가지는 이전의 에디터가 가지고 있는 문제점으로부터 도출되었다.

## 문제 진단

리팩토링을 시작하기 전에 기존 에디터에 어떤 문제가 있는지를 먼저 파악해야 한다.

<구텐베르크>의 요구사항은 크게 두 가지였다. 새로운 에디터 컨트롤 추가와 에디터 툴바 디자인 변경. 이 두 가지를 수행하려면 에디터 코드를 수정해야 했다. 그런데 처음으로 에디터 코드에 접근, 읽기 시작했을 때 코드가 복잡하다는 인상을 먼저 받았고 이는 곧 진입장벽으로 느껴졌다. 왜 그랬을까?

### 시작하기 전에

기존의 에디터 패키지의 모습과 사용 방법은 다음과 같다.  
`@inflearn/editor` 패키지에서는 `Editor` 컴포넌트를 export 하고, 사용처에서는 이 컴포넌트를 이용해 에디터를 렌더링 한다.

```tsx
// 사용처
<Editor
  isToolbarSticky
  controls={[
    ['bold', 'italic', 'strikethrough', 'link'],
    ['code', 'codeBlock', 'blockquote', 'image'],
    ['h1', 'h2', 'h3', 'bulletList', 'orderedList', 'divider'],
  ]}
  ref={editorRef}
  placeholder={getPlaceholder(category)}
  uploadImage={mutateAsync}
  height='100%'
  maxHeight='none'
  onClickToolbarButton={(type) => {
    if (!type) {
      return;
    }

    editorControlLookup[type]();
  }}
/>
```

`<Editor>` 컴포넌트는 보통 아래와 같은 모습으로 렌더링 된다. 컨트롤(Control)은 에디터 툴바 내, 클릭해서 작성하는 콘텐츠에 관한 기능이 적용되게 하는 UI를 의미한다.

![](https://github.com/emewjin/emewjin.github.io/assets/76927618/408cfd9e-3122-4b26-969d-1b6a45dac336)
![](https://github.com/emewjin/emewjin.github.io/assets/76927618/404af803-978a-48dc-8aa2-b2e70296a356)

### 문제 1. 한곳에 뭉쳐있는 로직

대표적으로 `Editor` 컴포넌트 내 로직을 보면 비즈니스 로직과 UI를 위한 로직(css-in-js 스타일링 코드를 포함)이 섞여있다. `Toolbar` 컴포넌트도 마찬가지이다. 주입받은 control 목록을 원하는 데이터 포맷으로 만들어내는 로직, control 목록과 control별 옵션을 매핑하는 로직, 툴바의 모습을 결정하는 스타일 관련 로직이 한 군데에 있었다.

이는 수정/개선이 필요할 때 작업이 필요한 로직만을 빠르게 찾아내기 어렵게 만들었다.

### 문제 2. 정의되지 않은 컴포넌트 개념

에디터에서 주요하게 봐야 하는 컴포넌트의 개념적 정의가 이루어지지 않았다. 이는 곧 의사소통의 문제로 이어진다.

### 문제 3. 분리되지 않은 관심사, 넓어지는 수정 범위

예를 들어 처음 코드를 읽는 사람이 툴바의 동작을 이해하려면 `Editor` 컴포넌트, `Toolbar` 컴포넌트, `getControl` 함수 이렇게 세 가지를 주요하게 봐야 했다. 툴바나 컨트롤을 수정하고자 하면 관련된 정보를 이 셋이 전부 다 알고 있어야만 하는 구조였기 때문이다.

이런 구조 때문에 특히 수정이 빈번했던 컨트롤에 대해 작업하려고 한다면 아래 흐름 속의 컴포넌트와 함수를 모두 들여다보아야 했다. 수정범위는 당연히 그만큼 넓어졌다.

![](https://github.com/emewjin/emewjin.github.io/assets/76927618/37b829ab-5c55-403d-a5d0-9c801a2a6a1f)

자연스레 복잡도가 높아지고 휴먼 에러 발생 확률도 높아졌다. 게다가 기존에 사용하던 공통 타입 시그니처는 이를 고려하지 않았기 때문에 컨트롤에 대한 `onClick` 콜백의 타입 문제도 발생했다.

### 문제 4. 무분별한 인터페이스

빠른 개발을 위해 일단 다 `Editor` 컴포넌트의 prop으로 옵션을 넘겨받도록 하다 보니 외부에 오픈해야 할 것과 아닌 것의 고민 없이 운영되고 있었다. 특히 보다 직접적인 관련을 맺고 있는 대상의 인터페이스로 열려있는 것이 아니라 prop이 의미하는 바의 직관성이 더 떨어졌다.

아래는 기존의 prop 목록이다. 툴바만 알고 있어도 되는 것, 특정 컨트롤만 알고 있어도 되는 것이 섞여 있다.

```tsx
export type EditorProps = {
  editor?: TiptapReactEditor | null;
  initialValue?: string;
  extensions?: Extensions;
  controls?: Control[][];
  floatingControls?: Control[][];
  controlTooltipWithinPortal?: boolean;
  bubbleControls?: Control[][];
  maxImageSize?: number;
  disabled?: boolean;
  onChange?: SetContent;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  uploadImage?: UploadFormData;
  onClickToolbarButton?: OnClickToolbarButton;
  isToolbarSticky?: boolean;
  colorPalette?: ColorPaletteOptions;
  headingLevels?: TypoHeadingLevelOptions;
  activateFixedToolbar?: boolean;
  activateFocusToolbar?: boolean;
  customControls?: ControlOption[];
  soleCustomControls?: ControlOption[];
};
```

또한 이는 외부에서 주입하는 prop이 실제로 모든 컨트롤이나 익스텐션^[tiptap의 기능 확장 단위, [공식문서](https://tiptap.dev/docs/editor/api/extensions)]에 제대로 연결되어 있는지 확인하기 어렵게 만들었다. Editor를 통해서만 주입받다 보니 실제 해당 값이 필요한 코드까지 도달하는 거리가 멀었기 때문이다. 실제로 이로 인한 버그가 발생하기도 했다.

## 해결

### 합성형 컴포넌트(compound component)

위에서 진단한 문제점들은 여러 개이지만 사실 각각은 연결되어 있다. 또한 기존과 달리 <구텐베르크> 프로젝트를 계기로 자유도를 좀 더 요구하게 되었기 때문에 발생한 문제라는 공통점도 있다. 때문에 에디터를 **합성형 컴포넌트(compound component)** 로 제공하도록 리팩토링 하는 것이 가장 합리적인 해결 방법이 될 수 있을 것이라고 생각했다.

합성형 컴포넌트로 에디터를 구축한다면 사용처에서는 에디터 패키지가 제공하는 컴포넌트를 이용해 자신만의 에디터를 조립할 수 있다. 이는 예전보다 에디터 패키지가 제공하는 문서를 꼼꼼하게 읽어야 하고 작성하는 코드가 많아진다는 불편함이 있긴 하지만, **에디터 패키지의 주도권 아래** 다양한 요구사항에 유연하게 대응할 수 있을 정도의 자유도를 확보할 수 있다는 장점이 있다. 우리 회사처럼 각 팀마다 에디터를 사용하는 정책이 각기 다른 상황에서 최적의 구조라고 생각했다.

합성형 컴포넌트로 각 블록을 제공하려면 먼저 개념적 정의가 선행되어야 한다. 이는 개발자, 기획자, 디자이너가 모두 같은 언어로 에디터를 이해하고 소통하기 위해서도 필요했다. 같은 언어로 프로덕트를 바라보는 것은 원활한 커뮤니케이션을 가능하게 한다.

여기서부터는 에디터의 주요 구성요소 별로 어떻게 리팩토링이 이루어졌는지를 설명하려고 한다. (내부 코드는 변경되었어도 제공하는 기능은 변함없다.)

### Toolbar

기존에 Toolbar 컴포넌트에서 처리하던 모든 비즈니스 로직을 분리하려고 했다. 원래는 [문제 1](#문제-1-한-곳에-뭉쳐있는-로직)에서 얘기했던 것처럼 로직이 뭉쳐있는 모습이었다.

```tsx
// Toolbar.tsx

// control의 종류에 맞는 ui 컴포넌트를 결정하는 로직
const getToolbarControl = ({
  ...
}) => {
  if (controlOption.uiType === 'dropdown') {
    return (
      <DropdownControl
        key={key}
        controlName={controlName}
        controlOption={controlOption}
        editorDisabled={editorDisabled}
        activateFixedToolbar={activateFixedToolbar}
      />
    );
  }

  if (controlOption.uiType === 'popover') {
    return (
      <PopoverControl
        key={key}
        controlName={controlName}
        controlOption={controlOption}
        editorDisabled={editorDisabled}
      />
    );
  }

  return (
    <ButtonControl
      key={key}
      controlName={controlName}
      controlOption={controlOption}
      editorDisabled={editorDisabled}
      disableTooltip={disableTooltip}
    />
  );
};

export default function Toolbar({...}) {
  // 툴바 안에서 또 다른 구역 안에 렌더링 될 컨트롤을 분리하는 로직
  const soleControlGroup = soleCustomControls.map((option, _index) => (
    <div tabIndex={0} className='toolbar-group' key={`solo-control-${_index}`}>
      {getToolbarControl({
        controlName: 'soleCustom',
        key: `soleCustom-${_index}`,
        controlOption: option,
        disableTooltip,
        editorDisabled,
        activateFixedToolbar,
      })}
    </div>
  ));

  // control 이름 배열을 토대로 custom 컨트롤과 일반 컨트롤 ui를 결정하는 로직. divider를 그려내는 로직이 포함되어 있다.
  const parsedControls = controls.filter((control) => control.length !== 0);

  const controlGroups = parsedControls.map((group, index) => {
    const controlGroup = group
      .filter(
        (controlName) =>
          controlName !== 'soleCustom' &&
          (controlName === 'custom' || utils[controlName])
      )
      .map((controlName, _index) => {
        if (controlName === 'custom') {
          return (
            <Fragment key={`${controlName}-${_index}`}>
              {customControls.map((customControl, customControlIndex) =>
                getToolbarControl({
                  controlName,
                  key: `${controlName}-${customControlIndex}`,
                  controlOption: customControl,
                  disableTooltip,
                  editorDisabled,
                  activateFixedToolbar,
                })
              )}
            </Fragment>
          );
        }

        if (controlName !== 'soleCustom') {
          // control 이름을 기준으로 해당 control을 구성하는데 필요한 설정값들을 매핑하여 UI 컴포넌트에 전달
          const controlOption = utils[controlName];

          return getToolbarControl({
            controlName,
            key: controlName,
            controlOption,
            disableTooltip,
            editorDisabled,
            activateFixedToolbar,
          });
        }
      });

    return (
      <Fragment key={index}>
        <div tabIndex={0} className='toolbar-group'>
          {controlGroup}
        </div>
        {parsedControls.length - 1 === index ? null : (
          <div className='toolbar-divider' />
        )}
      </Fragment>
    );
  });

  // 각종 유틸들
  const validControls = [controlGroups, soleControlGroup].filter(
    (groups) => groups.length !== 0
  );

  // 각종 스타일 관련 함수들
  const stickyClassName = isToolbarSticky ? 'sticky' : '';

  const toolbarContainerClassName = `editor-toolbar-container ${stickyClassName} ${
    classNameSuffix ? `editor-toolbar-container--${classNameSuffix}` : ''
  }`;

  const toolbarsClassName = `editor-toolbars ${
    classNameSuffix ? `editor-toolbars--${classNameSuffix}` : ''
  }`;

  // 최종적으로 렌더링되는 toolbar의 모습
  return (
    <div className={toolbarsClassName}>
      {validControls.map((groups, index) => (
        <div
          key={`validControls-${index}`}
          className={toolbarContainerClassName}
        >
          {groups}
        </div>
      ))}
    </div>
  );
}
```

지금의 Toolbar 컴포넌트는 **컨트롤에 대해서는 아예 신경 쓰지 않은 채** 툴바에 대해서만 관심을 집중한다. 툴바는 담당하는 역할에 따라 작게 나누어져 각각의 개념에서 스타일을 관리하고 추가적인 기능을 적용한다.

**Toolbar (`ToolbarContainer`):**  
툴바의 최상위 컨테이너. 툴바의 노출 방법, 툴바 내 컨트롤의 툴팁 설정 등 툴바 내에서 **전체적으로 적용되어야 하는 설정**을 관리한다.

```tsx
export function ToolbarContainer({
  type = 'fixed',
  tooltipWithinPortal = false,
  opened = false,
  className,
  children,
}: Props) {
  if (type === 'focus') {
    return (
      <ToolbarProvider value={{ tooltipWithinPortal }}>
        <FocusMenuWrapper opened={opened}>
          <div className={toolbarClassName}>{children}</div>
        </FocusMenuWrapper>
      </ToolbarProvider>
    );
  }

  return (
    <ToolbarProvider value={{ tooltipWithinPortal }}>
      <div className={toolbarClassName}>{children}</div>
    </ToolbarProvider>
  );
}
```

**ToolbarFragment:**  
`ToolbarControlsGroup` 을 여러 개 가질 수 있는 컨테이너. `ToolbarControlsGroup` 사이의 divider 렌더링을 관리하고, `ToolbarFragment`를 구분하는 것으로 기존에 `soleControl`로 처리하던 디자인을 충족할 수 있다.
![](https://github.com/emewjin/emewjin.github.io/assets/76927618/404af803-978a-48dc-8aa2-b2e70296a356)

```tsx
// UI만 관여
export const ToolbarFragment = ({ showDivider = false, children }: Props) => (
  <div
    data-testid='toolbar-fragment'
    className={`editor-toolbar__fragment ${
      showDivider ? 'editor-toolbar__controls-group--divider' : ''
    }`}
  >
    {Children.map(children, (child, index) => (
      <Fragment key={index}>{child}</Fragment>
    ))}
  </div>
);
```

**ToolbarControlsGroup:**  
컨트롤을 여러 개 가질 수 있는 컨테이너. 컨트롤 사이의 간격과 같은 스타일을 관리한다. 이 컴포넌트를 기준으로 divider가 그려진다.

```tsx
export const ToolbarControlsGroup = ({ children }: Props) => (
  <div
    className='editor-toolbar__controls-group'
    data-testid='toolbar-controls-group'
  >
    {children}
  </div>
);
```

이렇게 함으로써 수정/개선이 필요한 부분을 빠르게 찾아갈 수 있게 되었다. 모든 구성 요소를 사용한 모습은 다음과 같다.

```tsx
<Editor.Toolbar tooltipWithinPortal>
  <Editor.ToolbarFragment showDivider>
    <Editor.ToolbarControlsGroup> control들... </Editor.ToolbarControlsGroup>
    <Editor.ToolbarControlsGroup> control들... </Editor.ToolbarControlsGroup>
    <Editor.ToolbarControlsGroup> control들... </Editor.ToolbarControlsGroup>
    <Editor.ToolbarControlsGroup> control들... </Editor.ToolbarControlsGroup>
  </Editor.ToolbarFragment>
</Editor.Toolbar>
```

### Control

위에서 이야기했듯 기존의 툴바 로직에서 컨트롤을 분리했다. 그리고 컨트롤 관련된 로직들을 class를 이용해 정리했다.

컨트롤의 로직을 정리하는 수단으로 class를 선택한 데에 거창한 이유가 있는 것은 아니다. 지금까지 항상 function만을 이용해 왔었기 때문에 class라는 색다름을 느껴보고 싶었다. 또 javascript의 class가 완전한 class가 아니라고 하더라도 그 syntax sugar를 통해 (private 등등) function보다 좀 더 명시적으로 의도를 드러낼 수 있겠다고 생각했다.

기존에는 각 컨트롤에서 필요한 옵션을 외부에서 주입받아야 하는 경우, 앞서 말했듯 `Editor` 컴포넌트의 prop을 통해서 주입받았다. `context` API를 사용해서 컨트롤 컴포넌트에 전달하기까지의 거리를 좁힌다고 하더라도 직관성은 이름으로밖에 보장할 수 없었다.
하지만 합성형 컴포넌트로 리팩토링 하면서, 각 컨트롤에 필요한 옵션은 각 컨트롤 컴포넌트를 통해 직접 전달받게 되어 훨씬 직관적이게 수정되었다.

```tsx
// as-is
<Editor colorPaletteOptions={COLORS} />

// to-be
<Editor.TextColor colorPaletteOptions={COLORS} />
```

그리고 [문제 3](#문제-3-분리되지-않은-관심사-넓어지는-수정-범위)에서 살펴본 것처럼 컨트롤을 추가하려고 할 때 살펴봐야 하는 파일이 많다는 문제점도 해결되었다.

```tsx
// Editor.tsx

export const Editor = (
...
  const toolbarUtils = getControl(
      editorInstance,
      maxImageSize,
      uploadImage,
      showNotification,
      controlTooltipWithinPortal,
      colorPalette,
      headingLevels,
      onClickToolbarButton
    );

    return (
      ...
          <Toolbar
            controls={controls}
            utils={toolbarUtils}
            editorDisabled={disabled}
            isToolbarSticky={isToolbarSticky}
            customControls={customControls}
            soleCustomControls={soleCustomControls}
            activateFixedToolbar={activateFixedToolbar}
          />
      ...
    )
)

// Toolbar.tsx
// control의 종류에 맞는 ui 컴포넌트를 결정하는 로직
const getToolbarControl = ({
  ...
}) => {
  if (controlOption.uiType === 'dropdown') {
    return (
      <DropdownControl
        key={key}
        controlName={controlName}
        controlOption={controlOption}
        editorDisabled={editorDisabled}
        activateFixedToolbar={activateFixedToolbar}
      />
    );
  }

  if (controlOption.uiType === 'popover') {
    return (
      <PopoverControl
        key={key}
        controlName={controlName}
        controlOption={controlOption}
        editorDisabled={editorDisabled}
      />
    );
  }

  return (
    <ButtonControl
      key={key}
      controlName={controlName}
      controlOption={controlOption}
      editorDisabled={editorDisabled}
      disableTooltip={disableTooltip}
    />
  );
};

// getControl.ts

export default function getControl(...): ControlUtil {
  const commonUtil = {
    onClickToolbarButton,
    editor,
    controlTooltipWithinPortal,
  };

  return {
    bold: boldControlOption(commonUtil),
    ...
  };
}

// boldControlOption.tsx
export function boldControlOption({
  onClickToolbarButton,
  editor,
  controlTooltipWithinPortal,
}: CommonProperty): ControlOption {
  return {
    uiType: 'button',
    icon: <Icon icon={faBold} />,
    control: 'bold',
    onClick: () => {
      onClickToolbarButton?.('bold');
      editor.chain().focus().toggleBold().run();
    },
    isActive: () => editor.isActive('bold'),
    controlTooltipWithinPortal,
    tooltip: {
      mac: '굵게',
    },
    isDisabled: () => editor.isActive('heading'),
  };
}
```

기존에는 새로운 컨트롤을 추가할 때 `Editor`과 `Toolbar`까지 넘나들며 이 파일들을 다 봐야만 했다면, 지금은 흐름이 아래와 같이 정리되었다. `Control`을 직접 담당하는 부분 외에는 보지 않아도 된다.
![](https://github.com/emewjin/emewjin.github.io/assets/76927618/e011db10-3d28-407f-b09d-cde101f841e7)

```
Controls
├── _base
├── button
│   ├── bold (control별 디렉토리)
│   │   ├── BoldControl.tsx
│   │   └── BoldControlOption.ts
│   ├── ButtonControl.tsx
│   ├── ButtonControlOptionInterface.ts
│   └── index.ts
├── dropdown
├── popover
└── types.ts
```

컨트롤은 크게 3가지 유형이 제공되는 것으로 정의되었다. 그리고 유형별로 공통 UI 컴포넌트 하나, 공통 옵션 인터페이스 하나를 제공한다. UI 로직과 비즈니스 로직을 분리해 보려는 시도가 담겼다.

이렇게 함으로써 서로 다른 3가지의 컨트롤이 공통 인터페이스를 가지고 있을 필요가 없게 되었다. 각각이 최상위의 개념이기 때문이다.

예를 들어 button, popover 컨트롤은 `onClickCallback` 함수에 인자로 `controlName`만 전달하면 됐지만, dropdown 컨트롤은 `dropdownItem`을 클릭했을 때 `onClickCallback` 함수가 울려야 하므로 `controlName`외에도 `dropdownItem`의 value, label을 인자로 받을 수 있어야 했다.  
기존 에디터에서는 이러한 차이점이 있어도 하위호환성을 깨트리지 않기 위해 `onClickCallback`함수가 공통으로 쓰여서 코드가 지저분했는데, 컨트롤 유형별로 재정의되면서 추상화가 깨지고 `onClickCallback`의 형태가 나누어져 깔끔해졌다.

새로운 컨트롤을 추가할 때에는 이를 이용해서 개발하면 된다. button 유형에 해당하는 bold 컨트롤을 예시로 살펴보겠다.

```tsx
// BoldControl.tsx

// 외부에 공개하는 인터페이스. bold 컨트롤에 대한 데이터만 주입받음.
type BoldControlProps = ButtonControlCommonProps;

export const BoldControl = ({ onClickCallback }: BoldControlProps) => {
  const { editor } = useContext(EditorContext);

  if (!editor) {
    return null;
  }

  // bold control을 기능적으로 구성하는데 필요한 로직 처리를 담당한다. 이 컴포넌트에서는 해당 로직에는 관심 없으며, 그 결과만을 이용한다.
  const options = new BoldControlOption(editor, onClickCallback);

  return (
    <ButtonControl
      controlName={options.controlName}
      isActive={() => options.isActive()}
      isDisabled={() => options.isDisabled()}
      onClickControl={() => options.onClickControl()}
      // 비즈니스 로직과 관련없는 UI 관련은 option class에서 담당하지 않는다.
      tooltipLabel='굵게'
      icon={<Icon icon={faBold} />}
    />
  );
};

// BoldControlOption.ts

// UI 컴포넌트에서 분리할 수 있는, 컨트롤을 기능적으로 이용하는데 필수적인 리액트와 관련 없는 비즈니스 로직과 메타 정보를 담당
export class BoldControlOption implements ButtonControlOptionInterface {
  private readonly _controlName = 'bold';

  constructor(
    private readonly editor: Editor,

    private readonly onClickControlCallback?: OnClickControlCallback
  ) {}

  get controlName() {
    return this._controlName;
  }

  onClickControl() {
    this.onClickControlCallback?.(this._controlName);
    this.editor.chain().focus().toggleBold().run();
  }

  isActive() {
    return this.editor.isActive(this._controlName);
  }

  isDisabled() {
    return this.editor.isActive('heading');
  }

  // ButtonControlOptionInterface에서 정의된 내용을 충족했다면 그 외에 특정 컨트롤에만 필요한 비즈니스 로직을 추가로 작성해도 문제없음.
}
```

당연히 컨트롤에 문제가 생겼거나 개선 요청이 들어올 경우 위 두 파일만 확인하면 된다. 더 나아간다면 유형별 기반이 되는 `ButtonControl.tsx` 혹은 `ButtonControlOptionInterface.ts`까지만 살펴보면 된다. 컨트롤을 사용할 때에는 다음과 같이 사용한다.

```tsx
// as-is
<Editor controls={[['bold']]} />

// to-be
<Editor>
  <Editor.Toolbar tooltipWithinPortal>
        <Editor.ToolbarFragment showDivider>
          <Editor.ToolbarControlsGroup>
            <Editor.Bold />
          </Editor.ToolbarControlsGroup>
        </Editor.ToolbarFragment>
  </Editor.Toolbar>
</Editor>
```

만약 공통 라이브러리 차원에서 제공되지 않는, 특정 서비스에서만 필요한 커스텀 컨트롤을 추가해야 한다면 어떻게 될까? 기존에는 하위호환성을 깨트리지 않기 위해 다음과 같이 다소 억지스러운 API를 제공했었다.

```tsx
// as-is
<Editor
  // custom control 렌더링을 Editor에서 담당하기 때문에, 사용한다고 알려줌
  controls={[['custom']]}
  // custom control 모습 및 로직을 사용처에서 작성해서 넘겨줌
  customControls={[
    {
      onClick: (targetValue) => {
        if (typeof targetValue === 'string') {
          onChangeColor?.(targetValue);

          if (targetValue === 'deep-blue') {
            editor?.commands.setColor(WHITE_COLOR);
          }

          if (editor) {
            editor.commands.focus();
          }

          onClickEditorToolbarButtons?.({
            controlType: 'bg' + startCase(targetValue),
            elementType: 'InfoBox',
            blockType,
          });
        }
      },
      uiType: 'dropdown',
      icon: <InfoBoxColorDropdownItem color={color} />,
      control: 'custom',
      currentValue: color,
      dropdownWidth: 48,
      dropdownItem: InfoBoxTextColorDropdownItem,
      dropdownOptions: InfoBoxColorDropdownColorSet,
    },
  ]}
/>
```

이제는 에디터 패키지에서 제공하는 컨트롤의 인터페이스만 만족한다면, 합성형 컴포넌트의 특징을 이용해 직접 개발한 컨트롤 컴포넌트를 툴바를 구성할 때 끼워 넣으면 된다.

```tsx
<Editor>
  <Editor.Toolbar type='focus' tooltipWithinPortal={false}>
    <Editor.ToolbarFragment>
      <Editor.ToolbarControlsGroup>
        ... // 직접 개발한 커스텀 컨트롤
        <BackgroundColorControl
          currentColor={color}
          onChangeBackgroundColor={onChangeColor}
          onClickCallback={handleClickBackgroundColorControl}
        />
      </Editor.ToolbarControlsGroup>
    </Editor.ToolbarFragment>
    <Editor.ToolbarFragment>
      <Editor.ToolbarControlsGroup>
        // 직접 개발한 커스텀 컨트롤
        <RemoveElementControl onClickCallback={onClickRemoveButton} />
      </Editor.ToolbarControlsGroup>
    </Editor.ToolbarFragment>
  </Editor.Toolbar>
  <Editor.Content />
</Editor>;

// RemoveElementControl.tsx
import type { ButtonControlCommonProps } from '@inflearn/editor';
import { ButtonControl, EditorContext } from '@inflearn/editor';

import { RemoveElementControlOption } from './RemoveElementControlOption';

type RemoveElementControlProps = ButtonControlCommonProps;

export const RemoveElementControl = ({
  onClickCallback,
}: RemoveElementControlProps) => {
  const { editor } = useContext(EditorContext);

  if (!editor) {
    return null;
  }

  const options = new RemoveElementControlOption(editor, onClickCallback);

  return (
    <ButtonControl
      tooltip={options.tooltip}
      controlName={options.controlName}
      isActive={() => options.isActive()}
      isDisabled={() => options.isDisabled()}
      onClickControl={() => options.onClickControl()}
      icon={<Icon icon={faArrowsRotate} />}
      tooltipLabel='요소 삭제'
    />
  );
};

// RemoveElementControlOption.ts
import type {
  OnClickControlCallback,
  TiptapReactEditorType,
  ButtonControlOptionInterface,
} from '@inflearn/editor';

export class RemoveElementControlOption
  implements ButtonControlOptionInterface
{
  private readonly _controlName = 'removeElement';

  constructor(
    private readonly editor: TiptapReactEditorType,
    private readonly onClickControlCallback?: OnClickControlCallback
  ) {}

  get controlName() {
    return this._controlName;
  }

  onClickControl() {
    this.onClickControlCallback?.(this._controlName);
  }

  isActive() {
    return this.editor.isActive(this._controlName);
  }

  isDisabled() {
    return false;
  }
}
```

## 리팩토링 결과 배포

changesets의 prerelease를 이용해 next 버전을 출시했다.

![](https://github.com/emewjin/emewjin.github.io/assets/76927618/404f1593-c847-4c0d-a651-d8e17468a6d4)

그리고 <구텐베르크>에 설치하여 개발서버에서 모니터링했다. 테스트코드를 통해 최소한의 기능 동작을 보장한 채로 리팩토링 했기 때문인지 리팩토링 과정으로 인해 발생한 버그는 거의 없었다.

그렇게 운영 릴리즈를 해도 괜찮겠다는 판단이 들었을 때, 새로운 메이저 버전이 정식으로 출시되었다.
![](https://github.com/emewjin/emewjin.github.io/assets/76927618/53b1bf19-869c-4e30-a18a-cc45e388afba)

### 문서화

에디터는 사내 라이브러리이고, 우리는 플랫폼 팀이 없기 때문에 각 팀에서 에디터를 수월하게 업데이트할 수 있도록 가이드 문서가 제공되어야겠다고 판단했다.

> 이 글은 주제가 리팩토링이기 때문에 별도로 언급하지 않았지만 메이저 버전인 만큼 리팩토링 외에도 몇 가지의 breaking change가 있었다. (리팩토링 이전 버전에서 사용되던 prop/API deprecate, 일부 컨트롤 deprecate, 기존에도 있었는데 몰랐던 버그 수정, 디자인 개선 등)

어떤 변경점이 있는지를 안내하는 문서와 함께 각 breaking change마다 어떻게 대응하면 되는지를 마크다운으로 작성한 가이드 문서를 함께 배포했다. 깃허브에 접근할 수 없는 기획자와 프로덕트 디자이너도 필요하다면 보실 수 있도록 스토리북에도 함께 배포했다. 마크다운 문서가 스토리북에 임베딩되는 구조라서 md 파일만 수정하면 된다.

![](https://github.com/emewjin/emewjin.github.io/assets/76927618/fa097d57-ec41-4bdf-95f6-ceaf807a379f)

더불어, 에디터를 이루는 각 구조를 개념적으로 정의하고 달라진 사용방법을 정의한 README도 업데이트 했다. 이 역시 마찬가지로 스토리북에도 함께 배포했다.
![](https://github.com/emewjin/emewjin.github.io/assets/76927618/5ede9073-fff2-43d1-a017-7b9135a5b36c)

사실 문서화 작업에 들인 시간이 코드를 작성하는 시간과 맞먹는 것 같다. 문서도 하나의 출처로 관리되는 것이 바람직하기 때문에 여러 번의 수정 끝에 README를 기반으로 breaking change 문서가 통합될 수 있게 작성했다.

## 마무리

이렇게 에디터 리팩토링이 끝이 났다. ~~올해 안에 리팩토링 과정을 블로그에 게시하겠다는 다짐도 지켜냈다 와!!~~

major change로 나가야 하는 큼직한 문제점들 위주로 개선이 되었고, minor나 patch 수준의 것들은 아직 남아있지만 천천히 개선해 나가려고 한다.

이번 리팩토링을 통해 앞으로 에디터 프로덕트를 좀 더 쉽게 사용하고 유지보수 할 수 있게 되기를 기대한다. 하지만 이것으로 단번에 완벽한 프로덕트를 만들어냈다고 생각하진 않는다. 위에서 이야기했듯 이번 '나누기'를 통해 좀 더 고도화된 제품을 다시 '정복'하다 보면 또다시 나눠야 하는 순간이 찾아올 것이다. 그럼 또 반복하면 된다 🤗
