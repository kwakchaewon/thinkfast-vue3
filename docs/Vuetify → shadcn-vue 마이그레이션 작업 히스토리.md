# Vuetify → shadcn-vue 마이그레이션 작업 히스토리

이 파일은 완료된 작업의 상세 기록을 보관합니다. 현재 진행 상황과 다음 작업은 `TASK.MD`를 참고하세요.

---

## 작업 메모

### 작업 1 완료 (현재 사용 중인 모든 Vuetify 컴포넌트 목록 작성)
**완료 날짜:** 작업 완료  
**결과:** 
- 총 40개 이상의 Vuetify 컴포넌트 식별
- 15개 파일에서 사용 중인 컴포넌트 매핑 완료
- 주요 카테고리: 레이아웃, 폼, 카드, 리스트, 네비게이션, 피드백, 데이터 표시

### 작업 1-2 완료 (각 컴포넌트별 shadcn-vue 대응 컴포넌트 매핑)
**완료 날짜:** 작업 완료  
**결과:** 
- 총 40개 이상의 Vuetify 컴포넌트를 shadcn-vue 컴포넌트와 매핑 완료
- 직접 매핑 가능한 컴포넌트: 20개 이상 (Button, Input, Card, Dialog, Select 등)
- Tailwind CSS로 대체 가능한 컴포넌트: 레이아웃 관련 대부분
- 커스텀 컴포넌트 개발 필요: Navigation Drawer, Timeline, Pagination

### 작업 1-3 완료 (마이그레이션 우선순위 결정)
**완료 날짜:** 작업 완료  
**결과:** 
- 5단계 Phase별 마이그레이션 계획 수립
- 뷰별 우선순위 결정 (인증 → 핵심 기능 → 설문 관리 → 설문 응답)
- 의존성 관계 분석 완료
- 예상 작업 시간 및 위험 요소 식별

### 작업 1-4 완료 (커스텀 테마 및 스타일 분석)
**완료 날짜:** 작업 완료  
**결과:** 
- Vuetify 테마 색상 팔레트 분석 완료 (인디고 계열)
- 전역 스타일 및 폰트 설정 확인
- 커스텀 스타일 패턴 식별 (그라데이션, 카드 스타일 등)
- Vuetify 유틸리티 클래스 → Tailwind CSS 매핑 정리
- 반응형 breakpoint 차이점 식별 및 주의사항 정리
- Tailwind CSS 변환 계획 수립

### 작업 2-1 완료 (Tailwind CSS 설치 및 설정)
**완료 날짜:** 작업 완료  
**결과:** 
- Tailwind CSS, PostCSS, Autoprefixer 설치 완료
- tailwind.config.js 생성 및 커스텀 색상 팔레트 추가 (인디고 계열)
- postcss.config.js 생성
- src/style.css에 Tailwind 디렉티브 추가 (@tailwind base/components/utilities)
- 커스텀 폰트 설정 (Inter) 및 borderRadius 설정 완료

### 작업 2-2 완료 (shadcn-vue CLI 설치)
**완료 날짜:** 작업 완료  
**결과:** 
- shadcn-vue CLI 패키지 설치 완료 (420개 패키지 추가)
- devDependencies에 shadcn-vue 추가됨
- 참고: Node.js 버전 경고 발생 (현재 v21.6.1, 권장 20 또는 >=22) - 기능 사용에는 문제 없음

### 작업 2-3, 2-4, 2-5 완료 (shadcn-vue 초기화 및 설정)
**완료 날짜:** 작업 완료  
**결과:** 
- shadcn-vue 초기화 완료 (`npx shadcn-vue@latest init --base-color slate`)
- components.json 파일 생성됨
  - Style: new-york
  - Base color: slate
  - CSS variables: true
  - TypeScript: true
  - Icon library: lucide
  - Aliases: @/components, @/lib/utils, @/components/ui 등 설정됨
- src/lib/utils.ts 파일 생성됨 (cn 유틸리티 함수 포함)
- CSS variables가 src/style.css에 추가됨 (shadcn-vue 테마 변수)
- 필수 의존성 자동 설치됨:
  - lucide-vue-next (아이콘 라이브러리)
  - clsx, tailwind-merge (클래스 유틸리티)
  - class-variance-authority (컴포넌트 variant 관리)
  - tailwindcss-animate (애니메이션)
- Radix Vue 의존성: 컴포넌트 추가 시 자동 설치됨 (예: Button 추가 시 @radix-ui/react-slot 등)

