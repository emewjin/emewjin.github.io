---
title: gh 여러 계정 사용하기
description: git cli 툴인 gh로 여러 계정을 간편하게 왔다갔다 해보자
date: 2022-09-26
lastUpdated: 2023-12-18
tags: [gh, dx]
---

드 디 어 !!!!!!!!!!!!!!!  
[버전 2.40.0](https://github.com/cli/cli/releases/tag/v2.40.0)에서 공식적으로 multi account를 지원한다 끼얏호~~~~~~

아주 간단하게

1. 버전 업데이트를 하고 (나는 brew로 설치했어서 brew로 업데이트)
2. 현재 로그인 되어있는 계정을 확인 후 (`gh auth status`)
3. `gh auth login`으로 스위칭할 계정에 로그인하여 계정을 추가하고
4. `gh auth status`에 잘 추가되어있나 확인한 다음
5. `gh auth switch`를 실행시켜보면

짜자잔~
![gh multi account 성공 모습](https://github.com/emewjin/emewjin.github.io/assets/76927618/cab04f95-f2d9-4eab-a632-5fc2da3fe4b5)

그동안 커뮤니티에서 공유되던 방법들은 되다 안되다 했어서 너무 불편했는데, 정식으로 지원하는 기능이 되어서 너무너무 행복하다... 🫠

---

> 여기서부터는 multi account 정식 지원 전, 2022년에 작성된 글입니다.

[github cli 툴인 `gh`](https://cli.github.com/)는 아직 공식적으로 multi account를 지원하지 않는데, 니즈는 엄청나다.  
[>> 관련해서 오픈되어 있는 이슈](https://github.com/cli/cli/issues/326)

이슈의 쓰레드를 쭉 읽어보다가 `gh`의 alias를 이용한 [요 댓글](https://github.com/cli/cli/issues/326#issuecomment-1095018771)의 솔루션이 가장 깔끔하고 간편하길래 써봤는데 아주 잘 됨. 이제 간단하게 회사 계정과 개인 계정을 `gh`로 왔다갔다 할 수 있다... 🥹

아래는 [yermulnik의 솔루션](https://gist.github.com/yermulnik/017837c01879ed3c7489cc7cf749ae47) 한국어 버전쯤...?

1. 먼저 gh config 디렉토리로 이동한다.

   ```sh
   ~/.config/gh
   ```

2. 해당 디렉토리에서 계정별 hosts.yml을 생성한다.
   yml뒤에 붙는 문자는 personal, work, 뭐든 어떤 계정인지 식별할 수 있는 이름을 붙이면 됨. 이 식별자는 밑에서 alias로 쓰일 것.
   ```sh
   # touch hosts.yml.{식별자}
   touch hosts.yml.personal
   ```
3. 생성한 hosts.yml을 열고
   ```sh
   vi hosts.yml.personal
   ```
4. 아래 내용을 작성한다.
   ```sh
   github.com:
       oauth_token: [your token]
       git_protocol: [ssh 또는 https]
       user: [github username]
   ```
5. 그리고 `gh`의 alias를 설정한다.
   ```sh
   # gh alias set --shell {식별자} 'cp ~/.config/gh/hosts.yml.{식별자} ~/.config/gh/hosts.yml && gh auth status'
   gh alias set --shell personal 'cp ~/.config/gh/hosts.yml.personal ~/.config/gh/hosts.yml && gh auth status'
   ```

이제 필요할 때 alias를 입력하면 미리 설정해둔 계정으로 로그인된다.

```sh
> gh personal
github.com
  ✓ Logged in to github.com as
  ✓ Git operations for github.com configured to use
  ✓ Token:
```
