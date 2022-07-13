---
title: 타입가드
date: 2021-12-19
lastUpdated: 2022-07-13
description: '내가 기억하기 위한 타입가드 활용 사례'
tags: [Typescript]
---

## 타입가드 사례 1

### 문제상황

```ts
const [currentRadioValue, setCurrentRadioValue] =
  useState<AgreementMarketingStatus>();

// ...

const onChangeMarketing: ChangeEventHandler<HTMLInputElement> = ({
  target: { value },
}) => {
  isInit.current = false;
  setCurrentRadioValue(value); // 'string' 형식의 인수는 'SetStateAction<AgreementMarketingStatus | undefined>' 형식의 매개 변수에 할당될 수 없습니다.ts(2345)
};
```

이벤트 핸들러에서 뽑아온 event.target.value가 string이기 때문에 발생.
string을 내가 따로 정의한 타입으로 좁혀주어야 함.
이러한 목적으로 타입가드를 이용한다.

참고문헌 : https://www.qualdesk.com/blog/2021/type-guard-for-string-union-types-typescript/

### 해결

```ts
export const AGREEMENT_MARKETING_STATUSES = ['AGREE', 'DISAGREE'] as const;
export type AgreementMarketingStatus =
  typeof AGREEMENT_MARKETING_STATUSES[number];

const onChangeMarketing: ChangeEventHandler<HTMLInputElement> = ({
  target: { value },
}) => {
  isInit.current = false;

  if (!isAgreementMarketingStatus(value)) {
    window.alert('선택된 마케팅 수신 동의 값이 유효하지 않습니다');
    throw new Error('선택된 마케팅 수신 동의 값이 유효하지 않습니다');
  }

  setCurrentRadioValue(value);
};

function isAgreementMarketingStatus(
  value: string
): value is AgreementMarketingStatus {
  return AGREEMENT_MARKETING_STATUSES.includes(
    value as AgreementMarketingStatus
  );
}
```

## 타입가드 사례 2

### 문제상황

vite 환경설정에서 환경변수에 따라 서로 다른 url을 base로 지정해야 하는데, **좀 더 안전하게** 환경변수를 타입으로 체크하고자 함.

### 해결

```ts
type Mode = 'localhost' | 'development' | 'production';

// point1: Record<Mode, string>
const baseUrlLookup: Record<Mode, string> = {
  localhost: '',
  development: '',
  production: '',
};

// point2: mode is Mode
const isEnvironmentMode = (mode: string): mode is Mode =>
  Object.keys(baseUrlLookup).includes(mode);

// usage
// point3: mode에 담긴 문자열이 Mode 중 하나이면 그에 맞는 url을 찾고, 아니라면 일괄적으로 localhost로 대응하게 한다.
// 이렇게 하면 혹시라도 mode에 이상한 문자열이 들어오더라도 대응이 된다.
base: isEnvironmentMode(mode)
  ? baseUrlLookup[mode]
  : baseUrlLookup['localhost'];
```