### 작업 3-1 완료 (Button 컴포넌트 설치)
**완료 날짜:** 작업 완료  
**결과:** 
- Button 컴포넌트 설치 완료
- 생성된 파일:
  - src/components/ui/button/Button.vue
  - src/components/ui/button/index.ts
- 필요한 의존성 자동 설치됨 (reka-ui 패키지 포함)
  - 참고: shadcn-vue는 Radix Vue 대신 reka-ui를 사용 (Vue 3 전용)
- 사용 방법: `import { Button } from '@/components/ui/button'`
- Variants 지원: default, destructive, outline, secondary, ghost, link
- Sizes 지원: default, sm, lg, icon

### 작업 3-2 완료 (Input 컴포넌트 설치)
**완료 날짜:** 작업 완료  
**결과:** 
- Input 컴포넌트 설치 완료
- 생성된 파일:
  - src/components/ui/input/Input.vue
  - src/components/ui/input/index.ts (업데이트됨)
- 필요한 의존성 자동 설치됨
- 사용 방법: `import { Input } from '@/components/ui/input'`
- Label 컴포넌트와 함께 사용 권장 (폼 레이블링)

### 작업 3-3 완료 (Card 컴포넌트 설치)
**완료 날짜:** 작업 완료  
**결과:** 
- Card 컴포넌트 설치 완료
- 생성된 파일 (7개):
  - src/components/ui/card/Card.vue (메인 카드 컨테이너)
  - src/components/ui/card/CardHeader.vue (카드 헤더)
  - src/components/ui/card/CardTitle.vue (카드 제목)
  - src/components/ui/card/CardDescription.vue (카드 설명)
  - src/components/ui/card/CardContent.vue (카드 본문)
  - src/components/ui/card/CardFooter.vue (카드 푸터)
  - src/components/ui/card/index.ts (export 파일)
- 필요한 의존성 자동 설치됨
- 사용 방법: `import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'`
- Vuetify의 v-card, v-card-title, v-card-text, v-card-actions를 대체

### 작업 3-4, 3-6 완료 (Form 컴포넌트 및 Label 컴포넌트 설치)
**완료 날짜:** 작업 완료  
**결과:** 
- Form 컴포넌트 설치 완료 (Label 컴포넌트도 함께 설치됨)
- 생성된 파일 (10개):
  - src/components/ui/form/FormControl.vue
  - src/components/ui/form/FormDescription.vue
  - src/components/ui/form/FormItem.vue
  - src/components/ui/form/FormLabel.vue
  - src/components/ui/form/FormMessage.vue
  - src/components/ui/form/index.ts
  - src/components/ui/form/injectionKeys.ts
  - src/components/ui/form/useFormField.ts
  - src/components/ui/label/Label.vue
  - src/components/ui/label/index.ts
- 필요한 의존성 자동 설치됨 (vee-validate 등)
- 사용 방법: `import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'`
- Label 사용: `import { Label } from '@/components/ui/label'`
- Vuetify의 v-form, v-text-field validation을 대체

### 작업 3-5 완료 (Toast/Sonner 컴포넌트 설치)
**완료 날짜:** 작업 완료  
**결과:** 
- Sonner 컴포넌트 설치 완료
- 생성된 파일:
  - src/components/ui/sonner/Sonner.vue
  - src/components/ui/sonner/index.ts (업데이트됨)
- 필요한 의존성 자동 설치됨 (sonner 라이브러리)
- 사용 방법:
  - `import { Toaster } from '@/components/ui/sonner'` (컴포넌트)
  - `import { toast } from 'sonner'` (함수)
  - App.vue에 `<Toaster />` 컴포넌트 추가 필요
- Vuetify의 v-snackbar를 완전히 대체
- Toast 타입: success, error, info, warning 등 지원

### 작업 3-7 완료 (Container/Layout 관련 컴포넌트)
**완료 날짜:** 작업 완료  
**결과:** 
- Separator 컴포넌트 설치 완료 (v-divider 대체)
- 생성된 파일:
  - src/components/ui/separator/Separator.vue
  - src/components/ui/separator/index.ts (업데이트됨)
