---
title: Client side GraphQL로 어드민 만들기 1부 - 환경 구축
description: 레거시 프로젝트 마이그레이션 시, 백엔드 리소스를 최소화하기 위해 Client side GraphQL을 사용하기로 선택하고 그 환경을 구축했던 내용에 대해 적어봅니다.
date: 2024-01-21
lastUpdated: 2024-01-21
tags: [React, GraphQL]
---

이 글에서는 회사에서 어드민 제품의 프론트엔드를 레거시 프로젝트에서 모던한 프로젝트로 마이그레이션 할 때, 백엔드 리소스를 최소화하기 위해 Client side GraphQL을 사용하기로 선택한 내용과 어떻게 그 환경을 구축했는지 적어보려 한다.

글이 너무 길어져서 (~~글 작성을 작년부터 시작했는데 배포를 미루고 미뤘던 이유가 있었다~~) GraphQL로 실질적인 개발 과정은 어떻게 이루어지고 있느냐에 대해 이야기는 2부에서 하려고 한다.

## 배경

레거시 어드민을 리액트 앱으로 마이그레이션 하기로 했다. 이때 백엔드 리소스가 없어서 프론트엔드 리소스만 가지고 개발하기 위해 레거시 프로젝트의 API를 최대한 사용해야 하는 상황이었다.

없는 API를 개발해야 한다면, 간단한 것은 이미 만들어져 있는 ORM을 이용해 프론트엔드 개발자가 직접 개발할 수 있었고 (물론 이 경우에도 백엔드 개발자의 코드리뷰가 필요함) ORM을 수정한다거나 조금 복잡한 API 개발은 백엔드 개발자의 도움을 받았다.

대부분은 이미 존재하는 API를 가지고 개발이 가능했어서 백엔드 리소스가 크게 필요하지 않았는데, 개발팀의 모던 컨벤션으로 개발한 API가 아니다 보니 다음과 같은 문제점들이 있었다.

1. **API의 응답에는 필요하지 않은 데이터도 포함되어 있다.**  
   예를 들어 프론트엔드에서 유저에 대한 다섯 가지 정보만 필요한데 유저에 대한 모든 정보가 응답으로 내려오고 또 그 응답값 중에 연관 있는 정보(예를 들면 유저가 수강하는 강의에 대한 정보)도 추가로 엮여서 내려오는 그런 상황이었다. 그래서 이 화면에서 필요한 정보가 정확히 무엇인지 응답만 보고 알기 어려웠다.
2. **API의 응답에는 알아볼 수 없는 의미의 이름이 포함되어 있다.** (ex. `_`)
3. **API의 응답은 모두 스네이크 케이스이고, 개발팀의 모던 컨벤션은 카멜 케이스이다.**
4. **프론트엔드가 먼저 모던 스택으로 마이그레이션 되었지만, 백엔드 코드도 마이그레이션 될 예정이다.**  
   레거시 API 스펙에 맞춰 프론트엔드를 다 개발해두었는데 추후 백엔드 마이그레이션이 완료되면 그에 맞춰 프론트엔드 코드를 다시 전면적으로 수정하는 미래가 (스네이크 케이스 -> 카멜 케이스 등) 상상되었다.

이 모든 문제점을 해결하기 위해서는 레거시 API 응답을 모던 컨벤션에 맞게 한 번 가공해 주는 단계가 필요하다고 판단했다.

그럼 그 단계는 어떻게 개발할 수 있을까?

## 레포지토리 패턴 (Repository Pattern)

