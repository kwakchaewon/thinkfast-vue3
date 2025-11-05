# Vuetify → shadcn-vue 마이그레이션 작업 리스트

## 프로젝트 정보
- **현재 라이브러리**: Vuetify 3.8.2
- **대체 라이브러리**: shadcn-vue (Radix Vue + Tailwind CSS)
- **프로젝트**: Vue 3 + TypeScript + Vite

---

## 작업 리스트

### 1. 프로젝트 분석 및 마이그레이션 계획
- [x] 현재 사용 중인 모든 Vuetify 컴포넌트 목록 작성
- [ ] 각 컴포넌트별 shadcn-vue 대응 컴포넌트 매핑
- [ ] 마이그레이션 우선순위 결정
- [ ] 커스텀 테마 및 스타일 분석

#### 사용 중인 Vuetify 컴포넌트 목록

**레이아웃 컴포넌트:**
- `v-app` - 루트 앱 컨테이너 (App.vue)
- `v-container` - 컨테이너 (모든 뷰에서 사용)
- `v-row` / `v-col` - 그리드 시스템 (모든 뷰에서 사용)
- `v-layout` - 레이아웃 래퍼 (HeaderMenu.vue, RecentSurveys.vue)
- `v-main` - 메인 컨텐츠 영역 (HeaderMenu.vue, RecentSurveys.vue)
- `v-spacer` - 공간 분배 (다수 파일)

**카드 & 표면 컴포넌트:**
- `v-card` - 카드 컨테이너 (모든 뷰)
- `v-card-title` - 카드 제목
- `v-card-text` - 카드 본문
- `v-card-item` - 카드 아이템
- `v-card-actions` - 카드 액션 영역
- `v-sheet` - 시트 컴포넌트 (HeaderMenu.vue)

**폼 컴포넌트:**
- `v-form` - 폼 컨테이너 (Login.vue, Signup.vue, Home.vue, CreateSurvey.vue, SurveyResponse.vue)
- `v-text-field` - 텍스트 입력 필드 (모든 폼 뷰)
- `v-textarea` - 텍스트 영역 (CreateSurvey.vue, SurveyResponse.vue, SurveyDetail.vue)
- `v-select` - 선택 드롭다운 (CreateSurvey.vue, AllSurveys.vue)
- `v-switch` - 스위치 토글 (CreateSurvey.vue)
- `v-radio-group` / `v-radio` - 라디오 버튼 그룹 (SurveyResponse.vue)
- `v-slider` - 슬라이더 (SurveyResponse.vue, SurveyDetail.vue)

**버튼 & 액션:**
- `v-btn` - 버튼 (모든 뷰)
- `v-icon` - 아이콘 (모든 뷰, MDI 아이콘 사용)

**리스트 & 네비게이션:**
- `v-list` - 리스트 컨테이너 (Sidebar.vue, CreateSurvey.vue, HeaderMenu.vue)
- `v-list-item` - 리스트 아이템 (Sidebar.vue, CreateSurvey.vue, HeaderMenu.vue)
- `v-list-item-title` - 리스트 아이템 제목
- `v-list-item-subtitle` - 리스트 아이템 부제목
- `v-list-item-text` - 리스트 아이템 텍스트
- `v-list-subheader` - 리스트 서브헤더 (Sidebar.vue)
- `v-navigation-drawer` - 사이드바 네비게이션 (Sidebar.vue)
- `v-menu` - 메뉴 드롭다운 (Sidebar.vue)

**피드백 & 알림:**
- `v-snackbar` - 스낵바 알림 (App.vue, Signup.vue, Home.vue)
- `v-chip` - 칩/태그 (모든 뷰)
- `v-badge` - 배지 (Sidebar.vue)
- `v-progress-linear` - 프로그레스 바 (AllSurveys.vue)

**데이터 표시:**
- `v-table` - 테이블 (Main.vue, RecentSurveys.vue, AllSurveys.vue)
- `v-timeline` / `v-timeline-item` - 타임라인 (Main.vue)
- `v-avatar` - 아바타 (Sidebar.vue)
- `v-img` - 이미지 (Signup.vue, Home.vue)

**다이얼로그 & 오버레이:**
- `v-dialog` - 다이얼로그 (SurveyDetail.vue, SurveyResults.vue)

**확장/축소:**
- `v-expansion-panels` / `v-expansion-panel` / `v-expansion-panel-title` / `v-expansion-panel-text` - 확장 패널 (CreateSurvey.vue)

**페이지네이션:**
- `v-pagination` - 페이지네이션 (AllSurveys.vue)

**기타:**
- `v-divider` - 구분선 (Sidebar.vue, CreateSurvey.vue, HeaderMenu.vue)
- `v-toolbar` / `v-toolbar-title` - 툴바 (Login.vue)
- `v-slide-y-transition` - 전환 효과 (HeaderMenu.vue)

**사용 파일 통계:**
- 총 15개 파일에서 Vuetify 컴포넌트 사용
- 주요 사용 파일: App.vue, Sidebar.vue, Login.vue, Signup.vue, Home.vue, CreateSurvey.vue, Main.vue, SurveyDetail.vue, SurveyResponse.vue, SurveyResults.vue, AllSurveys.vue, RecentSurveys.vue, HeaderMenu.vue, About.vue, SurveyCompletion.vue