- 사용 방법: `import { Separator } from '@/components/ui/separator'`
- Container/Layout: shadcn-vue에는 직접적인 컴포넌트가 없음
  - Tailwind CSS 유틸리티 클래스 사용:
    - `v-container` → `container mx-auto px-4` (또는 `container mx-auto`)
    - `v-row` / `v-col` → `grid grid-cols-12` / `col-span-*` 또는 `flex flex-col` / `flex-*`
    - `v-spacer` → `flex-1` 또는 `ml-auto`
    - `v-main` → `<main>` 태그 + Tailwind 클래스
  - 커스텀 레이아웃 컴포넌트는 필요시 생성

### 작업 3-8 완료 (기타 필요한 컴포넌트들)
**완료 날짜:** 작업 완료  
**결과:** 
- 모든 필수 컴포넌트 일괄 설치 완료 (69개 파일 생성)
- 설치된 컴포넌트 목록:
  1. **Textarea** - v-textarea 대체
  2. **Select** (12개 파일) - v-select 대체
  3. **Switch** - v-switch 대체
  4. **RadioGroup** (2개 파일) - v-radio-group 대체
  5. **Slider** - v-slider 대체
  6. **Badge** - v-chip, v-badge 대체
  7. **Avatar** (3개 파일) - v-avatar 대체
  8. **Progress** - v-progress-linear 대체
  9. **Dialog** (8개 파일) - v-dialog 대체
  10. **Accordion** (4개 파일) - v-expansion-panels 대체
  11. **Table** (9개 파일) - v-table 대체
  12. **DropdownMenu** (13개 파일) - v-menu 대체
- 필요한 의존성 자동 설치됨 (reka-ui 관련 패키지들)
- 모든 컴포넌트는 src/components/ui/ 디렉토리에 설치됨
- 마이그레이션에 필요한 주요 컴포넌트 모두 준비 완료

### 작업 2-1 보완 완료 (Tailwind CSS v3로 다운그레이드 및 재설치)
**완료 날짜:** 작업 완료  
**결과:** 
- Tailwind CSS v4.1.16 → v3.4.18로 다운그레이드 완료
- node_modules 재설치 완료 (581개 패키지)
- PostCSS 플러그인 에러 해결 (v4는 별도 패키지 필요, v3는 직접 지원)
- src/style.css에서 Tailwind v4 전용 구문 제거:
  - `@import "tw-animate-css"`, `@plugin`, `@custom-variant`, `@theme inline` 제거
- tailwind.config.js에 tailwindcss-animate 플러그인 추가 (v3 방식)
- shadcn-vue와의 호환성 확보 (shadcn-vue는 Tailwind v3 기준)

**에러 원인:**
- Tailwind CSS v4는 PostCSS 플러그인이 별도 패키지(`@tailwindcss/postcss`)로 분리됨
- v4는 CSS 기반 설정 방식으로 변경되어 기존 config.js 방식과 호환되지 않음
- shadcn-vue는 Tailwind v3를 기준으로 개발되어 v4 사용 시 호환성 이슈 발생 가능
- node_modules 캐시 문제로 인해 v4가 남아있을 수 있어 재설치 필요했음

**참고:**
- 실제 설치된 버전: tailwindcss@3.4.18 (루트)
- shadcn-vue는 내부적으로 tailwindcss@4.1.16을 의존성으로 가지지만, 프로젝트 루트의 v3가 우선 사용됨

### 작업 4 완료 (아이콘 시스템 마이그레이션)
**완료 날짜:** 작업 완료  
**결과:** 
- lucide-vue-next는 이미 설치되어 있음 (v0.552.0, shadcn-vue 초기화 시 설치됨)
- 프로젝트 전체에서 사용 중인 MDI 아이콘 31종 식별 완료
- MDI 아이콘 → Lucide 아이콘 매핑 테이블 작성 완료

**MDI → Lucide 아이콘 매핑 테이블:**

