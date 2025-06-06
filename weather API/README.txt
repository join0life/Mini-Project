프로젝트명: Weather API로 날씨 웹/앱 만들기

<주요 기능>
- 도시명으로 검색
- 현재 기온/미래의 평균 기온 확인
- 다크모드 구현

<유의사항>
- axios 서드파티 모듈 호출 + vite
- axiosAPI.js는 API 요청만 책임(에러 등의 처리는 mainAPI.js로 throw)지고 mainAPI.js는 사용자 피드백, 로깅 등을 처리
- keydown 이벤트는 input 요소에서만 제대로 동작(div, button인 경우 동작하지 않음)
- .env 파일에 API key 숨기기
- 에러 알림은 이후에 모달이나 커스텀 메시지로 수정

<3줄 회고>
1. 모바일에 맞춘 페이지는 모바일 퍼스트Mobile First로 CSS 구성
3. API를 불러올 땐 어떤 파라미터로 어떤 데이터를 요청할 수 있는지 구상하기
4. HTML 구상 -> CSS 큰 레이아웃 잡기 -> JS 기능 구현 -> CSS 세부 스타일링 조정
