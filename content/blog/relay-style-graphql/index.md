---
title: (번역) Relay-style GraphQL
description: GraphQL을 Relay-style로 사용했을 때의 이점에 대해 상세하게 설명하는 글입니다. 원문 https://alan.norbauer.com/articles/relay-style-graphql 저자의 동의를 받고 한국어로 번역했습니다.
date: 2023-10-20
lastUpdated: 2023-11-17
tags: [React, GraphQL, 번역]
---

> 원문: https://alan.norbauer.com/articles/relay-style-graphql  
> 이 글은 원작자의 동의를 받고 한국어로 번역되었습니다.  
> 오역 또는 더 정확한 표현에 대한 코멘트는 항상 환영입니다!

---

> ”~~미래형~~ Relay-style GraphQL은 이미 존재한다 - 다만 고르게 퍼져있지 않을 뿐이다.”  
> – William Gibson, probably

“Relay-style GraphQL”은 React 애플리케이션에서 GraphQL을 사용하는 한 가지 방법이며, *아마도* 현재 사용하고 있는 방법보다 더 나은 방법일 것입니다. 이 방법은 Meta의 GraphQL 오픈소스 라이브러리, [Relay](https://relay.dev/ 'https://relay.dev/')의 아이디어를 따릅니다.

Relay는 이러한 아이디어^[The Guild is [working on](https://the-guild.dev/blog/unleash-the-power-of-fragments-with-graphql-codegen 'https://the-guild.dev/blog/unleash-the-power-of-fragments-with-graphql-codegen') bringing these ideas to other libraries.]를 독점하지 않으며, Apollo와 같은 프레임워크로도 충분히 Relay-style의 GraphQL을 작성할 수 있습니다. 반대로, Relay로도 충분히 구식 GraphQL을 작성할 수도 있습니다. 이 용어는 _기술적으로 가능한 것과는 관계없이_, 최신 버전의 Relay-style로 작성된 GraphQL 코드와 그렇지 않은 오늘날 대부분의 다른 GraphQL 코드의 스타일 차이를 설명하는 것으로 생각하면 됩니다.

## 목표 변경

다음은 2015년에 우리가 가졌던 높은 수준의 목표와 오늘날 Relay-style의 GraphQL이 해결하고자 하는 목표를 비교한 것입니다:

| **GraphQL in 2015**                                                                                                                                                                                                                | **Relay-style GraphQL**                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| - 데이터 쿼리를 위한 선언적인 언어<br>- REST보다 유연하지만, BE가 더 많이 노출됨<br>- 일부 over-fetching 방지<br>- 퍼포먼스(성능)는 ????????????<br>- schemas 및 type 안정성 (REST가 제거한)을 되찾음<br>- 더 나은 개발자 경험(DX) | - UI components가 그들의 데이터 종속성을 선언할 수 있음<br>- REST보다 더 안전하고 빠르며 locked-down<br>- 절대 과소 또는 과잉 fetch 하지 않음<br>- 가능한한 최고의 퍼포먼스<br>- 컴포넌트에 맞게 더욱 향상된 type 안정성<br>- 놀라운 개발자 경험 |

이러한 목표를 달성할 수 있는 방법에 대해 설명해 드리겠습니다. 하지만 그 전에 먼저...

## Some (Optional) History

Meta는 2012년에 GraphQL을 시작하여 2015년에 오픈소스로 공개했습니다. GraphQL 이전에는 REST가 있었고, 그 이전에는 SOAP가 있었습니다. GraphQL은 REST 백엔드보다 더 나은 무언가로 모바일 애플리케이션을 구축하고자 하는 열망에서 시작되었습니다.

2015년 이후 웹 UI 커뮤니티 내에서는 놀랍게도 교차 수분^[(역)서로 다른 꽃의 화분이 벌이나 나비에 의해 옮겨져서 새로운 수정이 일어나는 걸 뜻합니다. 전혀 다른 그룹이 만나 교류하고, 기존에 없던 결과물들을 만드는 것을 의미합니다.]이 거의 없는 두 개의 평행한 evolution 트랙이 존재했습니다:

- [Apollo](https://www.apollographql.com/ 'https://www.apollographql.com/')가 주도하는 오픈소스 커뮤니티
- 메타 / 메타의 (역시 오픈소스인) [Relay](https://relay.dev/ 'https://relay.dev/')

오픈소스 커뮤니티는 [The Guild](https://the-guild.dev/ 'https://the-guild.dev/')의 놀라운 작업과 같이 GraphQL을 개선했지만, 2016년 첫 출시 이후 Apollo를 사용하는 방식은 근본적으로 동일하게 유지되고 있습니다. 주요 발전은 더디게 진행되고 있으며(예: `useFragment` 는 아직 실험 중임), 일부 훌륭한 발전(예: [the VS Code Plugin](https://www.apollographql.com/docs/devtools/editor-plugins/ 'https://www.apollographql.com/docs/devtools/editor-plugins/'))의 채택은 저에게는 불안정적으로 보입니다.

메타가 모바일에서 GraphQL을 채택한 것은 즉각적인 성공을 거두었지만, 웹에서 수용하는 데는 오픈소스에 비해 훨씬 못 미쳤으며, 페이스북에 도입하는 데 10년이 걸렸습니다. 여러 번의 시도가 실패로 돌아갔고, 실패할 때마다 기술 스택(예: Relay)을 다시 생각하게 되었으며, 결국에는 처음 시작했을 때 및 오늘날 대부분의 업계와는 매우 다른 접근 방식으로 성공할 수 있었습니다.

Meta의 노력의 결실과 오픈 소스에서 얻은 교훈이 바로 "Relay-style GraphQL"이라고 부르는 것입니다. 모든 사람에게 Relay-style GraphQL의 모든 부분이 필요하지는 않습니다. 특히 최상의 성능과 하위호환성, 그리고 그에 수반되는 모든 인프라와 도구의 복잡성이 필요하지는 않을 것입니다. 하지만 대부분의 다른 발전은 모든 애플리케이션과 매우 밀접한 관련이 있습니다.

## Relay-style GraphQL의 주요 특징

Relay-style GraphQL은 많은 프레임워크 기능, 모범 사례 및 다른 사고방식을 결합한 접근 방식입니다. 그중 몇 가지를 강조하고 싶습니다:

### Fragment Collocation

Fragment collocation은 GraphQL fragment를 다른 별도의 파일이 아닌 컴포넌트 안에 직접 선언하는 것을 의미합니다. 부모 컴포넌트는 자식 컴포넌트의 fragment들을 그들의 fragment에 spread해서 자식 컴포넌트를 렌더링합니다.

Apollo는 더 낮은 형태의 [collocated fragments](https://www.apollographql.com/blog/graphql/fragments/using-graphql-fragments-for-safer-cleaner-and-faster-code/ 'https://www.apollographql.com/blog/graphql/fragments/using-graphql-fragments-for-safer-cleaner-and-faster-code/') 를 지원하며 [더 나은 collocated fragments](https://www.apollographql.com/docs/react/api/react/hooks-experimental/#usefragment 'https://www.apollographql.com/docs/react/api/react/hooks-experimental/#usefragment') 는 아직 베타입니다.

collocation of fragments를 잘 사용하는 두 가지 **중요한** 원칙은 다음과 같습니다:

1. 컴포넌트는 절대 GraphQL 출처의 data를 props를 통해 받아선 안됩니다: 컴포넌트의 fragment(s)에서 선언한 데이터에만 접근 가능해야 합니다.
2. 컴포넌트는 절대 fragments를 공유해선 안됩니다. Relay는 fragment의 이름이 컴포넌트 이름으로 시작하도록 강제합니다.

#### An example Relay component

```tsx
//issueSummary.tsx

function IssueSummary(props: { issue: IssueSummaryFragment$key }) {
  const issue = useFragment(
    graphql`
      fragment IssueSummaryFragment on Issue {
        title
        body
      }
    `,
    props.issue
  );

  return (
    <li>
      <h1>{issue.title}</h1>
      <div>{issue.body}</div>
    </li>
  );
}
```

부모 컴포넌트는 자신의 fragment에서 이 fragment를 spread하고 자식 컴포넌트를 렌더링합니다:

```tsx
// issues.tsx
function Issues(props: { repository: IssuesFragment$key | null }) {
  const data = useFragment(
    graphql`
      fragment IssuesFragment on Repository {
        issues(first: 1) {
          nodes {
            __id
            ...IssueSummaryFragment
        }
      }
    `,
    props.repository
  );

  return (
    <ul className={styles.issues}>
      {data?.issues.nodes?.map((issue) => {
        if (issue == null) {
          return null;
        }
        return <IssueSummary key={issue.__id} issue={issue} />;
      })}
    </ul>
  );
}
```

최상위 컴포넌트는 쿼리를 생성하고 (직접적으로 또는 경유적으로) 모든 하위 컴포넌트의 모든 fragment을 spread합니다:

```tsx
// mainView.tsx
function MainView(props: { queryRef: PreloadedQuery<MainViewQuery> }) {
  const data = usePreloadedQuery(
    graphql`
      query MainViewQuery($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          owner {
            login
          }
          name
          ...IssuesFragment
        }
      }
    `,
    props.queryRef
  );

  // ...
}
```

결과는 다음과 같이 이 최상위 쿼리를 `MainViewQuery.graphql`  파일에 수동으로 작성했을 때와 동일합니다:

```graphql
# MainViewQuery.graphql
query MainViewQuery($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    owner {
      login
    }
    name
    issues(first: 1) {
      edges {
        __id
        node {
          title
          number
          author {
            login
          }
        }
      }
    }
  }
}
```

그러나 이 쿼리를 직접 작성하는 대신 Relay-style GraphQL 라이브러리를 사용하면 collocated fragment를 동일한 쿼리로 컴파일할 수 있으므로 많은 이점을 얻을 수 있습니다:

#### 이점 #1: over-fetching 방지

Relay-style의 GraphQL 코드는 필요하지 않은 데이터를 가져오는 일이 없기 때문에 데이터 효율성이 완벽합니다.

REST API는 이론적으로는 UI에 필요한 데이터를 정확히 가져오거나 요청된 데이터를 필터링하는 유연한 query parameters를 사용할 수 있지만^[For example, here is [Shopify’s order retrieval API](https://shopify.dev/docs/api/admin-rest/2023-07/resources/order#get-orders?status=any 'https://shopify.dev/docs/api/admin-rest/2023-07/resources/order#get-orders?status=any'). They went to pains to add a `fields` parameter so you can specify a comma-delimited list of fields to fetch. But, some of the fields, like `client_details`, have fields nested below it. You can’t filter those. So even when a REST API goes out of its way to add some level of filtering, it still isn’t going to make it possible to arbitrarily filter perfectly, because then the API’s ergonomics increasingly suffer (and at some point you’re just reinventing an ad-hoc GraphQL endpoint). Back when REST APIs were all that there was, in my experience internal/private REST APIs rarely even had a “fields” parameter and over-fetching was extremely prevalent.], 실제로는 UI에서 여러 use-case를 위해 오버페칭을 수행해야 합니다. Data Pruning^[(역)얻고자 하는 데이터를 가지고 있지 않은 파일들을 읽지 않고 스킵하는 형태의 최적화]은 해결할 수 있지만 종종 무시되는 문제이기 때문에 REST API에서 제공하는 데이터는 일반적으로 UI에서 실제로 필요한 데이터보다 항상 상위 집합(superset)에 속합니다.

GraphQL은 UI 작성자가 항상 필요한 데이터를 정확히 요청할 수 있도록하여 이론적으로 항상 완벽한 data-fetching 효율성을 달성하고 over-fetching을 방지함으로써 이 문제를 개선했습니다.

문제는 여러 컴포넌트에서 GraphQL query들과 fragment들을 공유할 때 발생합니다: 정적 분석으로는 `.graphql`파일 안의 어떤 필드가 사용되지 않았는지 알 수 없으므로 안전하게 제거할 수 없습니다^[*Static* analysis has a hard time with this because GraphQL has abstract types for many fields, and those references could theoretically be tracked across your codebase, but the leaf fields are always primitive types (like `string` and `number`) and tracking references to primitive values across an entire codebase, across all code boundaries, is not a problem anyone has solved (to my knowledge). That said, *runtime* analysis using JS `Proxy` can be used to detect what fields go unused with some level of accuracy. [Reddit Engineering wrote about it here](https://www.reddit.com/r/RedditEng/comments/x0rasj/identifying_unused_fields_in_graphql/ 'https://www.reddit.com/r/RedditEng/comments/x0rasj/identifying_unused_fields_in_graphql/'). Runtime analysis is better than nothing, but strictly worse than just getting it exactly right at compile time.].

Relay-style Fragment collocation 은 이러한 문제를 해결합니다: 컴포넌트의 Fragment에서 필드를 제거하거나 컴포넌트만 제거하고 다른 컴포넌트에서 해당 필드를 참조하지 않는 경우, 별도로 해줄 일 없이 쿼리에서 해당 필드가 제거됩니다.

Relay는 이 모든 작업을 용이하게 하는 도구를 구현합니다:

- **Data Masking**: 컴포넌트는 fragment에 선언한 내용만 볼 수 있습니다. 컴포넌트는 props를 통해 key를 받지만 이 key는 `useFragment` 와 같은 것을 통해 전달되기 전까지는 사용할 수 없으며 `useFragment` 가 반환하는 데이터는 컴포넌트의 fragment에서 정의된 데이터만 포함됩니다.
- **Lint rules:** bad data fetching/passing practices를 초래할 수 있는 모든 행위를 방지합니다. 예: 자식 컴포넌트에게 전달하기만 하는 필드를 fragment를 추가한다거나, 직접 사용하지 않는 fragment를 spread하는 행위 등등.
- **TypeScript typing:** fragment를 spread하지 않고 컴포넌트를 렌더링하는 것을 방지합니다.
- Etc.

#### 이점 #2: under-fetching 방지

Relay-style의 GraphQL 코드에는 쿼리되지 않은 데이터를 컴포넌트가 필요로 하는 버그가 없습니다.

fragment collocation이 없으면 의존하는 데이터를 *항상* 가져오지 않는 React 컴포넌트를 작성할 수 있습니다.

예를 들어, `firstName` , `lastName`  필드가 있는 `User` 객체가 필요한 컴포넌트가 있다고 가정해 봅시다. 컴포넌트는 이 필드가 nullable임을 알고 있고 적절한 `null` 검사를 수행하지만, 컴포넌트를 사용하는 모든 쿼리에 두 필드가 모두 포함된다고 보장할 수는 없습니다. 이로 인해 런타임에 컴포넌트가 예기치 않게 `null`을 반환하는 버그가 발생할 수 있습니다. UI는 이 오류 사례를 거의 기록하지 않습니다.

fragment collocation을 사용하면 쿼리하지않고 컴포넌트를 렌더링할 수 없기 때문에 컴포넌트에 필요한 모든 데이터가 항상 쿼리된다는 것을 보장할 수 있습니다. 필드가 여전히 `null`이 될 수 있긴 하지만 그건 GraphQL 코드의 버그 때문이 아닙니다.

#### 이점 #3: 컴포넌트를 더 쉽게 추론할 수 있습니다.

collocated fragments이 위에서 말했던 첫 번째 원칙(아래 인용구)을 준수하는 경우:

> “컴포넌트는 절대 GraphQL 출처의 data를 props를 통해 받아선 안됩니다: 컴포넌트의 fragment(s)에서 선언한 데이터에만 접근 가능해야 합니다.”

추론하기가 훨씬 쉬워집니다. 이것은 제가 개인적으로 가장 좋아하는 collocated fragments의 이점이며, Relay-style GraphQL의 이점이기도 합니다.

예를 들어, prop에서 GraphQL 데이터를 가져오는 React 컴포넌트를 생각해 봅시다:

```tsx
// issueTitle-legacy.tsx
function IssueTitle(props: { issue: { title: string | null } }) {
  return <li>{props.issue.title}</li>;
}
```

이 컴포넌트는 매우 간단해 보이지만 컴포넌트를 렌더링하기 위해 `title`의 출처에 대한 정보가 필요한 경우 다른 곳에서 검색해야 합니다. 혹은 렌더링시 또 다른 필드를 사용하고 싶으신가요? prop에 추가한 다음 데이터의 출처를 찾아서 그곳에 필드를 추가해야 합니다.

collocated fragment를 사용하는 GraphQL component와 비교해 보세요:

```tsx
// issueTitle.tsx
function IssueTitle(props: { issue: IssueTitleFragment$key }) {
  const issue = useFragment(
    graphql`
      fragment IssueTitleFragment on Issue {
        title
      }
    `,
    props.issue
  );
  return <p>{issue.title}</p>;
}
```

이 코드에서  `title` 은 `Issue` type의 필드임을 쉽게 알 수 있습니다.

이것에 대한 schema documentation를 보고싶으신가요? 마우스를 필드 위에 올리기만 하면 됩니다:

![](https://github.com/emewjin/emewjin.github.io/assets/76927618/7903d18a-b420-4956-a07a-14645cdcb3ae)

schema로 이동하고 연관된 필드들을 보고 싶으신가요? 필드를 Cmd-click 하세요.

다른 필드를 렌더링할 때 쓰고싶으신가요? 이 컴포넌트의 fragment에 추가하기만 하세요.

#### 이점 #4: 향상된 타입스크립트 types

collocated fragments이 위에서 말한 두 번째 원칙을 준수하는 경우:

> “컴포넌트는 절대로 fragments를 공유해서는 안 됩니다.”

훨씬 나은 타입스크립트 typing 이점을 누릴 수 있습니다.

GraphQL 데이터의 TypeScript typing이 좋지 않은 코드베이스에서 작업할 가능성이 있죠. 이런 일이 발생할 수 있는 케이스는 여러 가지가 있습니다. 예를 들어:

- 컴포넌트 prop의 정의에서 타입이 확장되는 경우. 예를 들어, GraphQL type은 string literal들의 union일 수 있지만 컴포넌트 prop은 이를 `string` 으로 확장합니다.
- GraphQL 데이터는 모든 GraphQL 타입을 유지하지 않는 변환 작업을 거치게 되며, 유지되는 type은 쿼리에 따라 특정 유형에서 degrade됩니다. 예를 들어, 한 필드에 대해 쿼리했지만 사용하게 되는 type은 abstract GraphQL type (쿼리하지 않았음에도 불구하고 모든 필드를 포함하고 모두 nullable한)입니다. 이 경우 사용하는 IDE의 자동 완성 기능은 잠재적으로 모든 필드에 액세스할 수 있다고 생각하므로 문제가 발생할 수 있습니다.
- Field type들은 엄격하지 않은 타이핑과 바닐라 자바스크립트를 통해 손실됩니다.

엄격하지 않고 엄격한 타입스크립트가 없는 코드베이스일지라도 Relay-style 컴포넌트에서의 GraphQL의 타입은 항상 완벽합니다. 왜냐하면 컴포넌트는 fragment를 기반으로 하는 자체 자동 생성된 커스텀 type을 가져오기 때문입니다. 나머지 코드베이스는 중요하지 않습니다. 그리고 props로 GraphQL 데이터를 전달하지 않기 때문에 유형이 절대 degrade되지 않습니다.

fragment에 필드가 없으면 다른 컴포넌트가 해당 필드를 쿼리하는지 여부에 관계없이 TypeScript type에 해당 필드가 없습니다. TypeScript type은 컴포넌트를 완벽하게 나타냅니다.

각 fragment에 대해 커스텀 TypeScript type을 사용하면 나중에 설명할 [다른 개발자 경험의 이점](#required-fields)도 얻을 수 있습니다.

#### 이점 #5: 컴포넌트의 데이터만 손쉽게 다시 가져오기

GraphQL을 fragment로 분리하면 전체 쿼리 대신 컴포넌트에 필요한 데이터만 쉽게 다시 re-fetch할 수 있도록 설정할 수도 있습니다. 예를 들어 Relay를 사용하면, 호출 시 fragment에 있는 데이터만 쿼리를 전송하는 함수를 자동으로 생성하는 re-fetchable fragment로 [간단하게 업그레이드](https://relay.dev/docs/guided-tour/refetching/refreshing-fragments/#using-userefetchablefragment 'https://relay.dev/docs/guided-tour/refetching/refreshing-fragments/#using-userefetchablefragment')할 수 있습니다.

collocated fragments이 없으면 두 가지 선택지가 있습니다.

- 전체 쿼리를 다시 요청하거나
- 원하는 데이터만 다시 가져오는 함수를 수동으로 작성하고 새로 가져온 데이터를 반영하도록 로컬 캐시를 수동으로 변경합니다.

보너스: graph의 item에 전역적으로 고유한 ID를 사용하면 하나의 컴포넌트에 대해서만 데이터를 다시 가져와도 UI에서 데이터 불일치가 발생하지 않습니다. 자동 생성된 re-fetch 함수에 두 개의 다른 컴포넌트에서 렌더링되는 항목에 대한 데이터가 있는 경우, UI는 두 곳 모두에서 새로운 데이터를 사용합니다(Relay의 정규화된 저장소^[Relay’s cache is [a normalized, in-memory object graph](https://relay.dev/docs/principles-and-architecture/runtime-architecture/#data-model 'https://relay.dev/docs/principles-and-architecture/runtime-architecture/#data-model').]를 사용합니다).

#### 이점 #6: 컴포넌트가 컨텍스트에 따라 다른 데이터를 가져올 수 있습니다.

##### 실제 문제점 사례

데이터를 두 단계에서 렌더링하는 컴포넌트가 있습니다: 미리 볼 때 한 번, 저장한 후에 한 번.

미리 보기 단계에서, 동일한 type을 가지고 있음에도 불구하고 백엔드에서 모든 필드를 사용할 수 있는 것은 아닙니다. `id` 필드가 그러합니다. 이 때문에 스키마에서 다르게 모델링 되었어야 하지만, 이 문제는 잠시 접어두겠습니다.

미리 보기 단계에서 사용할 수 없는 필드에 `@skip` 조건을 추가하여 이 문제를 해결했지만, `@skip` 변수를 넣을 수 있는 유일한 위치는 default parameter가 있는 query variable뿐입니다. 결국 다음과 같이 작성되었습니다:

```graphql
# garbage.graphql
query PreviewItemQuery($isForPreview: Boolean = true) {
  ...ItemFragment
}

query SavedItemQuery($isForPreview: Boolean = false) {
  ...ItemFragment
}

fragment ItemFragment on Item {
  id @skip(if: $isForPreview)
}
```

query variables는 전역 변수로 어떻게 사용될 것인지와 뚜렷한 연관성이 없기 때문에 이렇게 작성하는 것은 좋지 않습니다. 또한 실제 query variable도 아닙니다: 이것은 앞으로도 쭉 쿼리에 전달되지 않을 것이며 오직 기본 상태로만 사용하고 있습니다.

또한 이것은 오류를 발생시킬 여지가 되기도 합니다. 왜냐하면 이 query variable를 사용하는 fragment를 일시적으로 포함하지 않는 쿼리에 이 query variable를 추가하는 것은 **_런타임 에러_**이기 때문입니다^[My GraphQL server rejects queries with unused query variables. ]. 컴파일 시간 동안에는 아무 반응도 없었습니다. GraphQL 프레임워크가 컴파일할 수 있도록 허용하는 것과 GraphQL 서버가 유효한 쿼리로 간주하는 것 사이의 임피던스 불일치(Impedance mismatch)로 인해 **프로덕션 환경에서 오류가 발생했습니다.**

<br>

##### The Solution

어떻게 해야 할까요? 우선, 위의 문제를 컴파일러 오류로 처리할 수 있는 충분한 정적 분석을 수행하는 GraphQL 프레임워크를 사용하세요. 더 좋은 방법은 fragment arguments를 사용하는 것입니다! fragment arguments는 기본적으로 GraphQL fragment에 대한 함수 argument입니다. 다음은 Relay에서의 [fragment argument definition](https://relay.dev/docs/api-reference/graphql-and-directives/#argumentdefinitions 'https://relay.dev/docs/api-reference/graphql-and-directives/#argumentdefinitions')입니다:

```tsx
// previewItem.tsx
function PreviewItem(props: { item: PreviewItemFragment$key }) {
  const item = useFragment(
    graphql`
      fragment PreviewItemFragment on Item
      @argumentDefinitions(isForPreview: { type: "Boolean!" }) {
        id @skip(if: $isForPreview)
        title
      }
    `,
    props.item
  );

  // ...
}
```

그러면 컴파일 타임에 이 argument가 모든 spread된 fragment에 전달되도록 강제합니다:

```tsx
// preview.tsx
...PreviewItemFragment @arguments(isForPreview: true)
```

또한 fragment를 정의, 사용, 호출할 때 인자가 collocated fragment 와 동일한 위치에 있으므로 해당 argument가 왜 존재하는지, 어떻게 사용되는지 추측할 필요가 없습니다.

#### 이점 #7: Better GraphQL APIs

Collocated fragments를 사용하면 UI component에 맞게 구성된 간단한 GraphQL API를 구축할 수 있습니다. 이를 통해 데이터 복잡성을 데이터의 원래 위치인 백엔드로 옮길 수 있습니다.

#### 이점 #8: 요약

**단 한 가지만 흡수한다면, 이 점만 기억하세요:** 손으로 작성한 GraphQL 쿼리 (fragment로 나누든 아니든)를 React 컴포넌트와 collocated된 GraphQL fragment로 전환하는 것은 즉시 사용자를 만족시킬 수 있고 다시는 이전 방식으로 돌아갈 수 없게 만들 많은 downstream 이점^[(역)초기단계에서의 노력이 나중에 긍정적인 영향을 미칠 수 있다는 의미]을 가지고 있습니다.

### Data Fetching

Relay-style GraphQL 을 사용하면 매우 우수한 data-fetching 성능을 쉽게 확보할 수 있으며 동시에 높은 노력을 들인 가능한한 최상의 성능을 구현할 수 있습니다.

#### Easy, pretty-good performance

이것이 기본 설정입니다. 추가 노력 없이 초기 설정만으로 모든 GraphQL fragment들은 쿼리로 컴파일되고 배치 처리됩니다. 페이지 로드시 리액트 컴포넌트가 렌더링을 시작한 후 1개의 GraphQL 쿼리를 수행하도록 하게 하기 위해 page 또는 route당 1개의 **GraphQL 네트워크 요청을 가져야 합니다.**

이는 이미 평균적인 Apollo 앱보다 나은 수준이며 아마도 이것으로 충분할 것입니다:

- Enterprise/internal 애플리케이션
- 성능이 최고가 아니더라도 이탈하고 싶지 않아하는 고정 유저가 있는 애플리케이션
- 페이지 로딩 시간을 약간이라도 단축시키는 것이 개발자가 쓰는 비용보다 가치가 없는 애플리케이션
- 더 나은 기기와 인터넷 속도를 쓰는 유저가 있는 애플리케이션
- 대부분의 유저가 desktop 유저인 애플리케이션
- Etc.

#### Medium-effort, better performance

성능 향상을 위한 다음 단계는 data fetching을 React rendering과 디커플링 시키는 것입니다. React팀은 fetch-on-render 대신 [render-as-you-fetch](https://legacy.reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html#render-as-you-fetch 'https://legacy.reactjs.org/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html#render-as-you-fetch') 를 지지하며, 이는 Relay-style GraphQL이 지원합니다 ([compiled, persisted queries](https://alan.norbauer.com/articles/relay-style-graphql#persisted-queries 'https://alan.norbauer.com/articles/relay-style-graphql#persisted-queries') 그리고 [query preloading](https://relay.dev/docs/api-reference/use-preloaded-query 'https://relay.dev/docs/api-reference/use-preloaded-query') 와 같은 기능을 통해서요).

유저가 URL 바에서 엔터 키를 누르면, 서버는 초기 HTML 문서를 전송하는 동시에 데이터를 fetching하고 스트리밍하기 시작해야 합니다. 유저가 lazy-load되는 콘텐츠가 있는 모달을 열기 위해 버튼을 클릭하면, 서버는 버튼이 클릭된 즉시 모달의 데이터를 가져와야 합니다 (JS 코드로 모달을 구동시키는 것과 병렬로). **이 모델에서 page/route 당 클라이언트에서의 GraphQL 네트워크 요청은 0개이며, 사용자 상호작용으로 인해 더 많은 데이터가 필요한 경우마다 1개의 네트워크 요청이 발생합니다.**

이 방식은 대부분의 애플리케이션에서 충분하며 특히 다음의 경우 유용합니다.

- high-latency 모바일 연결을 사용하는 유저가 있는 애플리케이션
- 성능 향상을 위해 더 많은 개발자 노력을 투자할 가치가 있는 애플리케이션
- Etc.

#### High-effort, best-possible performance

점점 더 큰 GraphQL chunk를 단일 쿼리로 batch한 후, 불균형적으로 느린 field resolver들이 전체 데이터 fetching을 지연시키는 문제를 만날 수도 있습니다. Relay는 `@defer` 와 `@stream` directive를 제공하여 개별 필드를 제어할 수 있게 함으로써 이 문제를 해결합니다.

또, GraphQL에 의해 발생한 문제는 아니지만 GraphQL로 해결할 수 있는 틈새 문제도 있습니다.  
예를들어, 사람들이 다양한 글을 작성할 수 있는 포럼이 있고, 그 다양한 글들은 단 하나의 리액트 컴포넌트로만 렌더링 된다고 해봅시다. 시간이 지남에 따라 1,000 종류의 글이 누적되어 번들 크기가 엄청나게 커졌다고 가정해봅시다.  
글들의 98%는 다섯 개의 컴포넌트로 렌더링 할 수 있지만, 컴포넌트의 long tail^[(역)상대적으로 적은 인기를 누리는 다양한 항목들의 집합]은 모두 소량만 사용됨을 관찰 할 수 있었습니다.

어떻게 해야 할까요?  
한 가지 해결책은 클라이언트 렌더링을 중단하고 non-interactive하게 만드는 것입니다.  
다른 방법도 있습니다: Relay의 [Data-Driven Dependencies (3D)](https://relay.dev/docs/glossary/#3d 'https://relay.dev/docs/glossary/#3d')을 사용하면 서버에서 반환하려는 GraphQL 데이터를 기반으로 클라이언트로 전송할 JS를 결정할 수 있습니다.  
따라서 가장 많이 사용되는 5개의 컴포넌트를 기본 번들에 포함시켜 항상 준비하고, 추가로 전송하려는 GraphQL 응답에서 게시물을 렌더링하는 데 필요한 React 컴포넌트만 전송할 수 있습니다.

이런 문제는 일반적이진 않지만 Relay-style GraphQL 프레임워크는 _필요하다면_ 이런 수준의 제어도 가능합니다.

이것은 대부분의 모든 애플리케이션에서 충분합니다:

- 수십억 명의 유저를 보유한 애플리케이션으로, 밀리초를 절약하는 것이 엄청난 개발 가치가 있는 애플리케이션
- 개발자가 시간을 효율적으로 사용하기보다 언제나 가장 빠른 옵션을 구현하려고 하는 애플리케이션

### Persisted Queries

GraphQL API는 UI 개발자가 클라이언트에서 필요한 것을 직접 쿼리할 수 있는 기능을 제공하지만 여기에는 두 가지 문제가 있습니다:

1.  클라이언트에 대량의 query document를 보내면 클라이언트가 이걸 다시 서버로 보내야 할 가능성이 있습니다. 이것은 bandwidth 낭비입니다.
2.  모든 클라이언트로부터 임의의 복잡한 쿼리를 수락하면 서비스 품질과 효율성에 악영향을 미칠 수 있으며 잠재적으로 보안 위험^[By locking down your API to exactly what your UI needs you’re engaging in “defense in depth” security. This shouldn’t be your main mechanism for hiding sensitive/private data that you don’t want clients to see, but not letting users make arbitrary queries against your backend is a reasonable security precaution.]이 발생할 수 있습니다. 개발자들이 이 문제를 해결하는 한 가지 방법은 쿼리 복잡도를 계산한 다음 API 속도를 제한하는 것입니다. 이러한 접근 방식은 특정 상황에서만 의미가 있습니다.

이 두 가지 문제에 대한 한 가지 해결 방법은 [persisted queries](https://relay.dev/docs/guides/persisted-queries/#the-persistconfig-option 'https://relay.dev/docs/guides/persisted-queries/#the-persistconfig-option')를 사용하는 것입니다.

persisted query란 컴파일된 쿼리를 백엔드가 액세스 할 수 있는 곳에 지속시키고(persisting) 고유 ID를 할당하여 해당 고유 ID만 클라이언트에 전송하는 것을 의미합니다. 그러면 JS 애플리케이션은 쿼리를 실행할 때 해당 고유 ID와 함께 쿼리 변수를 GraphQL 서버로 전송하기만 하면 됩니다. 이렇게 하면 bandwidth 낭비를 없애고 쿼리를 UI 개발자가 작성한 쿼리로 제한하여 임의의 누군가가 JS 콘솔에서 쿼리를 보내지 못하게 할 수 있습니다.

### React Suspense Support

Relay는 React Suspense를 완벽하게 지원합니다. 대부분의 GraphQL 라이브러리들은 최소한 experimental mode에서 이를 지원하며, React 팀은 Suspense가 [“opinionated data fetching frameworks.”](https://react.dev/reference/react/Suspense 'https://react.dev/reference/react/Suspense')에 대해 안정적이라고 선언했습니다. 컴포넌트 가독성과 오류가 발생하기 쉬운 로딩 로직 제거에 대한 이점은 지금 바로 Suspense를 사용할 충분한 이유입니다.

### Developer Experience

Relay-style GraphQL에는 수많은 DX 이점이 있지만 저는 그중에서도 두 가지를 강조하고 싶습니다:

#### @required fields

GraphQL을 사용하면 스키마 수준에서 non-nullable 필드를 정의할 수 있지만, 복원력과 이전 버전과의 호환성 문제를 일으키지 않도록 그렇게 하지 말아야 한다는 것은 [잘 알려져 있습니다.](https://graphql.org/learn/best-practices/#nullability 'https://graphql.org/learn/best-practices/#nullability') 스키마에서 non-nullable 필드를 사용하기 위해서는 엄청나게 높은 기준이 있습니다.

하지만 _컴포넌트_ 내부의 기준은 그다지 높지 않습니다. 컴포넌트를 작성할 때 "이 필드가 없으면 아무것도 렌더링하지 않는 것이 낫다"고 말하는 것이 합리적입니다. Relay에는 이와 같은 코드를 대체할 수 있는 `@required` directive가 있습니다:

```tsx
// issueSummary.tsx
function IssueSummary(props: { issue: IssueSummaryFragment$key }) {
  const issue = useFragment(
    graphql`
      fragment IssueSummaryFragment on Issue {
        title
        body
        closed
        createdAt
      }
    `,
    props.issue
  );

  if (
    issue.title == null ||
    issue.body == null ||
    issue.closed == null ||
    issue.createdAt == null
  ) {
    return null;
  }

  return (
    <li>
      <h1>{issue.title}</h1>
      <p>{issue.body}</p>
      <p>{issue.closed}</p>
      <p>{issue.createdAt}</p>
    </li>
  );
}
```

위 코드는 아래처럼 수정할 수 있습니다:

```tsx
// issueSummary.tsx
function IssueSummary(props: { issue: IssueSummaryFragment$key }) {
  const issue = useFragment(
    graphql`
      fragment IssueSummaryFragment on Issue {
        title @required(action: LOG)
        body @required(action: LOG)
        closed @required(action: LOG)
        createdAt @required(action: LOG)
      }
    `,
    props.issue
  );

  if (issue == null) {
    return null;
  }

  return (
    <li>
      <h1>{issue.title}</h1>
      <p>{issue.body}</p>
      <p>{issue.closed}</p>
      <p>{issue.createdAt}</p>
    </li>
  );
}
```

이 변화가 그닥 많은 타이핑을 아끼지 않았을 수도 있지만… :

- 더 이상 두 개의 필드 목록을 동기화 하지 않아도 됩니다.
- 원하는 TypeScript type이 바로 구성됩니다: 전체 issue가 null이거나 모든 필드가 non-nullable인 경우
- Relay version은 필드가 예상치 못하게 `null`인 경우 왼쪽의 코드가 자동으로 무시하는 대신 원격 분석 엔드포인트에 로그를 기록합니다.
- `@required` 는 필드가 `null`인 경우 예외를 던지는 것과 같은 다른 동작을 지원합니다. 이러한 예외는 구조화된 데이터와 함께 단일 병목 지점(single choke point)에서 발생하며, 재발 방지를 위한 모니터링 설정에 도움이 됩니다. 이는 ad-hoc(임시적) 에러 로깅 방식으로 얻을 수 없는, 더 효율적인 오류 처리 방식을 제공합니다.
- `@required`를 사용하여 `null` 필드를 컴포넌트 계층 구조를 통해 상위로 전파할 수 있으며 이는 단순히 `null` 을 반환하는 것과는 다른 방식으로 동작합니다.
- Etc.

#### Language Server Protocol / VS Code Extension

GraphQL을 컴포넌트로 이동하면 언어-서버 프로토콜의 이점을 컴포넌트에 더 가깝게 가져올 수 있습니다. 컴포넌트에서 스키마 문서를 바로 가져오는 방법은 위를 참조하세요.

### And more!

아직 다 말하지 못한 수많은 것들이 있습니다. 예를 들면 [declarative mutation directives](https://relay.dev/docs/guided-tour/updating-data/graphql-mutations/#declarative-mutation-directives 'https://relay.dev/docs/guided-tour/updating-data/graphql-mutations/#declarative-mutation-directives'), [type-safe 낙관적 응답](https://relay.dev/docs/guided-tour/updating-data/graphql-mutations/#optimistic-response 'https://relay.dev/docs/guided-tour/updating-data/graphql-mutations/#optimistic-response'), [GraphQL 서버와 UI 사이 더 밀접한 통합](https://relay.dev/docs/guides/graphql-server-specification/ 'https://relay.dev/docs/guides/graphql-server-specification/')의 이점, [Relay Resolvers](https://relay.dev/docs/guides/relay-resolvers/ 'https://relay.dev/docs/guides/relay-resolvers/'), Relay의 정규화된 스토어(store)는 응답 캐시보다 더 나은 memory footprint와 더 나은 garbage collection을 제공하며, 내장된 [pagination implementation](https://relay.dev/docs/guided-tour/list-data/pagination/ 'https://relay.dev/docs/guided-tour/list-data/pagination/'), 데이터 업데이트 시 더 빠르고 효율적인 React 렌더링 등입니다. 목록은 계속 늘어날 것입니다.

## What’s Not Great

이쯤에서 Relay-style GraphQL이 React 애플리케이션에서 GraphQL API를 사용하는 데 있어 근본적으로 더 나은 접근 방식이라는 점을 이해하셨기를 바랍니다. 이 스타일(또는 Relay 자체)의 단점이 있는지 궁금하다면, 몇 가지를 알려드리겠습니다:

1.  npm에서 Apollo는 Relay보다 [19배 더 많이 다운로드 됩니다.](https://npmtrends.com/@apollo/client-vs-react-relay 'https://npmtrends.com/@apollo/client-vs-react-relay'):

    ![](https://github.com/emewjin/emewjin.github.io/assets/76927618/d99ad946-bba1-4eda-9159-5b4915022140)

    만약 엔지니어링 조직이 주니어에 치우쳐 있고 Relay보다 Apollo에 대한 글이 얼마나 더 많은지가 중요하다면 Apollo를 고수해야 할 수도 있습니다. 아니면 위험을 싫어하고 다른 사람들이 많이 사용하는 제품을 더 좋아할 수도 있습니다. 또는 인터넷 블로그 게시물에서 추천하는 제품 대신 다른 사람들이 사용하는 제품을 사용하는 것에 위안을 삼을 수도 있습니다. 그것도 아니면 그냥 큰 막대기를 좋아하실 수도 있습니다.

2.  Relay-style GraphQL은 컴파일러 단계가 필요합니다. 예를들어 Relay는 컴파일러^[Don’t worry, Relay’s compiler [is written in Rust](https://relay.dev/blog/2021/12/08/introducing-the-new-relay-compiler/ 'https://relay.dev/blog/2021/12/08/introducing-the-new-relay-compiler/').]가 있는데 개발할 때 watch mode에서 실행되고 있도록 해야 합니다.
3.  Relay의 문서는 꽤 훌륭하지만 완벽하지는 않습니다. 특히 메타만 사용하는 고급 기능으로 갈수록 문서화가 심하게 부족한 영역이 있습니다.
4.  Relay는 GraphQL 서버와 통합될 때 가장 잘 동작합니다. 이를 [GraphQL Server Specification](https://relay.dev/docs/guides/graphql-server-specification/ 'https://relay.dev/docs/guides/graphql-server-specification/') 이라고 하며 이 명세는 전역적으로 고유한 ID 사용, `@connection` directive 지원, 그리고 `Node` 인터페이스 제공 등을 설명합니다. 이는 좋은 기능이며 사용자의 편의를 높여주지만, 일부 조직에서는 UI 엔지니어가 GraphQL 서버 구현을 거의 제어할 수 없기 때문에 Relay의 잠재력을 최대한 발휘할 수 없을지도 모릅니다.

## FAQ

### Q: Why do I need Relay-style GraphQL if …

… 이미 Apollo와 함께 collocated fragments 를 사용하고 있고, 컴포넌트 간에 fragments를 공유하지 않으며, graphql-code-generator를 사용하여 모든 fragment에 대해 type을 생성하고, 생성된 fragment type을 사용하여 모든 input props를 입력하고 있는데도 Relay-style GraphQL이 필요할까요?

**A:** (1) 제가 현실 세계에서 본 적이 없는 방식으로 Apollo를 사용하고 계십니다. 아주 훌륭하게 들리며, 기본적으로 Relay-style GraphQL의 몇 가지 훌륭한 사례들을 직접 개발한 것에 대해 스스로 자랑스러워해야 합니다. (2) Apollo는 이 중 어떤 것도 쉽게 적용할 수 없습니다. 이 패턴을 고수하도록 설정할 수 있는 config나 린트 규칙이 없습니다. Relay를 사용하면 이 스타일에 대한 모든 것이 정적으로 적용됩니다.

### Q: Will Relay fall apart …

… Relay가 복잡한 실제 애플리케이션에서 문제를 발생시키진 않을까요? 예제들은 단순해보입니다.

**A:** 아뇨.

### Q: How do you unit test …

… Relay components에 대한 단위 테스트는 어떻게 작성하나요?

**A:** 저는 end-to-end 테스트에 매우 매우 의존하는 코드베이스(그리고 UI 컴포넌트가 아닌 것에만 단위 테스트)에 대해서만 작업했습니다. 하지만 관심이 있으시다면 [여기에 많은 내용이 있습니다.](https://relay.dev/docs/guides/testing-relay-components/ 'https://relay.dev/docs/guides/testing-relay-components/') 이걸 읽으면 어떻게 해야할지 알 수 있을 거예요!

### Q: Do collocated fragments ever result in conflicts …

… 동일한 root field를 쿼리하지만 다른 argument를 사용하는 경우와 같이, 동일한 데이터를 한 컴포넌트와 다른 컴포넌트에서 어떻게 쿼리하는지에 대해서 충돌이 발생할까요? 모든 컴포넌트에서 필드를 수동으로 aliasing 해야할까요?

**A:** 아뇨, Relay가 대신 해줍니다. 서로 다른 두 fragment에서 동일한 필드에 서로 다른 argument를 전달하면 수동으로 aliasing할 필요 없이 각각 올바른 데이터(각 argument를 반영한)를 가져옵니다.

### Q: Will Relay take away control I have over …

… 쿼리 캐시 사용 여부와 방법에 대한 통제권을 빼앗길까요?

**A:** 아니요, Relay의 `fetchPolicy`를 사용하면 네트워크 동작을 상당히 잘 제어할 수 있습니다. 그렇긴 하지만 fragment 단위로 제어할 수는 없으므로(그게 무슨 의미가 있겠습니까^[It might be neat if `useRefetchableFragment` took a `refetchPolicy` argument. Maybe? ]), 필요한 경우 컴포넌트를 lazy 로드되는 컴포넌트로 분리해야 합니다(`useLazyLoadQuery`가 이를 가능하게 합니다).