| MDI 아이콘 | Lucide 아이콘 | 사용 위치 | 비고 |
|-----------|--------------|----------|------|
| `mdi-account` | `User` | Signup.vue, Home.vue | 사용자 계정 |
| `mdi-lock` | `Lock` | Login.vue, Signup.vue, Home.vue | 잠금 |
| `mdi-lock-check` | `ShieldCheck` | Signup.vue | 잠금 확인 |
| `mdi-email` | `Mail` | Login.vue, Signup.vue | 이메일 |
| `mdi-eye` | `Eye` | Signup.vue, Home.vue, CreateSurvey.vue, SurveyResults.vue | 보기 |
| `mdi-eye-off` | `EyeOff` | Signup.vue, Home.vue | 숨기기 |
| `mdi-calendar` | `Calendar` | Signup.vue, CreateSurvey.vue | 달력 |
| `mdi-bell` | `Bell` | Sidebar.vue | 알림 |
| `mdi-menu` | `Menu` | HeaderMenu.vue | 메뉴 |
| `mdi-close` | `X` | Sidebar.vue, SurveyResults.vue | 닫기 |
| `mdi-chevron-left` | `ChevronLeft` | Sidebar.vue | 왼쪽 화살표 |
| `mdi-chevron-right` | `ChevronRight` | Sidebar.vue, Main.vue | 오른쪽 화살표 |
| `mdi-view-dashboard` | `LayoutDashboard` | Sidebar.vue, HeaderMenu.vue | 대시보드 |
| `mdi-plus` | `Plus` | Sidebar.vue, HeaderMenu.vue, RecentSurveys.vue, CreateSurvey.vue, AllSurveys.vue | 추가 |
| `mdi-poll` | `BarChart3` 또는 `PieChart` | Sidebar.vue, HeaderMenu.vue | 설문 |
| `mdi-vote` | `Vote` | Sidebar.vue, HeaderMenu.vue | 투표 |
| `mdi-chart-box` | `BarChart3` | Sidebar.vue, HeaderMenu.vue | 차트 박스 |
| `mdi-chart-timeline-variant` | `TrendingUp` 또는 `Activity` | Sidebar.vue, HeaderMenu.vue | 타임라인 차트 |
| `mdi-chart-line` | `TrendingUp` | Main.vue | 선형 차트 |
| `mdi-chart-bar` | `BarChart` | SurveyDetail.vue | 막대 차트 |
| `mdi-logout` | `LogOut` | Sidebar.vue, HeaderMenu.vue | 로그아웃 |
| `mdi-clock-outline` | `Clock` | SurveyResponse.vue, Main.vue, CreateSurvey.vue | 시계 |
| `mdi-file-document-edit` | `FileEdit` | CreateSurvey.vue | 문서 편집 |
| `mdi-format-title` | `Heading` | CreateSurvey.vue | 제목 |
| `mdi-text` | `Type` | CreateSurvey.vue | 텍스트 |
| `mdi-format-list-checks` | `ListChecks` | CreateSurvey.vue | 체크 리스트 |
| `mdi-format-list-bulleted-type` | `List` | CreateSurvey.vue | 불릿 리스트 |
| `mdi-playlist-plus` | `ListPlus` | CreateSurvey.vue | 플레이리스트 추가 |
| `mdi-help-circle` | `HelpCircle` | CreateSurvey.vue | 도움말 |
| `mdi-delete` | `Trash2` | CreateSurvey.vue, SurveyDetail.vue | 삭제 |
| `mdi-cog` | `Settings` | CreateSurvey.vue | 설정 |
| `mdi-account-multiple` | `Users` | CreateSurvey.vue | 여러 계정 |
| `mdi-content-save` | `Save` | CreateSurvey.vue | 저장 |
| `mdi-content-copy` | `Copy` | SurveyDetail.vue | 복사 |
| `mdi-magnify` | `Search` | AllSurveys.vue | 검색 |
| `mdi-message-reply` | `Reply` | Main.vue | 답장 |
| `mdi-check-circle` | `CheckCircle2` | SurveyCompletion.vue | 체크 원 |

**사용 파일 목록:**
- src/components/common/Sidebar.vue (12개 아이콘)
- src/components/mobile/HeaderMenu.vue (9개 아이콘)
- src/views/Login.vue (2개 아이콘)
- src/views/Signup.vue (7개 아이콘)
- src/views/Home.vue (4개 아이콘)
- src/views/CreateSurvey.vue (15개 아이콘)
- src/views/Main.vue (4개 아이콘)
- src/views/SurveyDetail.vue (2개 아이콘)
- src/views/SurveyResponse.vue (1개 아이콘)
- src/views/SurveyResults.vue (2개 아이콘)
- src/views/AllSurveys.vue (2개 아이콘)
- src/views/RecentSurveys.vue (1개 아이콘)
- src/views/SurveyCompletion.vue (1개 아이콘)

**Lucide 아이콘 사용 방법:**
```vue
<script setup>
import { User, Mail, Lock, Bell } from 'lucide-vue-next'
</script>

<template>
  <User class="w-4 h-4" />
  <Mail class="w-5 h-5 text-primary" />
</template>
```

