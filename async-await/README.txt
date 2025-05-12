프로젝트명: fetch를 async/await 함수로 리팩토링
개요: 버튼을 누르면 1. txt 파일 데이터 2. json 파일 데이터를 get 방식으로 불러옴
3줄 회고
1. await은 무조건 async 함수 안에!
2. html 파일에서 script를 불러올 때 defer 사용 (X), type="module"로 불러오기(O)
3. api.js는 main.js에서 import 해주므로 html 파일에서 따로 불러올 필요 없음.