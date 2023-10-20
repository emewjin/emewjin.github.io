---
title: 'GraphQL 위키'
date: 2022-05-29
lastUpdated: 2022-05-29
tags: [GraphQL]
---

회사에서 레거시 어드민을 개편하면서 프론트선에서 기존 ORM 들을 `res.json` 으로 간단하게 API로 만들고 거기에 graphQL을 활용하기로 했다. 그래서 공부하는 graphQL.

[예제코드 저장소](https://github.com/emewjin/tweetql)

## graphQL 등장 배경

graphQL은 REST API의 문제를 해결하기 위해 등장했다고 알려져있다.

1. over-fetching  
   REST API는 필요하지 않은 정보도 백엔드에서 프론트엔드로 전달해주는데 이게 비효율적이라는 이야기이다. 예를 들어 프론트엔드에서는 company의 title, url만 필요한데 백엔드에서는 두 필드 뿐 아니라 직원수, 설립일, 주소, 평균연봉, 퇴사율, 입사율 등등 필요없는 필드까지 다 넘겨준다는 것이다.  
   graphQL에서는 title, url만 보내달라고 요청하기 때문에 필요한 필드만 응답으로 받을 수 있다.
2. under-fetching  
   한 api에서 필요한 정보를 전부 주지 않아 2번 이상의 api 요청을 해야하는 것을 말한다. 예를 들어 company 리스트를 조회하는 api에서 응답으로 준게 company id 뿐이라면, 각 company의 상세 정보를 조회하기 위해 company 상세정보를 조회하는 api에 id를 이용해 요청을 보내야 한다는 것이다.  
   graphQL에서는 single request에 다양한 resource를 응답하는 것으로 이 문제를 해결했다.

REST api와는 url의 집합이 아닌 data의 type의 집합이라는 차이점이 있다.

## 장점

- Root를 보면 리소스 모두 타입을 가지고 있어 그 자체로 명세가 되고 이해하기 쉬움.
- 타입 지원을 받을 수 있음.
- over fetching, under fetching 해결 가능

## 단점

## 문법

### gql

- gql `SDL` : schema definition language의 약자로, gql에게 data shape을 설명하기 위함
  - 반드시 Query root type이 있어야 함.
  - 모든 필드는 기본적으로 nullable
- `[Type]` : 배열(리스트)를 의미
- `!`: required를 의미
  - arg에 붙으면 필수 인자, return 값에 붙으면 non-nullable을 의미
  - required arg를 넘기지 않으면 `Field "tweet" argument "id" of type "ID!" is required, but it was not provided.` 에러 발생
  - return type이 ! 인데 resolver가 없으면 `"message": "Cannot return null for non-nullable field Query.tweet."` 에러 발생
- REST API를 기준으로 생각했을 때
  - GET : `type Query`
  - POST, DELETE, PUT과 같이 mutate하는 모든 것들 : `type Mutation`
- Scalar type : graphql 내장 타입. String, Int, Boolean, ID 등등이 있다.

**Operation**

```gql
query ExampleQuery {
  allTweets {
    id
  }
  tweet(id: "2") {
    text
  }
}

mutation {
  postTweet {
    id
  }
}
```

### resolver

- 모든 타입의 모든 필드에 대해 작성 가능
- 연산 및 유사 join 가능

## 문서화

거의 대부분의 graphQL 클라이언트들이 문서를 지원하고 있음.

![image](https://user-images.githubusercontent.com/76927618/170818386-8c1df94c-f2f1-4594-b742-46158e8974f7.png)

## REST -> GraphQL 래핑

- FE에서는 GraphQL을, BE에서는 REST를 쓰고 싶을 때
- 기존재하는 REST api를 GraphQL로 쓰고 싶을 때

아주 작은 GraphQL 서버를 쓰거나 express 서버 최상단에 apollo를 두고 REST api를 GraphQL로 변환할 수 있다.

type, field를 하나하나 다 선언해주어야 하는데 매우 귀찮아보임. 대신해주는 툴이 분명히 있을듯...  
그리고 resolver에서 fetch해서 그 응답값을 반환하도록 래핑하는 것.

## error 처리

## Cache

아폴로 클라이언트는 type과 id로 데이터 entity를 생성한다. 만약 gql에 새로운 필드를 추가해 요청해도,새로운 데이터 또한 새로 생성되는 게 아니라 캐싱된 entity안에 추가된다.

## Devtool

apollo에서 크롬 익스텐션을 지원하기 때문에 다음과 같이 어떤 쿼리가 실행되었는지 추적할 수 있다.
![image](https://user-images.githubusercontent.com/76927618/170827861-96c6582f-7c24-4101-b27b-f9438bb5b61d.png)

```gql
const GET_ALL_MOVIES = gql`
  {
    allMovies {
      title
      id
    }
  }
`;
```

이렇게 쿼리에 이름을 지어주지 않으면 이미지에서처럼 Unnamed라고 나오니 지어주는 편이 디버깅하기에 좋다.
