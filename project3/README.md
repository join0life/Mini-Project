# 감정 일기장 📝
<한 입 크기로 잘라 먹는 리액트> 교재를 보고 따라 만든 감정 일기장 웹 애플리케이션입니다.

[인프런 링크]
https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%EB%A6%AC%EC%95%A1%ED%8A%B8?srsltid=AfmBOorpoPg6s6YDLRIsumliBLdyvNmByJujxKl-e1wJYzdeToScJiys

## 🚀 설치 및 실행 방법

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속하세요.

## 📦 사용 가능한 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기
- `npm run lint` - ESLint 실행 (있는 경우)

## 🛠️ 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **LocalStorage** - 데이터 저장

## ✨ 주요 기능

- 📅 날짜별 일기 작성
- 😊 감정 상태 기록
- 📝 일기 내용 작성/수정/삭제
- 📋 월별 일기 목록 조회
- 🔄 최신순/오래된 순 정렬

## 📁 프로젝트 구조

```
src/
├── components/     # 재사용 컴포넌트/페이지 컴포넌트
├── hooks/         # 커스텀 훅
├── util/          # 유틸리티 함수
└── App.jsx        # 메인 앱 컴포넌트
```
