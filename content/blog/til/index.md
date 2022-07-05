---
title: 'Today I Learned'
date: 2022-07-05
lastUpdated: 2022-07-05
description: '작고 사소한 개발 지식'
tags: [Typescript]
---

## 220705

import path 단축하기

```ts
// package.json

"baseUrl": ".",
"paths": {
  "@libs/*": ["libs/*"]
}

// usage
import something from '@libs/server/handler';
```