**참고:**
- MDI (Material Design Icons) 아이콘을 `mdi-*` 형식으로 사용
- Vuetify의 반응형 유틸리티 클래스 사용 (sm, md, lg 등)
- 커스텀 테마 색상: primary (#3949AB), secondary (#5C6BC0), accent (#1A237E)

### 2. shadcn-vue 환경 설정
- [ ] Tailwind CSS 설치 및 설정
- [ ] shadcn-vue CLI 설치
- [ ] shadcn-vue 초기화 (`npx shadcn-vue@latest init`)
- [ ] Radix Vue 의존성 확인
- [ ] shadcn-vue 설정 파일 생성 (components.json)

### 3. 필수 shadcn-vue 컴포넌트 설치
- [ ] Button 컴포넌트
- [ ] Input 컴포넌트
- [ ] Card 컴포넌트
- [ ] Form 컴포넌트
- [ ] Toast/Sonner 컴포넌트 (스낵바 대체)
- [ ] Label 컴포넌트
- [ ] Container/Layout 관련 컴포넌트
- [ ] 기타 필요한 컴포넌트들

### 4. 아이콘 시스템 마이그레이션
- [ ] MDI 아이콘 대체 라이브러리 선택 (lucide-vue-next 등)
- [ ] 아이콘 라이브러리 설치
- [ ] 기존 MDI 아이콘을 새 아이콘으로 매핑

### 5. 레이아웃 컴포넌트 마이그레이션
- [ ] App.vue (v-app → 레이아웃 컴포넌트)
- [ ] Sidebar.vue (v-navigation-drawer 등)
- [ ] HeaderMenu.vue
- [ ] Main.vue 레이아웃 구조

### 6. 인증 관련 뷰 마이그레이션
- [ ] Login.vue (v-form, v-text-field, v-btn 등)
- [ ] Signup.vue
- [ ] Home.vue

### 7. 설문조사 관련 뷰 마이그레이션
- [ ] CreateSurvey.vue
- [ ] SurveyDetail.vue
- [ ] SurveyResponse.vue
- [ ] SurveyResults.vue
- [ ] SurveyCompletion.vue
- [ ] AllSurveys.vue
- [ ] RecentSurveys.vue

### 8. 기타 뷰 마이그레이션
- [ ] About.vue

### 9. 공통 컴포넌트 및 유틸리티 마이그레이션
- [ ] useSnackbar composable 업데이트 (v-snackbar → Toast/Sonner)
- [ ] 스타일 유틸리티 클래스 변환
- [ ] 반응형 레이아웃 클래스 변환

### 10. 테마 및 스타일링 설정
- [ ] Tailwind CSS 커스텀 테마 설정
- [ ] 기존 Vuetify 테마 색상 (primary, secondary 등) Tailwind로 변환
- [ ] 다크모드 지원 여부 결정 및 설정
- [ ] 전역 스타일 정리 (style.css)

### 11. Vite 설정 업데이트
- [ ] Tailwind CSS 플러그인 설정 확인
- [ ] 경로 별칭 설정 확인
- [ ] 빌드 최적화 설정

### 12. Vuetify 제거
- [ ] Vuetify 플러그인 제거 (src/plugins/vuetify.ts)
- [ ] main.ts에서 Vuetify 관련 코드 제거
- [ ] package.json에서 Vuetify 및 MDI 의존성 제거
- [ ] @mdi/font 관련 import 제거
- [ ] Vuetify 관련 스타일 import 제거

### 13. 테스트 및 검증
- [ ] 모든 페이지 레이아웃 검증
- [ ] 반응형 디자인 확인 (모바일, 태블릿, 데스크톱)
- [ ] 폼 유효성 검사 기능 확인
- [ ] 스낵바/Toast 알림 기능 확인
- [ ] 네비게이션 및 라우팅 확인
- [ ] 브라우저 호환성 테스트

### 14. 문서화 및 정리
- [ ] 마이그레이션 가이드 문서 작성
- [ ] 새로운 컴포넌트 사용법 정리
- [ ] 불필요한 파일 정리
- [ ] README 업데이트

### 15. 최종 점검
- [ ] 코드 리뷰 및 리팩토링
- [ ] 성능 최적화 확인
- [ ] 번들 크기 비교
- [ ] 프로덕션 빌드 테스트

---

## 참고사항
- shadcn-vue는 Radix Vue와 Tailwind CSS를 기반으로 합니다
- 컴포넌트는 복사하여 프로젝트에 직접 포함되므로 커스터마이징이 용이합니다
- 기존 Vuetify의 그리드 시스템(v-row, v-col)은 Tailwind의 Grid/Flexbox로 대체해야 합니다
- Vuetify의 v-snackbar는 shadcn-vue의 Toast 또는 Sonner로 대체됩니다

---

## 마이그레이션 체크리스트 상태
- `[x]` = 완료
- `[-]` = 진행 중
- `[ ]` = 예정

---

## 작업 메모

### 작업 1 완료 (현재 사용 중인 모든 Vuetify 컴포넌트 목록 작성)
**완료 날짜:** 작업 완료  
**결과:** 
- 총 40개 이상의 Vuetify 컴포넌트 식별
- 15개 파일에서 사용 중인 컴포넌트 매핑 완료
- 주요 카테고리: 레이아웃, 폼, 카드, 리스트, 네비게이션, 피드백, 데이터 표시

**다음 작업 (작업 1-2): 각 컴포넌트별 shadcn-vue 대응 컴포넌트 매핑**
- 필요 정보:
  - shadcn-vue 공식 문서 확인 필요
  - 각 Vuetify 컴포넌트의 기능과 shadcn-vue 컴포넌트 대응 관계 정리
  - 없거나 대체가 필요한 컴포넌트 식별 (예: v-timeline, v-expansion-panels 등)
  - 커스텀 컴포넌트 생성이 필요한 항목 목록 작성

**참고 링크:**
- shadcn-vue: https://www.shadcn-vue.com/
- Radix Vue: https://www.radix-vue.com/
- Tailwind CSS: https://tailwindcss.com/