**참고:**
- Lucide 아이콘은 컴포넌트로 import하여 사용
- 크기는 `class="w-4 h-4"` 등의 Tailwind 클래스로 제어
- 색상은 `class="text-primary"` 등의 Tailwind 클래스로 제어
- MDI의 `v-icon` 대신 직접 컴포넌트로 사용

### 작업 5-1 완료 (App.vue 마이그레이션)
**완료 날짜:** 작업 완료  
**결과:** 
- `v-app` 제거 및 Tailwind CSS 기반 레이아웃으로 변경
- `v-snackbar` 제거 및 Sonner의 `Toaster` 컴포넌트로 대체
- 반응형 루트 컨테이너 설정:
  - `min-h-screen w-full` - 전체 화면 레이아웃
  - `bg-background text-foreground` - shadcn-vue 테마 색상 적용
- Composition API (`<script setup>`)로 변경
- 스타일링을 Tailwind 클래스로 완전히 대체

**변경 사항:**
- `v-app` → `<div class="min-h-screen w-full bg-background text-foreground">`
- `v-snackbar` → `<Toaster />` (Sonner 컴포넌트)
- Vuetify 의존성 제거 (App.vue에서)

### 작업 5-2 완료 (Sidebar.vue 마이그레이션)
**완료 날짜:** 작업 완료  
**결과:** 
- `v-navigation-drawer`를 Tailwind CSS 기반 고정 사이드바로 대체
- 데스크톱 전용 고정 사이드바 구현 (`fixed left-0 top-0 h-screen w-[280px]`)
- 모든 Vuetify 컴포넌트를 shadcn-vue 컴포넌트로 교체:
  - `v-list` → Tailwind CSS 리스트 (`<nav>`, `<div>`)
  - `v-list-item` → Tailwind CSS 링크/버튼
  - `v-menu` → `DropdownMenu` (알림 메뉴)
  - `v-badge` → `Badge` (알림 뱃지)
  - `v-avatar` → `Avatar` (프로필 이미지)
  - `v-divider` → `Separator`
  - `v-btn` → `Button`
- 모든 MDI 아이콘을 Lucide 아이콘으로 교체
- 알림 기능 유지 (WebSocket, 드롭다운 메뉴, 페이지네이션)
- 반응형 디자인 적용 (Tailwind breakpoint 클래스)
- 부드러운 전환 애니메이션 (Tailwind transition)

**주요 변경사항:**
- Options API → Composition API (`<script setup>`)로 변경
- `v-navigation-drawer` → `<aside>` 태그 + Tailwind CSS
- 프로필 섹션, 네비게이션 메뉴, 알림 드롭다운, 로그아웃 기능 모두 유지
- 스타일링을 Tailwind 유틸리티 클래스로 완전히 대체

### 작업 5-3 완료 (HeaderMenu.vue 마이그레이션)
**완료 날짜:** 작업 완료  
**결과:** 
- 모든 Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체
- 모든 MDI 아이콘을 Lucide 아이콘으로 교체
- 모바일 감지: `useDisplay()` → VueUse의 `useBreakpoints()`
- 반응형 헤더 구현:
  - 모바일: 고정 헤더 + 드로어 메뉴 (슬라이드 인/아웃)
  - 데스크톱: Sidebar 표시 + 메인 컨텐츠
- 스크롤 시 헤더 숨김/표시 기능 유지 (80px 이상 스크롤 시)
- 부드러운 전환 애니메이션 (Tailwind transition + Vue Transition)
- 모바일 전용 헤더 스타일링 (고정 위치, 그림자, 전환 효과)

**주요 변경사항:**
- Options API → Composition API (`<script setup>`)로 변경
- `useDisplay()` → `useBreakpoints()` (VueUse)
- 드로어 메뉴 애니메이션: `v-slide-y-transition` → Vue `<Transition>` + Tailwind 클래스
- 모바일/데스크톱 레이아웃 분기 처리 개선

### 작업 5-4 완료 (Main.vue 레이아웃 구조 마이그레이션)
**완료 날짜:** 작업 완료  
**결과:** 
- 모든 Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체
- 모든 MDI 아이콘을 Lucide 아이콘으로 교체
- 반응형 그리드 시스템 적용:
  - 통계 카드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (모바일: 1열, 태블릿: 2열, 데스크톱: 4열)
  - 메인 컨텐츠: `grid-cols-1 md:grid-cols-3` (모바일: 1열, 데스크톱: 3열, 최근 설문 2/3, 활동 1/3)
