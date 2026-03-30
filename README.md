# Nexfron APIM (API Management)

이 프로젝트는 **Vite + React + TypeScript** 기반의 API 관리 플랫폼 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Framework**: React 19
- **Build Tool**: Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query, Axios
- **Routing**: React Router DOM 6
- **Form**: React Hook Form + Zod
- **Charts**: Recharts

## 사전 요구사항

- **Node.js**: v18 이상 (LTS 버전 권장)
- **npm**: v9 이상

```bash
# 버전 확인
node -v  # 예시: v20.5.1
npm -v   # 예시: 9.8.1
```

> Node.js가 설치되어 있지 않다면 [https://nodejs.org/](https://nodejs.org/)에서 LTS 버전을 다운로드하세요.

## 프로젝트 설정

### 1. 소스 코드 다운로드

**방법 1: Git Clone**
```bash
git clone <repository-url>
cd dlwnal98-5-29-demo
```

**방법 2: 직접 다운로드**
```bash
# 소스 압축 파일 해제 후 해당 폴더로 이동
cd dlwnal98-5-29-demo
```

### 2. 패키지 설치

```bash
npm install
```

## 실행 방법

### 개발 서버 실행

```bash
npm run dev
```

- 기본 주소: `http://localhost:3000`
- 코드 변경 시 자동으로 Hot Module Replacement (HMR) 적용

### 프로덕션 빌드

```bash
npm run build
```

- `dist/` 폴더에 빌드 결과물 생성

### 빌드 결과물 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── apis/           # API 호출 함수 (Axios 기반)
├── components/     # 공통 UI 컴포넌트 (shadcn/ui)
├── constants/      # 상수 및 설정값
├── hooks/          # 커스텀 React Hooks
├── libs/           # 유틸리티 함수
├── pages/          # 페이지 컴포넌트
│   └── services/
│       └── api-management/
│           ├── api-keys/      # API Key 관리
│           ├── resources/     # Resource/Method 관리
│           └── stages/        # Stage 관리
├── stores/         # Zustand 상태 관리
├── styles/         # 글로벌 스타일
├── types/          # TypeScript 타입 정의
├── App.tsx         # 앱 루트 컴포넌트
├── AppRoutes.tsx   # 라우팅 설정
└── main.tsx        # 엔트리 포인트
```

## 주요 기능

- **API 관리**: API 생성, 수정, 삭제
- **Resource 관리**: API Resource 및 Method 관리
- **Stage 관리**: 배포 환경(Stage) 관리
- **API Key 관리**: API Key 생성, Quota/Rate Limit 설정
- **CORS 설정**: Resource별 CORS 정책 관리
- **API 테스트**: Method별 API 테스트 기능

## 스크립트 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (포트 3000) |
| `npm run start` | 개발 서버 실행 (dev와 동일) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과물 미리보기 |
| `npm run lint` | ESLint 코드 검사 |

## 서버 배포 (Docker + Nginx)

### 빌드 파일 생성

```bash
npm run build
```

`dist/` 폴더를 압축하여 서버에 업로드합니다.

### 서버 배포 절차

1. SSH로 서버 접속
2. 기존 배포 파일 제거
   ```bash
   rm -rf /home/nex_react/*
   ```
3. 새 빌드 파일 업로드 및 압축 해제
   ```bash
   unzip /home/nexfron/dist.zip -d /home/nex_react
   ```
4. Docker 컨테이너 재시작
   ```bash
   docker restart nex_react
   ```

## 환경 설정

Vite 환경 변수는 `.env` 파일에서 관리합니다:

```bash

# Local Setup

# 1. .env.example 파일 복사
cp .env.example .env.development

# 2. 팀원에 API 주소 요청

# 3. .env.development 파일에 전달받은 API 주소 입력

```

## 문제 해결

### npm install 오류 시

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 포트 충돌 시

`vite.config.ts`에서 포트 변경:

```typescript
export default defineConfig({
  server: {
    port: 3001, // 원하는 포트로 변경
  },
});
```

## 참고 자료

- [Vite 공식 문서](https://vitejs.dev/)
- [React 공식 문서](https://react.dev/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [TanStack Query 공식 문서](https://tanstack.com/query/latest)
