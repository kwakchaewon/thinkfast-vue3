# 🚀 ThinkFast (띵패스트)
Think Fast는 실시간 설문 조사, AI 기반 인사이트 분석, 실시간 알림 등의 서비스를 제공하는 웹 애플리케이션입니다.
<br></br>

## ✨ 주요 기능

- 🔐 **사용자 인증**: 회원가입, 로그인, JWT 토큰 기반 인증
- 📝 **설문 생성**: 다양한 유형의 설문 생성 및 관리
- 📊 **설문 응답**: 공개/비공개 설문에 대한 응답 제출
- 📈 **AI 인사이트**: 설문 결과에 대한 AI 기반 분석 및 인사이트 제공
- 🏠 **대시보드**: 개인 설문 관리 및 통계 확인
- 🔍 **설문 검색**: 공개 설문 검색 및 필터링
- 📱 **반응형 디자인**: 모바일 및 데스크톱 환경 지원
<br></br>
## 🛠 기술 스택

### 핵심 프레임워크
- **Vue 3** (Composition API)
- **TypeScript**
- **Vite** (빌드 도구)

### 라이브러리
- **shadcn-vue** (UI 컴포넌트)
- **Tailwind CSS** (스타일링)
- **Lucide Vue Next** (아이콘)
- **Reka UI** (접근성 컴포넌트)

### 상태 관리
- **Pinia** (상태 관리)
- **Vuex** (레거시)

### 폼 관리
- **Vee-Validate** (폼 검증)
- **Zod** (스키마 검증)

### 라우팅
- **Vue Router 4**

### HTTP 클라이언트
- **Axios** (API 통신)

### 차트 및 시각화
- **Chart.js**
- **Vue ChartJS**

### 기타
- **Vue Sonner** (토스트 알림)
- **VueUse** (유틸리티 컴포저블)
- **QRCode.vue** (QR 코드 생성)
- **WebFontLoader** (폰트 로딩)
<br></br>
## 📁 프로젝트 구조

```
thinkfast_front/
├── public/                 # 정적 파일
├── src/
│   ├── apis/              # API 클라이언트
│   │   ├── axios.ts       # Axios 인스턴스 및 인터셉터
│   │   ├── authApi.ts     # 인증 API
│   │   └── surveyApi.ts   # 설문 API
│   ├── assets/            # 이미지, 폰트 등
│   ├── components/         # Vue 컴포넌트
│   │   ├── common/        # 공통 컴포넌트
│   │   ├── mobile/        # 모바일 전용 컴포넌트
│   │   └── ui/            # shadcn-vue UI 컴포넌트
│   ├── composables/       # Vue 컴포저블
│   ├── interfaces/        # TypeScript 인터페이스
│   ├── layouts/           # 레이아웃 컴포넌트
│   ├── lib/               # 유틸리티 함수
│   ├── plugins/           # Vue 플러그인
│   ├── router/            # 라우터 설정
│   ├── store/             # 상태 관리 (Vuex/Pinia)
│   ├── views/             # 페이지 컴포넌트
│   ├── App.vue            # 루트 컴포넌트
│   └── main.ts            # 진입점
├── dist/                  # 빌드 산출물
├── docs/                  # 문서
├── Dockerfile             # Docker 이미지 빌드
├── nginx.conf             # Nginx 설정
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```
## 🚀 시작하기

### 필수 요구사항

- **Node.js** 18 이상
- **npm** 또는 **yarn**

### 설치

1. 저장소 클론
```bash
git clone <repository-url>
cd thinkfast_front
```

2. 의존성 설치
```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 빌드

프로덕션 빌드를 생성합니다:

```bash
npm run build
```

빌드 산출물은 `dist/` 디렉토리에 생성됩니다.

### 빌드 미리보기

빌드된 애플리케이션을 미리 볼 수 있습니다:

```bash
npm run preview
```

## 🐳 Docker 배포

### Docker 이미지 빌드

```bash
docker build -t thinkfast-front .
```

### Docker 컨테이너 실행

```bash
docker run -d \
  -p 80:80 \
  -e BACKEND_URL=http://thinkfast-backend:8080 \
  -e NGINX_HOST=localhost \
  -e NGINX_PORT=80 \
  --name thinkfast-front \
  thinkfast-front
```

### Docker Compose 사용

```yaml
version: '3.8'
services:
  thinkfast-front:
    build: .
    ports:
      - "80:80"
    environment:
      - BACKEND_URL=http://thinkfast-backend:8080
      - NGINX_HOST=localhost
      - NGINX_PORT=80
    depends_on:
      - thinkfast-backend
```
<br></br>
## ⚙️ 환경 설정

### API 엔드포인트 설정

애플리케이션은 환경에 따라 자동으로 API URL을 설정합니다:

- **개발 환경**: `http://localhost:8080`
- **프로덕션 환경**: `/api` (Nginx 프록시를 통해 백엔드로 전달)

프로덕션 환경에서는 Nginx가 `/api` 경로의 요청을 백엔드 서버로 프록시합니다.

### 환경 변수

Docker 환경에서 다음 환경 변수를 설정할 수 있습니다:

- `BACKEND_URL`: 백엔드 서버 URL (기본값: `http://thinkfast-backend:8080`)
- `NGINX_HOST`: Nginx 호스트명 (기본값: `localhost`)
- `NGINX_PORT`: Nginx 포트 (기본값: `80`)
<br></br>
## 🔐 인증 시스템

애플리케이션은 JWT 기반 인증을 사용합니다:

- **Access Token**: API 요청 시 사용되는 토큰
- **Refresh Token**: Access Token 갱신에 사용되는 토큰
- **자동 토큰 갱신**: Access Token 만료 시 자동으로 Refresh Token을 사용하여 갱신
- **토큰 만료 처리**: Refresh Token도 만료된 경우 자동 로그아웃
<br></br>
## 📱 주요 페이지

- `/` - 홈 (공개 설문 목록)
- `/login` - 로그인
- `/signup` - 회원가입
- `/main` - 대시보드 (인증 필요)
- `/create-survey` - 설문 생성 (인증 필요)
- `/survey/:id` - 설문 상세
- `/survey/:id/create-response` - 설문 응답
- `/survey-completion` - 설문 완료
- `/all-surveys` - 전체 설문 목록 (인증 필요)
- `/posts` - 게시글
<br></br>
## 🎨 UI 컴포넌트

이 프로젝트는 **shadcn-vue**를 기반 UI 컴포넌트를 사용합니다:

- Button, Input, Card, Dialog
- Form, Select, Radio Group
- Table, Calendar, Progress
- Badge, Avatar, Separator
- 등등...

모든 컴포넌트는 `src/components/ui/` 디렉토리에 있습니다.
<br></br>
## 📦 빌드 최적화

Vite 빌드 설정에서 다음과 같은 최적화가 적용됩니다:

- **코드 분할**: Vendor 청크와 Chart.js 청크 분리
- **CSS 코드 분할**: 페이지별 CSS 분리
- **자산 최적화**: 이미지, 폰트 파일 최적화
- **소스맵**: 프로덕션 빌드에서는 비활성화
<br></br>
## 🔧 개발 가이드

### 경로 별칭

프로젝트는 `@` 별칭을 사용하여 `src/` 디렉토리를 참조합니다:

```typescript
import { something } from '@/components/ui/button'
```

### 스타일링

- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
- **커스텀 CSS**: `src/style.css`에 전역 스타일 정의

### 폼 검증

Vee-Validate와 Zod를 사용하여 폼 검증을 수행합니다:

```typescript
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
```
---

**ThinkFast** - AI 인사이트 제공 설문 플랫폼