- 카드 레이아웃 반응형 조정
- 커스텀 타임라인 구현:
  - Tailwind CSS로 간단한 타임라인 스타일 구현
  - 색상별 dot (success, info, warning, error)
  - 마지막 항목 제외하고 border-l 스타일 적용
- 테이블 반응형 처리:
  - `overflow-x-auto`로 모바일에서 가로 스크롤 가능
  - hover 효과 유지

**주요 변경사항:**
- Options API → Composition API (`<script setup>`)로 변경
- 반응형 디자인: Tailwind Grid 시스템 활용
- 타임라인: Vuetify 컴포넌트 → 커스텀 Tailwind CSS 구현
- 모든 기능 유지 (통계 계산, 설문 목록, 활동 타임라인)

### 작업 6-1 완료 (Home.vue 마이그레이션 - 실제 로그인 페이지)
**완료 날짜:** 작업 완료  
**결과:** 
- 모든 Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체
- 모든 MDI 아이콘을 Lucide 아이콘으로 교체
- 폼 유효성 검사: Vuetify rules → Zod 스키마 + vee-validate
- 반응형 폼 레이아웃:
  - 모바일: 전체 너비 (`w-full`), 패딩 `p-4`
  - 데스크톱: 중앙 정렬, 최대 너비 제한 (`max-w-md`)
- 깔끔한 UI 스타일 적용:
  - 흰색 배경 (`bg-white`)
  - 미묘한 그림자 및 테두리 (`shadow-md border-gray-200`)
  - 라벨 없이 플레이스홀더만 사용
  - 입력 필드: `h-12`, `border-gray-300`, `rounded-lg`
  - 버튼: `bg-primary-400 hover:bg-primary-500`, `h-12`
  - 에러 메시지: `text-red-500 text-xs`
- 로딩 상태 표시:
  - `Loader2` 아이콘 + `animate-spin` 애니메이션
  - 버튼 disabled 상태 관리

**주요 변경사항:**
- Options API → Composition API (`<script setup>`)로 변경
- Vuetify form validation → vee-validate + Zod
- 비밀번호 보기/숨기기 기능 유지
- 로그인 로직 유지 (authApi, store dispatch)
- 깔끔한 UI 스타일 적용 (흰색 배경, 파란색 계열 컴포넌트)

### 작업 6-2 완료 (Signup.vue 마이그레이션)
**완료 날짜:** 작업 완료  
**결과:**
- 모든 Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체
- 모든 MDI 아이콘을 Lucide 아이콘으로 교체
- 폼 필드:
  - 이메일, 비밀번호, 비밀번호 확인, 이름, 생년월일 (YYMMDD)
  - 비밀번호 및 비밀번호 확인 필드에 보기/숨기기 토글 버튼
- 폼 유효성 검사: Vuetify rules → Zod 스키마 + vee-validate
  - 이메일 형식 검증
  - 비밀번호 최소 8자 검증
  - 비밀번호 일치 검증 (refine 사용)
  - 생년월일 YYMMDD 형식 및 날짜 유효성 검증
- 깔끔한 UI 스타일 (Home.vue 기준):
  - 흰색 배경 (`bg-white`)
  - 미묘한 그림자 및 테두리 (`shadow-md border-gray-200`)
  - 라벨 없이 플레이스홀더만 사용
  - 입력 필드: `h-12`, `border-gray-300`, `rounded-lg`
  - 아이콘: 왼쪽 배치 (`left-3`), `text-gray-400`, `h-5 w-5`
  - 버튼: `bg-primary-400 hover:bg-primary-500`, `h-12`
  - 에러 메시지: `text-red-500 text-xs`
- 반응형 폼 레이아웃
- 로딩 상태 표시
- 생년월일 datepicker: flatpickr 라이브러리 사용 (YYMMDD 형식 변환)
- toast 알림 시스템: vue-sonner 사용 (중앙 상단 위치)

**주요 변경사항:**
- Options API → Composition API (`<script setup>`)로 변경
- Vuetify form validation → vee-validate + Zod
- 비밀번호 보기/숨기기 기능 유지 (두 개의 필드 모두)
- 생년월일 유효성 검사 로직 유지 (YYMMDD 형식 및 날짜 검증)
- 회원가입 로직 유지 (authApi, useDelayedRouter)

---

## 참고

이 히스토리 파일은 완료된 작업의 상세 기록을 보관합니다. 현재 진행 상황과 다음 작업은 `TASK.MD`를 참고하세요.



