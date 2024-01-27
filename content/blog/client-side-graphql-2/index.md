---
title: Client side GraphQL로 어드민 만들기 2부 - 어떻게 개발했는가
description: 완전하진 않지만 Relay-style을 지향하며 GraphQL로 레거시 API와 함께 새 프론트엔드를 개발한 경험에 대해 기억을 더듬어봤습니다.
date: 2024-01-27
lastUpdated: 2024-01-27
tags: [React, GraphQL]
---

[지난 1부](https://emewjin.github.io/client-side-graphql/)에서는 프론트엔드에서 어드민 페이지를 리액트 앱으로 마이그레이션 할 때 왜 Client Side GraphQL을 선택했고, 환경을 어떻게 구축했는지에 대해 소개했었다.

2부인 이번 글에서는 GraphQL을 이용해서 실제로 프론트엔드 개발을 어떻게 했는지에 대해 구체적으로 소개하려고 한다. 1부에서 자세하게 다루지 않은 이야기 위주로 작성했다.

## 들어가며

이 글의 재료는 <유저의 정산 정보를 확인하고 수정할 수 있는 모달>을 개발하는 과정이다. 이 기능에 대해 간략하게 소개하면 다음과 같다.

- 페이지 진입 시 일부 유저 정보가 row로 제공되는 테이블이 보여짐
- 각 row별로 버튼이 존재하고, 버튼을 클릭하면 모달이 열림
- 모달 안에서 유저의 정산 정보를 조회하거나 수정할 수 있음

## 정산 정보를 수정할 수 있는 컴포넌트

사실 모든 코드를 다 보여주거나 설명하기엔 한계가 있으므로, <정산 정보를 수정할 수 있는 컴포넌트>를 중심으로 이야기를 시작해보고자 한다.

```tsx
export const SettlementInfoEditor = ({
  ...
}: SettlementInfoEditorProps) => {
  // highlight-start
  // 1. instructor fragment from cache
  const { getNormalizedCacheId } = useNormalizedCacheId();
  const cachedId = getNormalizedCacheId({ id: userId, typename: 'Instructor' });

  const client = useApolloClient();

  const instructorFragment = client.readFragment({
    id: cachedId,
    fragment: SettlementInfoEditor_InstructorFragmentDoc,
  });
  // highlight-end

  // highlight-start
  // 2. contract information fragment
  const contractInformationFragment = getFragmentData(
    SettlementInfoEditor_ContractInformationFragmentDoc,
    data
  );
  // highlight-end

  return (
    <컴포넌트...>
  )
}
```

- **Point 1. 캐시에서 데이터를 꺼내오기**:  
  모달을 여는 트리거를 제공하는 테이블은 유저 정보가 있어야 그려질 수 있는데 이미 유저(`instructor`) 정보를 조회하는 쿼리가 페이지의 최상단에 위치해있었다.  
  그런데 모달 안에서도 해당 유저 정보 일부가 필요하므로, refetch를 하는 것이 아니라 최상위에서 조회했던 데이터를 캐시에서 꺼내와서 사용했다.
- **Point 2. Fragment로 Data Masking하기**:  
  모달 안에서만 필요한 데이터를 쿼리할 때, 컴포넌트에서 필요한 데이터를 컴포넌트에서 직접 선언하여 캡슐화한다. 상위 컴포넌트에서는 구체적으로 무슨 데이터가 필요한지 알 필요가 없으며, `SettlementInfoEditor` 컴포넌트가 필요하다고 한 데이터를 Fragment로만 상위에 전달하여 최상위에서 합쳐서 쿼리한다.

## Fragment

> Share fields between operations  
> [A GraphQL fragment](https://graphql.org/learn/queries/#fragments) is a piece of logic that can be shared between multiple queries and mutations.  
> [출처](https://www.apollographql.com/docs/react/data/fragments/)

Fragment란 스키마의 일부로, 재사용 가능한 단위를 말한다.

### Fragment Collocation

이 프로젝트에서는 (비록 Apollo를 쓰긴 하지만) Relay-style GraphQL을 지향하여 [Fragment Collocation](https://emewjin.github.io/relay-style-graphql/#fragment-collocation)을 의도했다.

> Client Side GraphQL을 선택한 결정적인 이유는 레거시 API를 보다 잘 활용하여 백엔드 리소스를 최소화 하기 위함이지만, 이왕 쓰는거 가장 좋은 방식으로 써보는 연습과 학습을 같이 했다.

Fragment Collocation을 하려는 이유는 어떤 필드가 실제로 쓰이는지 아닌지를 보다 잘 추적하기 위함이다. 프론트엔드 개발을 하다보면 높은 확률로 컴포넌트가 하나의 역할만을 하게 하려고 컴포넌트를 쪼개고, 유지보수하기 쉽게 새 파일로 옮긴다. 한 컴포넌트 내부에 모든 로직이 합쳐져 있을 때에는 그 컴포넌트에서 호출하는 쿼리 속 필드가 어디에 어떻게 쓰이는지 추적하기 쉽지만, 컴포넌트가 분리되면서부턴 어려워진다.

이 문제를 React의 Props type으로 해결할 수도 있다. 상위 컴포넌트에서 스키마를 작성해 쿼리하고, 하위 컴포넌트에서는 그 데이터를 전달받을 것이므로 자연스럽게 Props에 대한 타입을 정의하고 그것이 곧 쿼리 속 필드가 어떻게 쓰이는지 추적할 수 있는 방법이 된다. 하지만 이 방법엔 문제가 있는데, [GraphQL의 스키마 정의와 컴포넌트의 Props type을 중복으로 두 벌 작성해야 한다는 점](https://www.apollographql.com/blog/using-graphql-fragments-for-safer-cleaner-and-faster-code#disadvantage-2-duplicating-data-dependencies)이다.

이러한 문제까지 해결해줄 수 있는 것이 바로 Fragment Collocation이다.

위의 코드를 다시 살펴보면 `SettlementInfoEditor`는 컴포넌트 내부에서 [코드 제너레이터가 만들어준 Fragment Masking 함수](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#fragment-masking) `getFragmentData`를 이용해 데이터를 반환하고, 컴포넌트 내부에선 그 반환값만을 사용하고 있다.

이렇게 함으로써 `SettlementInfoEditor` 컴포넌트는 내부에서 필요한 필드를 하나하나 Props type에 작성할 필요가 없다. 대신 아래와 같이 (역시 코드 제너레이터가 만들어준) `FragmentType<T>` 만 Props type으로 선언해주면 된다.

```tsx
type SettlementInfoEditorProps = {
  // highlight-next-line
  data?: FragmentType<typeof SettlementInfoEditor_ContractInformationFragmentDoc>;
};

export const SettlementInfoEditor = ({
  data,
  ...
}: SettlementInfoEditorProps) => {
  ...
  const contractInformationFragment = getFragmentData(
    SettlementInfoEditor_ContractInformationFragmentDoc,
    data
  );
}
```

### Fragment Masking

코드 제너레이터가 생성해준 `FragmentType<T>`를 통해서 최상위에서 쿼리한 데이터에 `SettlementInfoEditor`에서 선언한 `Fragment`의 필드들이 있는지 없는지를 보장받을 수 있고, 타입 지원까지 받을 수 있어 안정적인 코드 작성이 가능해진다.

또한 `getFragmentData`함수가 `data`로부터 `Fragment`에서 선언한 값으로 타입을 좁혀주기 때문에 `Fragment`에서 선언하지 않은 다른 필드를 사용할 수 없다. 물론, `data` Prop을 직접 이용해 `Fragment` 안에 선언되지 않은 다른 필드에 접근하는 것도 불가능하다. 이를 **Data Masking** 혹은 **Fragment Masking**이라고 한다.

Fragment를 선언하는 것은 간단하다. ([앞서 1부에서 설명했던 것처럼,](https://emewjin.github.io/client-side-graphql/#%ED%95%9C%EA%B3%84-%EC%A7%84%EC%A7%9C-relay-%EC%8A%A4%ED%83%80%EC%9D%BC%EA%B3%BC-%EB%8B%A4%EB%A5%B8-%EC%A0%90) 컴포넌트 안에 collocation하지는 못했다.) Relay-style을 지향하고자 했기 때문에 이름은 컴포넌트 이름으로 시작하도록 (~수동~) 컨벤션을 정했다.

```graphQL
# settlementInfoEditor.graphql
fragment SettlementInfoEditor_ContractInformation on ContractInformation {
  # 이런저런 필드들이 선언되어 있다.
}
```

### Fragment의 중복

그런가하면 Relay-style이 익숙하지 않을 때 (~그렇다고 지금도 익숙한건 아님~) Fragment를 사용하다가 Fragment가 필드까지 완벽하게 동일하게 생겼는데 선언하는 주체가 다른 경우, 중복을 감수해야 하는 이유에 대해 궁금증이 생겼다.

예를 들어 `SettlementInfoTable` 컴포넌트와 `SettlementInfoEditModal` 컴포넌트에서 필요로 하는 데이터가 동일한 상황이었다. 때문에 다음과 같이 서로 다른 두 컴포넌트에서 Fragment가 선언되고 사용되었다.

```tsx
// SettlementInfoTable.tsx
const contractInformationFragment = getFragmentData(
  // highlight-next-line
  SettlementInfoTable_ContractInformationFragmentDoc,
  data
);

// SettlementInfoEditModal.tsx
const contractInformationFragment = getFragmentData(
  // highlight-next-line
  SettlementInfoEditor_ContractInformationFragmentDoc,
  data
);
```

각 스키마 선언부를 보면 완벽하게 동일하다. 심지어 두 Fragment에서 선언한 필드는 두 Fragment가 의존하고 있는 `ContractInformation` 타입의 필드와도 빠지는 것 없이 동일하다.

여기서 궁금했던 것은 "이런 상황에서조차 Fragment를 나누는 이유가 뭘까? 그냥 `ContractInformation`를 재사용 할 수는 없는 걸까?"였다.

이에 대한 답은,

1. Relay-style을 지향한다면 아무리 Fragment 선언이 중복되더라도 컴포넌트 간에 절대 Fragment를 공유하지 않아야한다. 그 이유는 다음과 같다.

   > 문제는 여러 컴포넌트에서 GraphQL query들과 fragment들을 공유할 때 발생합니다: 정적분석으로는 `.graphql`파일 안의 어떤 필드가 사용되지 않았는지 알 수 없으므로 **안전하게 제거할 수 없습니다.**
   >
   > Relay-style Fragment collocation 은 이러한 문제를 해결합니다: 컴포넌트의Fragment에서 필드를 제거하거나 컴포넌트만 제거하고 다른 컴포넌트에서 해당 필드를 참조하지않는 경우, 별도로 해줄 일 없이 쿼리에서 해당 필드가 제거됩니다.
   >
   > [출처](https://emewjin.github.io/relay-style-graphql#%EC%9D%B4%EC%A0%90-1-over-fetching-%EB%B0%A9%EC%A7%80)

2. 꼭 상위 `type` (여기서는 `ContractInformation`)의 필드 중 일부 만을 사용하는 케이스가 아니더라도, "이 컴포넌트에서 어떤 데이터를 사용할 것"이라고 명시해주는 것만으로도 캡슐화 역할을 할 수 있다는 이점 때문이다.

이렇게 작성한 Fragment를 사용하기 위해서는 최상위 쿼리에서 Fragment를 spread 해야한다.  
다음으로는 그런 schema를 어떻게 작성했는지 살펴보겠다.

> Fragment가 어떻게 동작하는지 혹은 다른 장점에 대해서 더 알고싶다면 [이 글](https://emewjin.github.io/relay-style-graphql/#fragment-collocation)을 읽어보는 것을 추천한다.

## Query

### 스키마 작성

데이터를 쿼리하기 위해 먼저 스키마를 작성한다.  
필요한 정보는 `ContractInformation`이므로, 해당 데이터를 불러오는 가장 최상위의 시점의 `.graphql` 파일에 스키마를 작성하고 하위 컴포넌트에서 작성된 Fragment를 spread한다.

```graphQL
# settlementInfoModal.graphql
type Query {
  contractInformation(id: Int!): ContractInformation!
}

query SettlementInfoModal_SettlementInfo($id: Int!) {
  contractInformation(id: $id) {
    ...SettlementInfoTable_ContractInformation
  # highlight-next-line
    ...SettlementInfoEditor_ContractInformation
  }
}
```

### 리졸버 작성

그리고 이 값을 패칭하기 위한 resolver를 작성한다.

```ts
// contractInformation.query.ts
export const contractInformationQueryResolvers: Partial<QueryResolvers> = {
  contractInformation: async (_, args, context) => {
    const { id } = args;
    const apiResponse = await context.graphqlFetcherForV1.get<{
      // 레거시 API 스펙을 기준으로 작성
      lecturer: ContractInformation;
    }>(`${API_ENDPOINT}/${id}`);

    return apiResponse.lecturer;
  },
};
```

### useQuery와 useLazyQuery

이제 Apollo client에서 제공하는 `useQuery`훅을 이용해서 데이터를 패칭하면 되는데, 일반적으로는 다음과 같이 사용할 수 있다.

```graphQL
query InstructorsPage_Instructors(
  $page: Int
  $limit: Int
  $keyword: String
  $searchType: InstructorSearchType
) {
  instructors(page: $page, limit: $limit, keyword: $keyword, searchType: $searchType) {
    ...InstructorsTable_InstructorList
  }
}
```

이런 쿼리를 선언했다고 하면, `useQuery` 훅을 호출할 때에는 `page: $page, limit: $limit, keyword: $keyword, searchType: $searchType` 요 친구들을 `variables`에 넘겨주면 된다.

```tsx
const { data, error } = useQuery(InstructorsPage_InstructorsDocument, {
  variables,
});
```

그런데 정산 정보를 수정하는 뷰는 모달 내에 그려지고, 모달은 트리거 버튼을 클릭해야만 열린다.

유저가 버튼을 클릭하지 않았음에도 모달 내에 필요한 데이터를 미리 패칭하여 버튼을 클릭했을 때 모달을 바로 사용할 수 있게 할 수도 있을 것이다. 하지만 이 페이지에서는 트리거 버튼이 테이블의 row만큼 그려지고 있고 `SettlementInfoModal_SettlementInfo` 쿼리를 버튼 컴포넌트 안에서 요청하고 있기 때문에 미리 패칭하게 한다면 페이지에 진입하자마자 버튼의 수만큼 쿼리가 호출될 것이다.

때문에 [lazy query](https://www.apollographql.com/docs/react/data/queries/#manual-execution-with-uselazyquery)를 사용하여 버튼을 클릭했을 때에만 쿼리를 호출하고, `loading` 값을 이용해 호출 중에는 button을 disabled했다.

```tsx
import { useLazyQuery } from '@apollo/client';
import { SettlementInfoModal_SettlementInfoDocument } from '../../../@types/generated/graphql';

export const Sample = () => {
  // highlight-start
  const [getContractInfo, { error, loading }] = useLazyQuery(
    SettlementInfoModal_SettlementInfoDocument,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        id: userId,
      },
    }
  );
  // highlight-end

  return (
    <Button
      loading={loading}
      onClick={async () => {
        // ...

        // highlight-start
        const res = await getContractInfo({
          variables: {
            id: userId,
          },
        });
        // highlight-end

        // ...
      }}
    >
      정산 정보
    </Button>
  );
};
```

## Mutation

### 스키마 작성

역시 먼저 스키마를 작성해야 한다.  
Mutation 요청시 서버에 전송할 데이터인 `input`에 대한 스키마를 다음과 같이 작성할 수 있다.

```graphQL
input UpdateSettlementInfoInput {
  # 서버에 전송할 필드들을 선언
  ...
}
```

GraphQL의 mutation은 성공시 성공한 객체 (업데이트된 값)를 내려주는 것이 일반적이라고 한다.
그러나 레거시 API는 단순하게 `{ok: boolean}` 만을 내려주고 있었다. 즉, 업데이트 된 데이터를 반환하지 않기 때문에 `null`이 맞겠으나 [GraphQL에서 `null`은 사용할 수 없다고 한다.](https://github.com/ardatan/graphql-tools/issues/277) 그렇다고 GraphQL의 컨벤션을 따르게 API를 수정하기 어려우므로 대신 Boolean을 리턴 타입으로 작성했다.

```graphQL
type Mutation {
  updateSettlementInfo(input: UpdateSettlementInfoInput!): Boolean
}

mutation SettlementInfoEditModal_UpdateSettlementInfo(
  $input: UpdateSettlementInfoInput!
) {
  updateSettlementInfo(input: $input)
}
```

### 리졸버 작성

Mutation resolver는 다음과 같이 작성한다.

```ts
import type { MutationResolvers } from '../../../../@types/generated/resolversTypes';

export const settlementInfoMutationResolvers: Partial<MutationResolvers> = {
  updateSettlementInfo: async (_, args, context) => {
    const { userId, ...newInfo } = args.input;

    await context.graphqlFetcherForV1.put(
      `${API_ENDPOINT}/${userId}`,
      {
        // 레거시 API 스펙에 맞게 매핑
        bank_holder: newInfo.bankHolder,
        ...
      }
    );

    return true;
  },
};
```

input값의 `Maybe`에 대해서는 검증할 필요 없다고 합의했다. Mutation resolver에는 검증 완료된 input값이 넘어와야하기 때문이다. resolver에서는 단순히 `null`값만 털어내어 API 요청을 보낸다.

작성한 resolver는 잊지말고 실행가능한 스키마를 만드는 함수에 등록해준 후, 코드 제너레이터를 실행하자.

### useMutation

Mutation 요청을 실제로 보내는 코드를 살펴보겠다.

```tsx
import { useMutation } from '@apollo/client';
import {
  InstructorsPage_InstructorsDocument,
  SettlementInfoEditModal_UpdateSettlementInfoDocument,
  SettlementInfoModal_SettlementInfoDocument,
  UpdateSettlementInfoInput,
} from '../../../@types/generated/graphql';

const [updateContractInfo, { loading: mutationLoading }] = useMutation(
  SettlementInfoEditModal_UpdateSettlementInfoDocument,
  {
    refetchQueries: [
      InstructorsPage_InstructorsDocument,
      SettlementInfoModal_SettlementInfoDocument,
    ],
    onCompleted: () => {
      // do something
    },
    onError: (mutationError) => {
      // do something
    },
  }
);
```

Mutation 성공시, 갱신된 데이터를 불러오기 위해 refetch를 진행한다. 사실 GraphQL의 캐싱 이점을 누리려면 무조건 refetch보다 변경된 값에 대해 캐시 데이터를 업데이트해서 Apollo에서 제공하는 "캐시 업데이트 시 리렌더 되는 것"을 활용하는 것이 좋을 것이다.

하지만 그러려면 mutation에 대한 응답으로 갱신된 데이터를 받아올 수 있어야 하는데, 앞서 말했듯 레거시 API는 그렇지 않기 때문에 이 점을 많이 활용할 수 없었다. 그래도 백엔드 개발자들의 리소스가 되는 선에서 새로 개발해야 했던 API에서는 mutation 성공 시의 데이터를 응답값에 포함해서 내려주었다.

> 이처럼 GraphQL을 이용하긴 하지만 완벽하게 GraphQL을 이용하고 모든 이점을 누렸다고 볼 수는 없는 프로젝트이다.

```ts
const [updatePoint, { loading }] = useMutation(
  UserPointModal_UpdateUserPointDocument,
  {
    // highlight-start
    /**
     * mutation 성공 -> 응답에 포함된 업데이트된 값으로 캐시 업데이트
     */
    update: (cache, { data }) => {
      ...
      cache.updateFragment(
        {
          id: getNormalizedCacheId({ id: userId, typename: 'User' }),
          fragment: UserPointModal_UserFragmentDoc,
        },
        (fragment) => ({
          ...fragment,
          id: userId,
          point: updatedUserPoint,
        })
      );
    },
    // highlight-end
    ...
  }
);
```

## Custom Scalar

GraphQL은 스키마 작성시 타입을 Scalar로 작성할 수 있는데, Scalar는 값을 보다 구체적으로 표현해주는 타입이라고 생각하고 있다. 예를 들어 `email`이라는 필드를 `String`으로 표현할 수도 있겠지만 `Email`이라고 표현할 수 있다면 우리가 생각하는 이메일 포맷으로 구체적으로 값을 표현해줄 수 있을 것이다.

이런 Scalar는 GraphQL에서 기본으로 제공하는 것도 있지만, Custom Scalar라고 해서 직접 선언할 수도 있다. 이 프로젝트에서 쓰는 [Apollo의 공식문서](https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/)를 따라 Custom Scalar를 선언해보자.

우리 팀은 Date 객체를 다루는 라이브러리로 dayjs를 쓰고 있는데, 서버에서 전달받은 값을 클라이언트에서 dayjs 인스턴스로 사용하고 반대로 클라이언트에서 보내는 값은 지정된 포맷의 문자열로 변환해서 서버에 전달하고 싶었다.

```ts
import { GraphQLScalarType } from 'graphql';

import dayjs from '../utils/date';

// GraphQL을 통한 input output의 타입을 바꿔주는 역할
const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime for JavaScript Date instance',
  serialize(value) {
    if (typeof value === 'string') {
      return dayjs(value);
    }
  },
  parseValue(value) {
    if (value instanceof Date) {
      return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
    }
  },
});

export const scalarResolvers = {
  DateTime: DateTimeScalar,
};
```

중요한 것은 `serialize`와 `parseValue`이다. 쉽게 말하면 `serialize`는 서버에서 받은 값을 클라이언트 친화적으로 변경하고 `parseValue`는 클라이언트 친화적인 값을 서버가 해석할 수 있는 값으로 변경한다.

이렇게 만든 Custom Scalar는 resolver에 담아 실행가능한 스키마를 만드는 함수에 넘겨주고

```ts
const schema = makeExecutableSchema({
  typeDefs: print(typeDefs),
  resolvers: [
    // highlight-next-line
    scalarResolvers,
    ...
  ],
});
```

스키마에 scalar를 선언하면 사용할 수 있다.

```graphQL
scalar DateTime
```

## Field Policy

GraphQL에서 중요한 부분 중 하나가 캐시라고 생각한다. Apollo Client의 캐싱에 대해서는 [공식문서](https://www.apollographql.com/docs/react/caching/overview)를 읽어보는 것이 가장 좋다. 캐싱에서 핵심적인 부분은 정규화(normalization)인데, Apollo는 `타입이름: 아이디`를 유니크한 캐시 ID로 삼아서 데이터를 정규화한다. Apollo의 정규화에 대해서는 [DEVIEW 2023 GraphQL 잘 쓰고 계신가요? (Production-ready GraphQL) 발표](https://youtu.be/9G2vT4C4sAY?t=1430)가 쉽게 설명해주신 것 같다.

[Type Policy](https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields)에 field policy를 작성하여 아폴로 클라이언트가 [특정 필드에 대해 캐시를 어떻게 읽고 쓸 것인지 정의할 수 있다](https://www.apollographql.com/docs/react/caching/cache-field-behavior).

여기서는 argument를 사용하는 필드에 대해 [key argument를 명시](https://www.apollographql.com/docs/react/caching/cache-field-behavior#specifying-key-arguments)하여 쿼리 시 어떤 argument를 기준으로 데이터를 캐싱할 것인지 설정했다. **기본적으로는 모든 argument가 key argument가 되므로,** 만약 캐싱 조건에 필요없는 argument가 있다면 정책을 설정해주는 것이 좋다.

```ts
import type { TypedTypePolicies } from './generated/typePolicies-helper';

export const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      instructors: {
        keyArgs: ['page', 'limit', 'keyword', 'searchType'],
      },
      contractInformation: {
        keyArgs: ['id'],
      },
    },
  },
  ...
};
```

작성한 Type policy는 아폴로 클라이언트를 초기화 할 때 넘겨주면 된다.

```ts
export const apolloClient = new ApolloClient({
  defaultOptions: {
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
  // highlight-start
  cache: new InMemoryCache({
    typePolicies,
    possibleTypes: fragmentMatcher.possibleTypes,
  }),
  // highlight-end
  ...
});
```

## 마무리

여기까지 실질적으로 프로젝트에서 GraphQL을 어떻게 활용했는지 구체적으로 사례들을 살펴보았다. 마지막으로 이 프로젝트를 개발한 것이 몇 달 전이라, 기억이 가물가물하긴 하지만 최대한 기억나는 포인트들을 정리해보았다. 혹시라도 뒤늦게 생각나는 부분들이 있다면 틈틈이 추가 수정해보겠다.

비록 어드민이긴 하지만 실무에서 GraphQL을 처음 사용해본 프로젝트라는 점에서 인상 깊은 프로젝트였다. 아 그리고 RESTful API를 그대로 사용하기 때문에 over-fetching 문제를 해결한다는 이점은 누리지 못한 건가 싶긴 하지만...? 중복되는 fragment는 알아서 merge해서 한 번의 요청만 보낸다고 하니까 반만 누린 걸로 하자...

GraphQL을 통해 레거시 API를 다루는 경험이 꽤나 좋았기 때문에 이후로도 레거시 API를 사용해서 새 프론트엔드를 개발해야 한다고 했을 때 "그럼 GraphQL?"을 외치게 되었다. 유저가 더 많고 케이스가 다양한 B2C에도 적용하고 운영했을 때, 인상이 달라질지 어쩔지 궁금하다.
