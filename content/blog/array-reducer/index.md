---
title: Javascript Array reduce 응용 기록지
date: 2022-04-08
lastUpdated: 2022-04-08
description: 'Javascript Array reduce를 정복하는 그날까지~~~~~~'
tags: [Javascript]
---

객체를 원하는 형태로 자유자재로 조립하고 분해할 줄 알아야 하는 입장에서 reduce 메소드를 잘 다루어야 한다는 것은 알지만... 실제 실무에서 (이 글을 쓰는 시점 = 경력 6개월차) 활용할 일은 많이 없었었다. 

그래서 (라고 변명중) reduce 메소드의 응용이 아직도 어렵지만 ㅠ_ㅠ 오늘 실무에서 처음으로 써봐서, 실무에서의 사례를 하나씩 모아볼까 한다.

## 프로퍼티를 기준으로 객체 합치기

> 객체로 이루어진 배열에서, id가 같은 객체들을 한 객체로 묶고, value, key를 data라는 프로퍼티 안의 객체 속에 [key]: value 형태로 모으고 싶었다.

`reduce` 메소드 하나만 가지고 해결해야한다는 사고에 갇혀서 낑낑대다가 어느 천재의 조언을 보고 완성한 로직. 왜 `reduce`만 사용해야 한다고 생각했을까? 키값이 뭐가 되든 value값만 원하는대로 조립하고나면 `Object.values`로 뽑으면 그만이다 🥳


```js
const arr = [{id: 1, value: 1, key: 'email'},{id: 1, value: 1, key: 'status'},{id: 2, value: 2, key: 'email'},{id: 2, value: 2, key: 'status'},{id: 3, value: 3, key: 'email'},{id: 3,value: 3, key: 'status'}];


const result = arr.reduce((acc, curr) => {
  const { key, id, value } = curr;
  

  if(!acc[id]) {
    acc[id] = {
      id: id,
      data: {
        [key]: value
      }
    }
  }

  acc[id].data = {
    ...acc[id].data,
    [key]: value,
  }

  return acc;
}, {});

console.log(result)
// {
//   '1': { id: 1, data: { email: 1, status: 1 } },
//   '2': { id: 2, data: { email: 2, status: 2 } },
//   '3': { id: 3, data: { email: 3, status: 3 } }
// }

console.log(Object.values(result));
// [
//   { id: 1, data: { email: 1, status: 1 } },
//   { id: 2, data: { email: 2, status: 2 } },
//   { id: 3, data: { email: 3, status: 3 } }
// ]
```