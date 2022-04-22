---
title: 'VSC 단축키 vs Webstorm 단축키'
date: 2022-02-06
lastUpdated: 2022-02-06
description: '웹스톰 도전기...를 쓰기 전에 일단 단축키 부터 익숙해져야겠다'
tags: [Webstorm, VSC, IDE]
---

계속 VSC만 쓰다가, 웹스톰이 리팩토링 기능이나 보다 더 안전한 파일 삭제,변경,이동을 지원하는 것 같아서 써보려고 했는데...  
리팩토링 기능이고 뭐고 단축키에서부터 막혀버렸다 ㅠㅠ  
그래서 내가 다시 보려고 기록하는 VSC 단축키 웹스톰 버전.

> 웹스톰에서 VSC 단축키 버전으로 쓸 수 있기도 한데, 팀원이나 구글링의 도움을 받기에는 웹스톰 기본 단축키맵이 유리할 것 같아서 도전...

> VSC에서처럼 웹스톰에서도 단축키를 직접 입력해서 단축키를 검색할 수도 있다. 아래 이미지의 노란색 테두리 검색창에 단축키를 입력하면 된다.
> ![image](https://user-images.githubusercontent.com/76927618/152672935-dc8c002a-9383-4b1c-b290-67e57c54e17c.png)

## 단축키 내용 기준

| 단축키 내용                          | VSC                      | Webstorm                                |
| ------------------------------------ | ------------------------ | --------------------------------------- |
| import문 정리                        | Command + Shift + O      | Control + Option + O                    |
| 프로젝트 패널 토글                   | Command + B              | Command + 1                             |
| 열려있는 탭 이동                     | Commnad + Shift + [ or ] | Commnad + Shift + [ or ]                |
| 선택한 줄을 위/아래로 이동           | Option + up/down         | Shift + Option + up/down                |
| 커서가 위치한 줄 삭제                | Command + Shift + Delete | Command + Delete                        |
| 터미널 토글                          | Command + J              | Option + f12                            |
| 새 폴더 생성                         | ?                        | Command + Shift + N <br/> (사용자 지정) |
| **수정된 적 없는** 탭 닫기           | ?                        | Command + Shift + W                     |
| 최근 탐색한 파일을 코드구문으로 보기 | ?                        | Command + Shift + E                     |

## 단축키 커맨드 기준

| 단축키 커맨드            | VSC                        | Webstorm                   |
| ------------------------ | -------------------------- | -------------------------- |
| Command + [ or ]         | 들여쓰기                   | 탐색                       |
| Shift + Option + up/down | 선택한 줄을 위/아래로 복사 | 선택한 줄을 위/아래로 이동 |
| Command + Shift + L      | 선택한 단어 전체 선택      |                            |
| Command + S              | 문서 저장                  | 모두 저장                  |
| Command + F              | 전체 파일에서 찾기         | 전체 파일에서 찾기         |

Command + S 때문에 좀 많이 헤맸는데, 웹스톰에서 파일 저장시 lint fix나 prettier 포맷팅을 하게 하려면 '모두 저장'을 해야 한다.  
그런데 만약 vsc 키맵으로 웹스톰을 이용중이라면 커맨드 S가 '문서 저장'으로 되어 있어, 아무리 해도 prettier 포맷팅이 안될 것이다.  
'모두 저장'으로 단축키 설정을 바꿔주던지, 기본 키맵을 쓰던지... 하면 된다 ㅎㅎ;;

## 그 외 유용한 단축키

**import 한 번에 하기**  
vsc에선 리팩토링 기능으로 하나하나 했었고, 이렇게 전체 한번에 해주는 단축키가 있는진 잘 모르겠다.
![image](https://user-images.githubusercontent.com/76927618/152673414-a6a0cc4f-98f0-4a90-b066-f8b936b61ede.png)

## 기타 셋팅

### 자동 줄바꿈

탭을 여러개 열어 두고 화면 분할해서 쓰는 편인데, 이때 화면 크기에 따라 자동으로 줄바꿈이 되어야 편리하다. 웹스톰에서도 코드 한 줄이 길어지면 가로 스크롤이 생기는 대신, 아래 설정창과 같이 설정하면 화면 크기에 맞게 라인 피드를 해줄 수 있다.  
![image](https://user-images.githubusercontent.com/76927618/152682574-e1695442-7b37-44ef-9ed2-a27ee8bd96ac.png)

### 프로젝트 탭 설정

현재 보고 있는 파일 위치로 따라가게 하기, 한 번 클릭으로 파일 열기
![image](https://user-images.githubusercontent.com/76927618/153884437-7bd957fb-812e-49c2-bb40-a33c91d32c08.png)
