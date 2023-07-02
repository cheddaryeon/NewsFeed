# 🛒 Buy Or Not - 알뜰살뜰 살말 사이트 (2023. 7)
- 내 게시물을 포함한 모든 게시물을 볼 수 있는 공간인 <b>뉴스피드</b>를 구현하는 프로젝트

- <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"> <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white"> <img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white"> <img src="https://img.shields.io/badge/React Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white">
<br />

# 👩‍👩‍👧‍👧 Unluncky7(7조) 팀원 소개
역할|이름|GitHub|
---|---|---|
팀장/FE|최다연|https://github.com/cheddaryeon|
팀원/FE|이안진|https://github.com/AJ3504|
팀원/FE|조유이|https://github.com/yui62yui|
팀원/FE|박지원|https://github.com/xoxojw|

<br />

# 🗒️ 목차
1. 프로젝트 개요
2. 프로젝트 기능
3. 프로젝트 사이트 구현 화면

---

## 1. 📒 프로젝트 개요
* 프로젝트명 : 알뜰살뜰 살말 검증 프로젝트
* 프로젝트 목적&기능 : 제품의 구매 여부를 평가 받을 수 있는 커뮤니티
<br/> ex) 거지방 : 기존 채팅방 형식으로 간단히 검증을 주고 받는 것에서 멈추지 않고, 게시물 형식으로 이를 정리하여, 남이 미리 검증 받은 물품도 확인할 수 있도록 함.

<br />

## 2. ⚙️ 프로젝트 기능
### 2-1) 🩵 헤더
- 홈버튼 구현
- 비로그인 시 로그인&회원가입 버튼 조회 / 로그인 시 마이 프로필 조회 (클릭 시 프로필 상세페이지 이동)
### 2-2) 메인페이지
- 새로운 결재 요청하기: 글 작성 버튼
- 결재 검토하기: 상세페이지 진입 버튼
- 위 버튼들은 로그인 시에만 정상 작동
- 데이터들을 등록 시간 기준 내림차순으로 정렬하여 리스트업
### 2-3) 새로운 결재 요청하기
- form/input/button 태그를 이용해 데이터를 입력, 제출한 후 `Firebase`에 저장
- 이미지 저장 기능
- (~여기 추가해 주세요~) 글 작성 시 Id, Writer Name, Contents Number 등을 `Firebase`에 자동 저장
### 2-4) 결재 검토하기
- 글 작성시 `Firebase`에 저장된 데이터를 불러와 같은 id를 가진 상세페이지를 조회
- 글쓴이가 입력한 결재 품목 / 가격 / 결재 희망 사유를 불러옴
- 자신의 글에 한하여 수정/삭제 기능 구현 (Writer Id 불일치 시 불가능)
- 타인이 결재 허가/거절 선택 후 결재 의견을 입력 가능
### 2-6) 로그인/회원가입
- `E-mail/password`, `Google` 두 가지 방식으로 회원가입 및 로그인 가능하도록 구현
- 회원가입 및 로그인 시 UX 측면 고려하여 에러 메시지 핸들링
  - (`이미 가입된 이메일입니다`, `비밀번호와 비밀번호 확인이 일치하지 않습니다`, `가입된 이메일이 아닙니다`, `이메일과 비밀번호가 일치하지 않습니다` 등)
- E-mail 가입 시 `비밀번호 찾기` 가능 - 가입한 이메일로 비밀번호 재설정 메일 전송
  - 가입되지 않은 이메일로 비밀번호 찾기 시 `가입된 이메일이 아닙니다` 에러메시지 출력 
### 2-7) 마이 페이지
- 로그인 후 헤더의 우측 상단 본인의 닉네임을 클릭하여 마이페이지로 이동 가능
- Google 로그인 시, 구글 계정에 등록된 프로필사진/닉네임 자동 불러오기
- 프로필 사진 변경, 닉네임 변경, 비밀번호 변경 및 검증 기능
- 내가 쓴 글 모아보기 기능

<br />

## 3. 🖼️ 프로젝트 사이트 구현 화면
### 3-1) 메인페이지 (전체 게시글 목록)
![1 mainpage](https://github.com/cheddaryeon/NewsFeed/assets/124491335/36576c51-fa48-48b4-aac9-0edfefae2169)

### 3-2) 로그인/회원가입
![2 login](https://github.com/cheddaryeon/NewsFeed/assets/124491335/c25be533-d2c3-43d3-a84d-e3619a107e12)
![3 signup](https://github.com/cheddaryeon/NewsFeed/assets/124491335/9b4486cb-6345-45b2-946b-6d86ae9e7302)

### 3-3) 게시글 상세페이지
![4 content](https://github.com/cheddaryeon/NewsFeed/assets/124491335/601f852c-ede3-41bc-98ba-a667b6f242e5)

### 3-4) 댓글 작성 및 해당글에 달린 댓글 목록 조회
![5 comment](https://github.com/cheddaryeon/NewsFeed/assets/124491335/247d94f9-2e6a-49e3-b92b-4826c8e5dbf8)

### 3-5) 마이 프로필
![6 myprofile](https://github.com/cheddaryeon/NewsFeed/assets/124491335/897dfa95-6fe1-4c03-88b9-e9dde785a539)