![](https://github.com/emewjin/emewjin.github.io/assets/76927618/ba3121a9-d92f-4b96-a1df-fd29cf313e9f)

디자인 패턴 중 하나인 레포지토리 패턴은 데이터 소스 레이어와 비즈니스 레이어 사이를 중재한다고 알려져 있다. 프론트엔드 입장에서 데이터 소스는 보통 백엔드 API 응답이 될 것이고, 비즈니스 레이어 (혹은 클라이언트)는 리액트 컴포넌트가 될 것이다. 레포지토리라는 구성 요소는 그 사이에서 중앙 집중식으로 API 응답을 관리하여 클라이언트 친화적으로 데이터를 클라이언트에게 제공한다.

이를 통해 얻을 수 있는 이점은 다음과 같다.

1. 백엔드 API 응답을 가공하는 코드의 중복을 줄이고 중앙집중적으로 관리할 수 있다. 즉, 가공하는 코드의 변경이 필요한 경우 레포지토리 레이어에서만 수정이 발생한다.
2. 클라이언트가 데이터 소스에 직접 접근하는 코드가 분리되므로, 클라이언트 코드에 대한 테스트를 작성하기 쉬워진다.

따라서 이번 프로젝트에서 고민했던 문제들을 레포지토리 레이어를 도입함으로써 해결할 수 있다고 판단했다.

그럼 레포지토리 패턴은 어떻게 구현할 수 있을까?

직접 레포지토리 레이어 개념을 만들고, 커리어 초반 경험했던 <랠릿> 프로젝트에서처럼 [class-validator](https://github.com/typestack/class-validator) 등을 이용해 API 응답값을 클라이언트 친화적으로 변경하는 코드를 작성할 수도 있을 것이다.

하지만 그렇게 했을 때 사실 강제성은 없다고 생각했다. 프레임워크가 정해놓은 규칙이라 무조건 그에 따르지 않으면 이용할 수 없는 것이 아니기 때문이다. 물론 그러한 강제성을 넣어주는 방법도 있겠지만 그보다는 좀 더 명시적으로, 시스템 차원에서 관리되기를 바랐다.

또한 별도로 레포지토리 레이어 구현을 위해 "우리끼리의" 개념을 정립하고 합의하는 단계를 생략하고 싶었다. 아직 "우리끼리의" 개념을 정립하고, 마치 프레임워크처럼 사용할 수 있는 단계는 아니라고 생각했다.

그런 상황에서 GraphQL이 꽤나 매력적인 선택지가 되어주었다.

## GraphQL을 선택한 이유

크게 아래 두 가지 이유로 백엔드 리소스 없이 새로운 어드민을 개발하는 데 도움이 될 수 있겠다고 생각했다.

### 1. 레포지토리 레이어로서의 역할

GraphQL의 [resolver](https://graphql.org/learn/execution/#root-fields-resolvers)가 레포지토리 레이어의 역할을 할 수 있겠다고 생각했다. resolver에 대해서는 [뒤에서](#3-resolver-작성) 자세하게 설명하겠다.

> GraphQL의 resolver란 클라이언트에서 온 요청에 따라 쿼리의 각 필드에 대한 데이터를 제공하는 과정을 담당하는 함수를 말한다.
>
> You can think of each field in a GraphQL query as a function or method of the previous type which returns the next type. In fact, this is exactly how GraphQL works. Each field on each type is backed by a function called the **resolver** which is provided by the GraphQL server developer. When a field is executed, the corresponding **resolver** is called to produce the next value.  
> [출처](https://graphql.org/learn/execution/)

### 2. 여러 endpoint 처리

사실 지금까지 여러 엔드포인트의 API를 한 번에 호출하여 필요한 데이터를 가공할 일이 거의 없었다. 대부분 한 페이지와 하나의 API가 정확히 맵핑되었고, 필요시 하나의 API에 응답값을 추가하는 방식으로 다 처리 가능했다.

그러나 프로덕트 조직은 목적 단위 조직인 셀(Cell)로 나뉘어져 있어 앞으로 레거시 API는 언제든지 담당하는 셀에 따라 플랫폼 성격의 API로 쪼개어질 수 있다. 그리고 그게 멀지 않은 미래라고 판단했다.

물론 셀 별로 쪼개진 API를 통합하는 건 백엔드에서 해줘도 된다. 하지만 이번처럼 백엔드 리소스가 없는 상황이라면 충분히 여러 엔드포인트의 API를 사용해서 2개 이상의 데이터를 요청해야 할 수도 있다.

GraphQL을 사용한다면 resolver 쪽에서 여러 엔드포인트를 처리할 수 있겠다고 생각했다.

### 3. 그밖에

백엔드 리소스를 최소화 하는 것과 관련은 없지만 GraphQL을 사용한다면 얻을 수 있는 추가적인 이점들은 다음과 같다.

- 백엔드에서 API를 분리할 때 프론트엔드에서 선언한 GraphQL 스키마를 보고 그대로 만든다면, 별다른 프론트엔드 코드 수정이 필요하지 않음
- GraphQL Fragment를 통해 data masking, 컴포넌트에 필요한 데이터 캡슐화

## Client side GraphQL

GraphQL은 언어, 명세, 형식이기 때문에 이 스펙을 준수하며 요청/응답할 수 있는 구현체가 필요하다. 이 구현체는 서버 측도 있고 클라이언트 측도 있는데, 우리는 (다시 이야기하지만) 백엔드 리소스가 없는 상황이었다. 그래서 선택한 것이 GraphQL의 스키마와 resolver를 클라이언트 코드에 포함하는 **Client side GraphQL**이다.

 <!-- 필요했고 Apollo는 그런 구현체를 제공하는 라이브러리 중 하나이다.
그러나 일반적으로 GraphQL은 API 서버를 연상시킨다.

> GraphQL은 API를 위한 **쿼리 언어**이며 타입 시스템을 사용하여 쿼리를 실행하는 **서버사이드** 런타임입니다.
> [출처](https://graphql-kr.github.io/learn/) -->

Client side GraphQL은 서버와 통신하는 클라이언트 측 인프라 개념이다.

전통적인 방식은 아래 그림과 같이 GraphQL 서버가 따로 있어 스키마와 resolver가 서버에 선언되어 있고 클라이언트에서는 http 통신을 통해 스키마를 받아오는 방식이라면,
![전통적인 graphQL, 이미지 출처: GraphQL without a server https://github.com/hasura/client-side-graphql](https://github.com/emewjin/emewjin.github.io/assets/76927618/1f28a0d8-1d69-41f2-82fc-f7b46850c42f)

Client side GraphQL은 클라이언트에 스키마와 resolver를 선언하기 때문에 별도로 GraphQL 서버를 구축하지 않아도 된다.
![클라이언트 사이드 graphQL, 이미지 출처: GraphQL without a server https://github.com/hasura/client-side-graphql](https://github.com/emewjin/emewjin.github.io/assets/76927618/d03edea8-0eab-4c78-8381-baccdb84d865)

GraphQL 클라이언트는 [아폴로 클라이언트(Apollo client)](https://www.apollographql.com/docs/react/)를 선택했다. 개발팀 내에서 다들 Apollo 경험만 있었기 때문이다.

> [공식문서](https://graphql.org/code/#javascript-client)에서 아폴로 외에도 client에서 사용할 수 있는 GraphQL 라이브러리를 찾아볼 수 있다.

## Client side GraphQL 구현

이제부터는 팀에서 아폴로 클라이언트로 Client side GraphQL을 구현한 과정을 소개하겠다. 모든 환경 설정은 [킹갓제네럴](https://wiki.lucashan.space/)께서 진행하셨고 내가 한 것은 그 설정을 잘 이해하기 위해 노력한 것이 다임을 먼저 밝힌다.

### 1. 아폴로 클라이언트 설정

[아폴로 클라이언트 공식문서](https://www.apollographql.com/docs/react/get-started#step-3-initialize-apolloclient)를 보면 `client` 인스턴스를 초기화 할 때 필수값으로 GraphQL 서버의 주소인 `uri`를 넘겨주어야 한다.

아폴로 클라이언트는 기본적으로 이 `uri`로 `HttpLink`를 만들어서 GraphQL operation^[클라이언트에서 서버로 전송되는 GraphQL 요청의 유형을 말하며 query, mutation, subscription이 있다.]을 HTTP 요청으로 GraphQL 서버에 전송한다. 그러나 우리는 GraphQL 서버가 없으므로 이를 사용할 수 없다.

이를 수정하려면 아폴로 클라이언트의 `link`에 대해 알아야 한다. [공식문서](https://www.apollographql.com/docs/react/API/link/introduction)에 의하면 `link`는 아폴로 클라이언트와 서버 사이의 데이터 흐름을 정의한다. GraphQL 서버가 없어 `HttpLink`를 사용할 수 없다면 [`SchemaLink`](https://www.apollographql.com/docs/react/API/link/apollo-link-schema/#overview)를 사용할 수 있다.

> 그 외에도 다양한 링크들이 존재하여, 에러/로딩 처리를 link를 통해서 할 수도 있다고 함...

```ts
export const apolloClient = new ApolloClient({
  ...
  link: new SchemaLink(...),
});
```

`SchemaLink`는 GraphQL 서버 없이도 GraphQL 스키마만 있으면 GraphQL API를 사용할 수 있게 해준다. 사용할 때, 반드시 실행 가능한 (executable) 스키마를 넘겨주어야 한다. `@graphql-tools/schema`에서 제공하는 [`makeExecutableSchema` 함수](https://the-guild.dev/graphql/tools/docs/generate-schema#makeexecutableschema)를 사용하면 손쉽게 `SchemaLink`에서 요구하는 실행 가능한 스키마를 생성할 수 있다.

> 스키마와 실행 가능한 스키마의 차이가 궁금해서 찾아보았는데 아직도 정확히는 모르겠지만 apollo client를 사용하기 위한 개념이며 typeDef와 resolver를 갖춘 스키마라는 것 같다 🤔

```ts
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema }),
});
```

이 함수로 스키마를 생성하기 위해서 [typeDef](https://www.apollographql.com/docs/apollo-server/API/apollo-server/#typedefs)와 resolver가 필요하다. typeDef는 `gql` 템플릿 리터럴 태그로 작성된, 사용할 데이터들의 구조와 타입이다.

```ts
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};
```

따라서 다음 단계에서는 `makeExecutableSchema` 함수로 스키마를 생성하는 데 필요한 typeDef를 어떻게 생성하고 resolver를 어떻게 작성했는지에 대해 설명하겠다.

### 2. typeDef 생성

먼저 말하자면 typeDef는 자동으로 만들어지게 할 것이다. 그러기 위해 각 페이지 단위로 필요한 데이터의 [스키마](https://graphql-kr.github.io/learn/schema/)를 작성한다.

#### 2-1. 스키마 수동 작성

적절한 위치에 `*.graphql` 파일을 생성하고, 필요한 type과 fragment 등 클라이언트에서 쿼리할 데이터를 정의한다. (후술할테지만 `src` 내부에 선언된 모든 `*.graphql`은 하나의 스키마로 합쳐질 것이다.) 스키마는 향후 백엔드 API 명세로도 쓰일 것을 목표로 하기 때문에 백엔드 개발자와 프론트엔드 개발자가 함께 작성한다.

마이그레이션 해야 하는 페이지에서 호출하는 API들을 확인하여 필요한 데이터들을 GraphQL 명세에 맞게 작성한다. 이때, 기존의 API 응답 결과에는 실제 코드에서 사용하지 않는 데이터도 포함되어 있기 때문에 레거시 프론트엔드 코드를 반드시 같이 확인해야 했다. 또한 이해하기 어려운 축약어로 된 변수명이 있으면 적절한 이름으로 수정하여 작성하고, 무슨 타입인지 알 수 없다면 ORM 코드나 DB테이블을 백엔드 개발자와 함께 확인하기도 했다.

아래 예시 코드는 실제 프로덕트 코드의 축약된 버전이다.

```graphQL
type User {
  id: Int!
  # 유저 닉네임
  name: String
  # 인증 상태
  status: UserStatus!
  ...
}

type UserList implements PageInfo {
  totalCount: Int!
  totalPage: Int!
  activatedPage: Int!
  nodes: [User!]!
}

type Query {
  users(
    page: Int
    limit: Int
    keyword: String
    searchType: UserSearchType
    userTypes: [UserType!]
  ): UserList!
}

query UsersPage_Users(
  $page: Int
  $limit: Int
  $keyword: String
  $searchType: UserSearchType
  $userTypes: [UserType!]
) {
  users(
    page: $page
    limit: $limit
    keyword: $keyword
    searchType: $searchType
    userTypes: $userTypes
  ) {
    # Parent는 이 fragment가 필요한 것만 알고 내부 구현은 알지 못함 (캡슐화)
    ...UsersTable_UserList
    nodes {
      ...UserSettingModal_User
      ...UserSettingModal_UserForm
    }
    totalCount
  }
}
```

#### 2-2. prepare-graphql 실행

스키마 작성이 끝났다면 `prepare-graphql`을 실행하여 typeDef를 생성한다. `prepare-graphql`은 GraphQL을 편하게 사용하기 위한 설정이나 유틸을 제공하기 위해 개발된 패키지로, src 디렉토리 내부에 선언된 `*.graphql`을 모두 찾아 typeDef를 생성하고 하나의 스키마로 병합한다.

- 하나의 스키마로 병합: 후술할 code generator를 위한 준비물이다.

  ```ts
  // This loader loads documents and type definitions from .graphql files.
  import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
  // Synchronously loads a schema from the provided pointers.
  import { loadSchemaSync } from '@graphql-tools/load';
  // Merges multiple type definitions into a single DocumentNode
  import { mergeTypeDefs } from '@graphql-tools/merge';
  // Converts an AST into a string, using one set of reasonable formatting rules.
  import { print } from 'graphql';

  // src 내부에 선언된 *.graphql을 모두 찾아
  const result = loadSchemaSync(path.join(srcPath, './**/*{.page,}.graphql'), {
    loaders: [new GraphQLFileLoader()],
  });
  // 하나로 합친뒤
  const mergedSchema = mergeTypeDefs(result);
  const graphqlSchema = print(mergedSchema);
  // 스크립트를 실행한 패키지에 schema.graphql라는 이름의 파일로 생성한다.
  fs.writeFileSync(
    path.join(executeRootPath, './schema.graphql'),
    graphqlSchema
  );
  ```

- typeDef 생성

  ```ts
  export const makeTypeDefs = (
    filePath: string,
    mergedSchema: DocumentNode
  ) => {
    fs.writeFileSync(
      filePath,
      `import type { DocumentNode } from 'graphql';\n\nexport const typeDefs = JSON.parse('${JSON.stringify(
        mergedSchema
      )}') as unknown as DocumentNode;\n`
    );
  };

  makeTypeDefs(
    path.join(srcPath, './@types/generated/typeDefs.graphql.ts'),
    mergedSchema
  );
  ```

이렇게 실행 가능한 스키마를 생성하기 위한 준비물 중 typeDef의 생성이 완료되었다. 다음으로 resolver를 작성하는 방법에 대해 살펴보겠다.

### 3. resolver 작성

각 페이지별로 resolver를 작성한 다음, 한 번에 모아서 스키마를 만들 때 넘겨주고 있다.

```ts
// /src/pages/users/resolvers/index.ts
import { usersMutationResolvers } from './users.mutation';
import { usersQueryResolvers } from './users.query';
import { userSchemaResolver } from './users.schema';
import type {
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
} from '../../../@types/generated/resolversTypes';
import type { EnumField } from '../../../@types/type.graphql';

const resolvers: {
  Query: Partial<QueryResolvers>;
  Mutation: Partial<MutationResolvers>;
  User: Partial<UserResolvers>;
  AllowedStatus: EnumField;
  CertificationType: EnumField;
} = {
  Query: usersQueryResolvers,
  Mutation: usersMutationResolvers,
  ...userSchemaResolver,
};

export default resolvers;

// /src/client.graphql.ts
import usersResolver from './pages/users/resolvers';

const schema = makeExecutableSchema({
  typeDefs: print(typeDefs),
  resolvers: [
    ...
    usersResolver,
    ...
  ],
});
```

[아폴로 클라이언트의 resolver](https://www.apollographql.com/docs/apollo-server/data/resolvers)는 크게 Query Resolver, Mutation Resolver, Schema Resolver로 나누어 작성하고 있는데, 각각에 대해 살펴보겠다.

#### 4-1. Query Resolver

기본적으로 클라이언트가 특정 필드에 대한 쿼리를 요청할 때의 처리를 담당한다. RESTful API의 GET 요청을 담당하는 곳이라고 생각하면 되는데 구체적으로는 아폴로 클라이언트 초기화시 선언한 link에 context로 넘겨준 fetcher를 이용해서 실제 query 요청을 보내는 역할을 한다.

그외에도 다음의 역할들을 수행한다.

레거시 API로 요청을 보내기 위해, 새로운 컨벤션으로 작성된 값들을 API가 요구하는 스펙에 맞게 조정하여 API 요청을 보낸다.

```ts
export const usersQueryResolvers: Partial<QueryResolvers> = {
  users: async (_, args, context) => {
    const { page = 1, limit = 15, searchType, keyword, userTypes } = args;
    // queryString을 레거시 API 스펙에 맞게 조정한다.
    const queryString = stringifyQueryObject({
      page,
      limit,
      s_type: searchType,
      s: keyword,
      userTypes: userTypes?.join(','),
    });

    // 실제 API 요청
    const apiResponse = await context.graphqlFetcherForV2.get<{
      totalCount: number;
      users: User[];
    }>(`/users?${queryString}`);

    // API 응답을 새 프론트엔드 코드에 맞게 변환
    const pageInfo = generatePageInfo({
      responseEntity: apiResponse,
      size: limit ?? 15,
      pageNumber: page ?? 1,
    });

    if (isNil(pageInfo)) {
      throw new Error('Invalid list type response from admin API.');
    }

    return {
      ...pageInfo,
      nodes: apiResponse.users,
    };
  },
};
```

여러 가지 데이터를 여러 API에 요청하는 로직을 UI 컴포넌트로부터 분리할 수 있다.

- as-is:

  ```tsx
  // UI Component
  const { data1 } = useQuery(user);
  const { data2 } = useQuery(admin);
  const { data3 } = useQuery(lecturer);

  if (isNil(data1) || isNil(data2) || isNil(data3)) {
    return null;
  }

  return <View />;
  ```

- to-be:

  ```tsx
  // resolver
  export const dataQueryResolvers: Partial<QueryResolvers> = {
    data: async (_, args, context) => {
      const apiResponse1 = await context.fetcher.get(user);
      const apiResponse2 = await context.fetcher.get(admin);
      const apiResponse3 = await context.fetcher.get(lecturer);

      const result = [...apiResponse1, ...apiResponse2, ...apiResponse3];

      if (isNil(result)) {
        throw new Error();
      }

      return {
        nodes: result,
      };
    },
  };

  // UI Component
  const { data } = useQuery(fragmentDoc);

  if (isNil(data)) {
    return null;
  }

  return <View />;
  ```

#### 4-2. Mutation Resolver

RESTful API의 POST, PUT 등을 떠올리면 된다. Mutation 요청을 보내는 역할을 한다. 개발 팀의 모던 컨벤션 camel case 값들을 레거시 API 스펙인 snake case로 맵핑하거나 새로운 프론트엔드 코드에서 좀 더 인지하기 쉬운 이름으로 사용했던 변수들을 API 스펙에 맞게 할당하는 역할도 한다.

```ts
import type {
  RemoveUserPayload,
  User,
} from '../../../@types/generated/graphql';
import type { MutationResolvers } from '../../../@types/generated/resolversTypes';

export const usersMutationResolvers: Partial<MutationResolvers> = {
  updateUserPoint: async (_, args, context) => {
    const { userId, initialPoint, willUpdatePoint } = args.input;
    const apiResponse = await context.graphqlFetcherForV1.post<{
      result: { userId: number; point: number };
    }>('/admin/points', {
      // 의미를 명확히 알 수 있는 이름의 변수로 사용했던 것을 레거시 API 스펙에 맞게 할당
      cur_point: initialPoint,
      // 카멜 케이스를 스네이크 케이스로 변환
      user_id: userId,
      value: willUpdatePoint,
    });

    return {
      userId: apiResponse.result.userId,
      point: apiResponse.result.point,
    };
  },
};
```

#### 4-3. Schema Resolver

GraphQL 스키마에서 선언한 객체 key와 다른 이름의 property가 API 응답으로 올 경우, 해당 부분을 맵핑하는 역할을 한다.

예를 들어, 레거시 API의 응답값 중 가장 이해가 안되는 부분으로 `_` 라는 프로퍼티가 있었다. 이 값은 중첩된 객체로 존재할 수 있었는데 이름만 봐서는 무슨 데이터인지 상위 객체와 무슨 관계인지 알기 어려웠다.

때문에 마이그레이션 할 때에는 무슨 관계인지, 어떤 값인지 파악하여 `_` 안의 프로퍼티들의 이름을 수정하고 `_`를 해체하여 1 depth의 객체로 수정했다.

```tsx
Instructor: {
    courseCount: (parent) => {
      // `_` 해체
      const courseCount = retrieveValueFromPath(parent, 'additionalProperty.courseCNT');

      if (typeof courseCount === 'number' && isInteger(courseCount)) {
        return courseCount;
      }

      throw new Error('instructor.additionalProperty.courseCNT is not a string.');
    },
  },
```

다만 `_`가 특정 라이브러리에 의해 `''`로 바뀌는 이슈가 있어서 `fetch` API를 추상화한 Fetcher에서 `additionalProperty` 라는 이름으로 먼저 변환한 다음 위 작업을 수행했다. 참고로 API의 응답값이 다 스네이크 케이스라서 카멜 케이스로 일괄 변환하는 작업도 Fetcher에서 수행한다.

```ts
// _를 additionalProperty로 변환
if (isRecordType(parent) && key === '_') {
  parent['additionalProperty'] = parent['_'];
}

// 스네이크 케이스를 카멜 케이스로 변환
return humps.camelizeKeys(data) as unknown as T;
```

API 응답의 key 이름을 변경하는 작업도 Schema resolver에서 수행한다.

```tsx
// lecturerEmail를 instructorEmail로 변경
Instructor: {
    instructorEmail: (parent) => {
      const instructorEmail = retrieveValueFromPath(
        parent,
        'additionalProperty.lecturer.lecturerEmail'
      );

      if (typeof instructorEmail === 'string') {
        return instructorEmail;
      }

      throw new Error('instructor.additionalProperty.lecturer. lecturerEmail is not a string.');
    },
  },
```

enum 매핑도 Schema resolver에서 수행한다.

```tsx
import { CertificationType } from '../../../@types/generated/graphql';

User: {
  AllowedStatus: {
    allowed: true,
    notAllowed: false,
  },
  CertificationType: {
    [CertificationType.SIGNUP]: 'signup',
    [CertificationType.CHANGE_PASSWORD]: 'change_password',
  },
}
```

여기까지 하면 [위에서](#1-아폴로-클라이언트-설정) 얘기했던 SchemaLink에 넘겨줄 스키마를 생성하기 위한 준비를 모두 마치게 된다.

```ts
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema }),
});
```

이렇게 아폴로 클라이언트를 이용한 Client side GraphQL 구축이 마무리되었다.

이제 실제 어드민 개발을 시작하여 컴포넌트를 작성하고 아폴로의 `useQuery` 등을 이용해서 컴포넌트에 필요한 데이터를 요청할 차례이다. 이를 위한 커스텀 훅이나 타입을 작성하는 등의 작업이 필요한데, GraphQL code generator를 사용하면 이 과정을 자동화할 수 있다. 다음 단계로 GraphQL code generator를 사용하기 위한 설정을 살펴보겠다.

## GraphQL code generator 설정

[GraphQL code generator](https://github.com/dotansimha/graphql-code-generator)는 스키마를 기반으로 여러 코드를 자동으로 만들어 준다. 실제 컴포넌트 개발 시에는 코드 제너레이터가 만들어준 여러 코드를 가지고 개발하면 된다. 수동으로 뭔가를 작성할 일은 스키마를 작성하는 것 말고는 거의 없었다.

![코드 제너레이터로 생성된 파일들](https://github.com/emewjin/emewjin.github.io/assets/76927618/c56c3002-95e0-4c34-ab18-5bbe6d13c95c)

[기본적인 설정](https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config)은 다음과 같다.

```ts
import type { CodegenConfig } from '@graphql-codegen/cli';

export const defaultConfig: CodegenConfig = {
  // 필수값: 스키마를 가져올 곳. GraphQL 엔드포인트 URL 혹은 로컬 .graphql 파일 경로.
  schema: 'schema.graphql',
  // 필수값: key는 생성된 코드의 경로를 의미, value는 관련 옵션
  generates: {
    // 후술
  },
  overwrite: true,
  documents: ['src/**/*.graphql'],
  ignoreNoDocuments: true,
};
```

`generates`에서는 크게 `preset`과 `plugin`을 이용해 설정할 수 있다. 어드민 프로젝트에서는 다음과 같이 설정되어 있다.

- presets

  - [**client**](https://the-guild.dev/graphql/codegen/plugins/presets/preset-client): 아폴로 클라이언트와 완벽히 통합되는 GraphQL operation을 제공한다. enum, GraphQL type, fragment, response 등 모든 타입을 생성한다.
    ```ts
    // 생성될 경로
    'src/@types/generated/': {
      preset: 'client',
      config: {
        skipTypename: false,
        useTypeImports: true,
        avoidOptionals: true,
        strictScalars: true,
        defaultScalarType: 'unknown',
        namingConvention: {
          enumValues: 'change-case-all#constantCase',
        },
        scalars: {
          DateTime: 'string',
        },
      },
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' },
      },
    },
    ```
  - [**import-types**](https://the-guild.dev/graphql/codegen/plugins/presets/import-types-preset)
    ```ts
    'src/@types/generated/resolversTypes.ts': {
      preset: 'import-types',
      presetConfig: {
        typesPath: './graphql',
      },
      ...
    },
    ```

- plugins
  - [**fragment-matcher**](https://the-guild.dev/graphql/codegen/plugins/other/fragment-matcher): 아폴로 클라이언트를 사용하고 있고 스키마가 `interface` 혹은 `union` 선언을 포함하고 있는 경우 아폴로의 [possibleTypes](https://www.apollographql.com/docs/react/data/fragments/#defining-possibletypes-manually)를 사용하여 결과에 대한 유효성 검증 및 정확한 fragment 일치 여부를 검증하는 것이 권장된다. 이 작업을 하기 위해 필요한 json 파일을 자동으로 생성해 주는 플러그인이다.
    ```ts
    'src/@types/generated/possibleTypes.json': {
      plugins: ['fragment-matcher'],
    },
    ```
  - [**typescript-apollo-client-helpers**](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-apollo-client-helpers): Local cache 관리를 위한 [type policies](https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields)에 대한 타입을 자동으로 생성해 주는 플러그인이다.
    ```ts
    'src/@types/generated/typePolicies-helper.ts': {
      plugins: ['typescript-apollo-client-helpers'],
      config: {
        useTypeImports: true,
      },
    },
    ```
  - [**typescript-resolvers**](https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-resolvers): resolver를 선언할 때 필요한 타입을 자동으로 생성해 주는 플러그인이다.
    ```ts
    plugins: ['typescript-resolvers'],
      config: {
        skipTypename: false,
        useTypeImports: true,
        avoidOptionals: true,
        strictScalars: true,
        defaultScalarType: 'unknown',
        namingConvention: {
          enumValues: 'change-case-all#constantCase',
        },
        scalars: {
          DateTime: 'string',
        },
        contextType: '../type.graphql#Context',
      },
    ```

## Relay 스타일 지향하기

GraphQL을 사용하기 위한 모든 준비를 마쳤다. 마지막으로 소개할 내용은 어드민 프로젝트가 Relay 스타일을 지향하고자 했다는 점이다. Relay가 아닌 Apollo를 사용하기 때문에 엄격하게 Relay 스타일을 구현할 수는 없었지만 최대한 지향하고자 했다.

### 한계: 진짜(?) Relay 스타일과 다른 점

- Relay가 아닌 Apollo를 쓰는지라 컴파일러가 없고, 컴파일러가 대신 해줄 수 없어 **휴먼 리소스**로 주의해야 한다.
  1.  페이지의 첫 렌더링에 필요한 data fetching은 각 컴포넌트 트리의 root에서만 한다
  2.  fragment의 이름은 컴포넌트 이름을 접두사로 붙인다
  3.  같은 타입이라도 컴포넌트마다 fragment를 각각 둔다.
  4.  각 컴포넌트는 GraphQL data를 prop으로 받지 않는다.
- Relay 스타일에서는 fragment를 컴포넌트 파일 안에 같이 작성해야 한다. 그러나 node GraphQL 패키지의 스키마 병합 함수를 사용하기 위해서는 그렇게 작성할 수 없어서 fragment는 컴포넌트와 분리된 별도의 파일에 작성해주어야 했다.

### 이점

1.  캡슐화 data masking
    1.  내가 필요한 데이터를 선언할 수 있다.
    2.  컴포넌트에서 필요한 데이터에만 접근할 수 있다.
2.  over-fetching 방지
    1.  중복되는 fragment는 알아서 merge해서 한 번의 요청만 보낸다
3.  component의 prop 동기화 방지
    1.  A에서 사용된 User가 Profile이라는 새로운 prop을 추가했을 경우 B에서 쓰던 User가 profile이 필요없음에도 영향을 받는 부분

## 앞으로의 과제

### mutation API response 개선

레거시 API는 mutation에 대한 응답을 다음과 같이 내려주는데

`{ ok: boolean }`

이것만으로는 실제 mutation에 성공한 것인지 알 수가 없다. 실제로 업데이트는 실패했지만, 응답은 성공했다는 의미의 `ok: true`가 내려온 사례가 있었다.
GraphQL 명세를 따르자면 mutation에 성공한 값을 함께 반환해야 하므로 개선이 필요한 부분이다.

## 참고문서

- [[GraphQL] SchemaLink 사용법 - 서버없는 클라이언트](https://www.daleseo.com/graphql-apollo-link-schema/)
- [React에서 GraphQL Code Generator 활용하기](https://medium.com/sixshop/react%EC%97%90%EC%84%9C-graphql-code-generator-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0-a16e3235b60)
- [GraphQL without a server](https://github.com/hasura/client-side-graphql)
- [Apollo Client (React)](https://www.apollographql.com/docs/react)
