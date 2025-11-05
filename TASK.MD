# Vuetify → shadcn-vue 마이그레이션 작업 리스트

## 프로젝트 정보
- **현재 라이브러리**: Vuetify 3.8.2
- **대체 라이브러리**: shadcn-vue (Radix Vue + Tailwind CSS)
- **프로젝트**: Vue 3 + TypeScript + Vite
- **디자인 목표**: 반응형 웹, 사용자 친화적, 현대적이고 심플한 디자인

---

## 디자인 원칙 및 가이드라인

### 반응형 디자인 전략
- **모바일 퍼스트 접근**: 모바일부터 시작하여 데스크톱으로 확장
- **Breakpoint 설정**:
  - Mobile: < 640px (sm 미만)
  - Tablet: 640px ~ 1024px (sm ~ lg)
  - Desktop: > 1024px (lg 이상)
- **Tailwind CSS 반응형 클래스 활용**: `sm:`, `md:`, `lg:`, `xl:` prefix 사용
- **유연한 레이아웃**: Flexbox와 Grid를 활용한 적응형 레이아웃
- **터치 친화적 인터페이스**: 모바일에서 최소 터치 영역 44x44px 확보

### 현대적이고 심플한 디자인 원칙
1. **미니멀리즘**: 불필요한 요소 제거, 핵심 기능에 집중
2. **일관성**: 통일된 간격, 색상, 타이포그래피 시스템
3. **계층 구조**: 명확한 시각적 계층으로 정보 전달
4. **여백 활용**: 충분한 여백(whitespace)으로 가독성 향상
5. **부드러운 애니메이션**: 미묘하고 자연스러운 전환 효과
6. **접근성**: WCAG 2.1 AA 기준 준수 (색상 대비, 키보드 네비게이션 등)

### 사용자 경험(UX) 고려사항
- **직관적인 네비게이션**: 명확한 메뉴 구조와 브레드크럼
- **빠른 로딩**: 이미지 최적화, 코드 스플리팅
- **명확한 피드백**: 버튼 클릭, 폼 제출, 에러 상태 등 즉각적인 시각적 피드백
- **에러 처리**: 명확하고 도움되는 에러 메시지
- **로딩 상태**: 진행 중인 작업에 대한 명확한 인디케이터

### 디자인 시스템
- **색상 팔레트**: 기존 인디고 계열 유지, Tailwind CSS 색상 시스템으로 통합
  - Primary: #3949AB (인디고)
  - Secondary: #5C6BC0 (밝은 인디고)
  - Accent: #1A237E (진한 인디고)
  - Success: #4CAF50
  - Error: #EF4444 (Tailwind red-500)
  - Warning: #F59E0B (Tailwind amber-500)
  - Info: #3B82F6 (Tailwind blue-500)
- **타이포그래피**: 
  - 폰트: 시스템 폰트 스택 또는 Inter/Pretendard
  - 크기: Tailwind의 text-sm, text-base, text-lg 등 활용
- **간격 시스템**: Tailwind의 spacing scale (4px 단위)
- **그림자**: 부드러운 그림자로 깊이감 표현 (shadow-sm, shadow-md)
- **둥근 모서리**: 일관된 border-radius (rounded-md, rounded-lg)

---

## 작업 리스트

### 1. 프로젝트 분석 및 마이그레이션 계획
- [x] 현재 사용 중인 모든 Vuetify 컴포넌트 목록 작성
- [x] 각 컴포넌트별 shadcn-vue 대응 컴포넌트 매핑
- [x] 마이그레이션 우선순위 결정
- [x] 커스텀 테마 및 스타일 분석

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

#### Vuetify → shadcn-vue 컴포넌트 매핑

**레이아웃 컴포넌트:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-app` | 없음 (Tailwind CSS + 커스텀 레이아웃) | Root div로 대체, 전역 스타일 적용 |
| `v-container` | 없음 (Tailwind: `container mx-auto`) | Tailwind container 클래스 사용 |
| `v-row` / `v-col` | 없음 (Tailwind: `grid`, `flex`) | Tailwind Grid/Flexbox 사용 |
| `v-layout` | 없음 (Tailwind: `flex`, `grid`) | Tailwind 레이아웃 유틸리티 사용 |
| `v-main` | 없음 (Tailwind: `main` 태그 + 스타일) | HTML `<main>` 태그 + Tailwind 클래스 |
| `v-spacer` | 없음 (Tailwind: `flex-1` 또는 `ml-auto`) | Tailwind flex 유틸리티 사용 |

**카드 & 표면 컴포넌트:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-card` | `Card` (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter) | shadcn-vue Card 컴포넌트 사용 |
| `v-card-title` | `CardTitle` | Card 내부 컴포넌트 |
| `v-card-text` | `CardContent` | Card 내부 컴포넌트 |
| `v-card-item` | `CardHeader` 또는 `CardContent` | 용도에 따라 선택 |
| `v-card-actions` | `CardFooter` | Card 내부 컴포넌트 |
| `v-sheet` | 없음 (Tailwind: `div` + 스타일) | Tailwind로 커스텀 div 구현 |

**폼 컴포넌트:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-form` | `Form` (react-hook-form 기반, Vue에서는 vee-validate 사용) | vee-validate 또는 직접 구현 |
| `v-text-field` | `Input` | shadcn-vue Input 컴포넌트 |
| `v-textarea` | `Textarea` | shadcn-vue Textarea 컴포넌트 |
| `v-select` | `Select` (Select, SelectTrigger, SelectContent, SelectItem) | shadcn-vue Select 컴포넌트 |
| `v-switch` | `Switch` | shadcn-vue Switch 컴포넌트 |
| `v-radio-group` / `v-radio` | `RadioGroup` (RadioGroup, RadioGroupItem) | shadcn-vue RadioGroup 컴포넌트 |
| `v-slider` | `Slider` | shadcn-vue Slider 컴포넌트 |

**버튼 & 액션:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-btn` | `Button` | shadcn-vue Button 컴포넌트 (variant, size 지원) |
| `v-icon` | 없음 (lucide-vue-next 아이콘 사용) | lucide-vue-next로 교체 필요 |

**리스트 & 네비게이션:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-list` | 없음 (Tailwind: `ul`, `div` + 스타일) | Tailwind로 커스텀 리스트 구현 |
| `v-list-item` | 없음 (Tailwind: `li` + 스타일) | Tailwind로 커스텀 리스트 아이템 구현 |
| `v-list-item-title` | 없음 (Tailwind: `span` + 스타일) | Tailwind로 커스텀 구현 |
| `v-list-item-subtitle` | 없음 (Tailwind: `span` + 스타일) | Tailwind로 커스텀 구현 |
| `v-list-item-text` | 없음 (Tailwind: `div` + 스타일) | Tailwind로 커스텀 구현 |
| `v-list-subheader` | 없음 (Tailwind: `h3` + 스타일) | Tailwind로 커스텀 구현 |
| `v-navigation-drawer` | 없음 (커스텀 컴포넌트 필요) | **커스텀 컴포넌트 개발 필요** |
| `v-menu` | `DropdownMenu` (DropdownMenu, DropdownMenuTrigger, DropdownMenuContent) | shadcn-vue DropdownMenu 컴포넌트 |

**피드백 & 알림:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-snackbar` | `Toast` 또는 `Sonner` | shadcn-vue Toast 또는 Sonner 사용 권장 |
| `v-chip` | `Badge` | shadcn-vue Badge 컴포넌트로 대체 |
| `v-badge` | `Badge` | shadcn-vue Badge 컴포넌트 |
| `v-progress-linear` | `Progress` | shadcn-vue Progress 컴포넌트 |

**데이터 표시:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-table` | `Table` (Table, TableHeader, TableBody, TableRow, TableHead, TableCell) | shadcn-vue Table 컴포넌트 |
| `v-timeline` / `v-timeline-item` | 없음 (커스텀 컴포넌트 필요) | **커스텀 컴포넌트 개발 필요** |
| `v-avatar` | `Avatar` (Avatar, AvatarImage, AvatarFallback) | shadcn-vue Avatar 컴포넌트 |
| `v-img` | 없음 (HTML `img` + Tailwind) | HTML img 태그 + Tailwind 클래스 사용 |

**다이얼로그 & 오버레이:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-dialog` | `Dialog` (Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter) | shadcn-vue Dialog 컴포넌트 |

**확장/축소:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-expansion-panels` / `v-expansion-panel` | `Accordion` (Accordion, AccordionItem, AccordionTrigger, AccordionContent) | shadcn-vue Accordion 컴포넌트 |

**페이지네이션:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-pagination` | 없음 (커스텀 컴포넌트 필요) | **커스텀 컴포넌트 개발 필요** 또는 shadcn-vue Pagination 추가 확인 |

**기타:**
| Vuetify 컴포넌트 | shadcn-vue 대응 | 비고 |
|----------------|----------------|------|
| `v-divider` | `Separator` | shadcn-vue Separator 컴포넌트 |
| `v-toolbar` / `v-toolbar-title` | 없음 (Tailwind: `header` + 스타일) | Tailwind로 커스텀 헤더 구현 |
| `v-slide-y-transition` | 없음 (Vue Transition + Tailwind) | Vue `<Transition>` + Tailwind 애니메이션 |

**커스텀 컴포넌트 개발이 필요한 항목:**
1. **Navigation Drawer (Sidebar)** - 가장 중요, Sidebar.vue에서 핵심적으로 사용
2. **Timeline** - Main.vue에서 사용, 우선순위 중간
3. **Pagination** - AllSurveys.vue에서 사용, 우선순위 낮음 (일반 컴포넌트로 대체 가능)
4. **List Components** - 리스트 아이템들을 Tailwind로 구현 (복잡도 낮음)

**직접 매핑 가능한 컴포넌트 (우선순위 높음):**
- Button, Input, Textarea, Card, Dialog, Select, Switch, RadioGroup, Slider
- Badge, Avatar, Progress, Table, Accordion, Separator
- Toast/Sonner (snackbar 대체)

#### 마이그레이션 우선순위 결정

**프로젝트 핵심 기능 분석:**
- **주요 기능**: AI 기반 실시간 설문조사 플랫폼
- **핵심 사용자 플로우**:
  1. 인증 (로그인/회원가입) → Home.vue, Login.vue, Signup.vue
  2. 메인 대시보드 → Main.vue
  3. 설문 생성 → CreateSurvey.vue
  4. 설문 관리 및 조회 → SurveyDetail.vue, AllSurveys.vue
  5. 설문 응답 → SurveyResponse.vue
  6. 결과 조회 → SurveyResults.vue

**컴포넌트 사용 빈도 분석:**
- v-btn, v-input, v-text-field, v-card, v-form: 276회 사용 (14개 파일)
- 가장 많이 사용되는 기본 컴포넌트들

**마이그레이션 우선순위 (단계별):**

**Phase 1: 기반 환경 구축 (최우선)**
1. **shadcn-vue 환경 설정** (작업 2)
   - Tailwind CSS 설치 및 설정
   - shadcn-vue 초기화
   - 필수 설정 파일 생성

2. **기본 컴포넌트 설치** (작업 3)
   - Button, Input, Textarea, Label (다른 컴포넌트의 의존성)
   - Card (가장 많이 사용)
   - Separator (Divider)

**Phase 2: 핵심 기능 컴포넌트 (우선순위 높음)**
3. **폼 관련 컴포넌트**
   - Form, Select, Switch, RadioGroup, Slider
   - Toast/Sonner (알림 시스템)

4. **레이아웃 컴포넌트**
   - Navigation Drawer (Sidebar) - 커스텀 개발 필요
   - 반응형 레이아웃 유틸리티

**Phase 3: 데이터 표시 컴포넌트 (우선순위 중간)**
5. **테이블 및 리스트**
   - Table
   - Badge, Avatar
   - 커스텀 List 컴포넌트 (Tailwind 구현)

6. **다이얼로그 및 확장**
   - Dialog
   - Accordion (CreateSurvey.vue에서 사용)

7. **기타 데이터 표시**
   - Progress
   - Timeline (커스텀 개발 필요, Main.vue)

**Phase 4: 부가 기능 및 최적화 (우선순위 낮음)**
8. **아이콘 시스템**
   - lucide-vue-next 설치 및 매핑

9. **커스텀 컴포넌트**
   - Pagination (커스텀 개발 또는 라이브러리)

10. **테마 및 스타일링**
    - 디자인 시스템 통합
    - 반응형 최적화

**Phase 5: 뷰별 마이그레이션 순서**

**우선순위 1 (인증 - 접근성):**
- Home.vue (로그인 폼)
- Login.vue
- Signup.vue

**우선순위 2 (핵심 기능):**
- App.vue (루트 레이아웃)
- Sidebar.vue (네비게이션)
- HeaderMenu.vue
- Main.vue (대시보드)

**우선순위 3 (설문 관리):**
- CreateSurvey.vue (복잡한 폼)
- SurveyDetail.vue
- AllSurveys.vue
- RecentSurveys.vue

**우선순위 4 (설문 응답):**
- SurveyResponse.vue
- SurveyResults.vue
- SurveyCompletion.vue

**우선순위 5 (기타):**
- About.vue

**의존성 관계:**
- Button, Input, Card → 모든 뷰에서 사용 (Phase 1 필수)
- Form, Select → 폼 뷰에서 사용 (Phase 2)
- Navigation Drawer → Sidebar, HeaderMenu (Phase 2)
- Table, Badge → 데이터 표시 뷰 (Phase 3)
- Dialog, Accordion → 특정 뷰에서 사용 (Phase 3)

**예상 작업 시간 (상대적):**
- Phase 1: 1-2일 (환경 설정)
- Phase 2: 3-5일 (핵심 컴포넌트)
- Phase 3: 2-3일 (데이터 표시)
- Phase 4: 1-2일 (부가 기능)
- Phase 5: 5-7일 (뷰 마이그레이션)

**총 예상 기간**: 12-19일 (작업량에 따라 조정)

**위험 요소 및 대응:**
1. **Navigation Drawer 커스텀 개발** - 복잡도 높음, 조기 시작 권장
2. **Timeline 컴포넌트** - 간단한 커스텀 구현 가능
3. **반응형 레이아웃** - Tailwind Grid/Flexbox로 대체, 테스트 중요
4. **폼 유효성 검사** - vee-validate 또는 직접 구현 필요

#### 커스텀 테마 및 스타일 분석

**현재 Vuetify 테마 설정 (src/plugins/vuetify.ts):**
```typescript
const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#3949AB',      // 딥 인디고
    secondary: '#5C6BC0',    // 밝은 인디고
    accent: '#1A237E',       // 진한 인디고
    error: '#FF5252',        // Vuetify 기본 에러 색상
    info: '#2196F3',         // Vuetify 기본 정보 색상
    success: '#4CAF50',      // Vuetify 기본 성공 색상
    warning: '#FFC107',      // Vuetify 기본 경고 색상
  },
}
```

**반응형 Breakpoint 설정:**
- `mobileBreakpoint: 'sm'` (Vuetify 기본: 600px)
- Tailwind CSS와 매핑 필요: sm = 640px

**전역 스타일 (src/style.css):**
- 폰트: `Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`
- 라인 높이: 1.5
- 폰트 웨이트: 400
- 기본 색상 스키마: light/dark 지원
- 배경색: 라이트 모드 #ffffff, 다크 모드 #242424

**커스텀 스타일 패턴 분석:**

**1. 배경 그라데이션 (Home.vue, Signup.vue):**
```css
background: linear-gradient(135deg, #E8EAF6 0%, #5C6BC0 100%);
```
- 인디고 계열 그라데이션
- Tailwind로 변환: `bg-gradient-to-br from-indigo-50 to-indigo-400`

**2. 카드 스타일:**
- `border-radius: 8px` → Tailwind: `rounded-lg`
- `padding: 1.5rem 1rem` → Tailwind: `py-6 px-4`
- `transform: translateY(-5%)` → 커스텀 유틸리티 필요

**3. Vuetify 유틸리티 클래스 사용:**
- `text-h4`, `text-h5`, `text-h6` → Tailwind: `text-2xl`, `text-xl`, `text-lg`
- `text-body-1`, `text-body-2` → Tailwind: `text-base`, `text-sm`
- `text-subtitle-1`, `text-subtitle-2` → Tailwind: `text-lg`, `text-base`
- `text-caption` → Tailwind: `text-xs`
- `mb-2`, `mb-4`, `pa-4` → Tailwind: `mb-2`, `mb-4`, `p-4`
- `d-flex`, `align-center`, `justify-center` → Tailwind: `flex`, `items-center`, `justify-center`

**4. 색상 사용 패턴:**
- `primary` → 인디고 (#3949AB)
- `secondary` → 밝은 인디고 (#5C6BC0)
- `success` → 초록 (#4CAF50)
- `error` → 빨강 (#FF5252)
- `text-grey` → 회색 텍스트

**Tailwind CSS 변환 계획:**

**색상 팔레트 (tailwind.config.js):**
```javascript
colors: {
  primary: {
    DEFAULT: '#3949AB',
    50: '#E8EAF6',
    100: '#C5CAE9',
    200: '#9FA8DA',
    300: '#7986CB',
    400: '#5C6BC0',
    500: '#3949AB',  // DEFAULT
    600: '#303F9F',
    700: '#283593',
    800: '#1A237E',  // accent
    900: '#0D47A1',
  },
  // 기타 색상은 Tailwind 기본 색상 사용
  // success: green-500, error: red-500 등
}
```

**커스텀 유틸리티 클래스:**
- `.text-h4` → `@apply text-2xl font-semibold`
- `.text-h5` → `@apply text-xl font-semibold`
- `.text-h6` → `@apply text-lg font-semibold`
- `.text-body-1` → `@apply text-base`
- `.text-body-2` → `@apply text-sm`
- `.text-subtitle-1` → `@apply text-lg`
- `.text-subtitle-2` → `@apply text-base`
- `.text-caption` → `@apply text-xs`

**간격 시스템:**
- Vuetify: 4px 단위 (0.25rem)
- Tailwind: 4px 단위 (기본값과 동일)
- 변환 1:1 매핑 가능

**그림자 및 테두리:**
- Vuetify `elevation-12` → Tailwind `shadow-lg` 또는 `shadow-xl`
- 카드 `border-radius: 8px` → Tailwind `rounded-lg`

**반응형 Breakpoint 매핑:**
- Vuetify `sm` (600px) → Tailwind `sm` (640px) - 약간 차이 있음
- Vuetify `md` (960px) → Tailwind `md` (768px) - 차이 있음
- Vuetify `lg` (1264px) → Tailwind `lg` (1024px) - 차이 있음
- **주의**: Breakpoint 차이로 인한 레이아웃 조정 필요

**커스텀 스타일 변환 체크리스트:**
- [ ] Tailwind config에 커스텀 색상 팔레트 추가
- [ ] 커스텀 유틸리티 클래스 정의 (text-h4, text-h5 등)
- [ ] 그라데이션 배경 Tailwind 클래스로 변환
- [ ] 반응형 breakpoint 차이 조정
- [ ] 전역 폰트 설정 Tailwind로 통합
- [ ] 카드 스타일 Tailwind 클래스로 변환
- [ ] 간격 시스템 확인 및 통일

### 2. shadcn-vue 환경 설정
- [x] Tailwind CSS 설치 및 설정
- [x] shadcn-vue CLI 설치
- [x] shadcn-vue 초기화 (`npx shadcn-vue@latest init`)
- [x] Radix Vue 의존성 확인
- [x] shadcn-vue 설정 파일 생성 (components.json)

### 3. 필수 shadcn-vue 컴포넌트 설치
- [x] Button 컴포넌트
- [x] Input 컴포넌트
- [x] Card 컴포넌트
- [x] Form 컴포넌트
- [x] Toast/Sonner 컴포넌트 (스낵바 대체)
- [x] Label 컴포넌트
- [ ] Container/Layout 관련 컴포넌트
- [ ] 기타 필요한 컴포넌트들

### 4. 아이콘 시스템 마이그레이션
- [ ] MDI 아이콘 대체 라이브러리 선택 (lucide-vue-next 등)
- [ ] 아이콘 라이브러리 설치
- [ ] 기존 MDI 아이콘을 새 아이콘으로 매핑

### 5. 레이아웃 컴포넌트 마이그레이션
- [ ] App.vue (v-app → 레이아웃 컴포넌트)
  - [ ] 반응형 루트 컨테이너 설정
  - [ ] 모바일/데스크톱 레이아웃 분기 처리
- [ ] Sidebar.vue (v-navigation-drawer 등)
  - [ ] 모바일: 햄버거 메뉴 + 드로어 패턴
  - [ ] 데스크톱: 고정 사이드바
  - [ ] 부드러운 전환 애니메이션
  - [ ] 터치 제스처 지원 (모바일)
- [ ] HeaderMenu.vue
  - [ ] 반응형 헤더 (모바일: 컴팩트, 데스크톱: 전체)
  - [ ] 스크롤 시 헤더 숨김/표시 기능
- [ ] Main.vue 레이아웃 구조
  - [ ] 반응형 그리드 시스템 적용
  - [ ] 카드 레이아웃 반응형 조정

### 6. 인증 관련 뷰 마이그레이션
- [ ] Login.vue (v-form, v-text-field, v-btn 등)
  - [ ] 반응형 폼 레이아웃 (모바일: 전체 너비, 데스크톱: 중앙 정렬)
  - [ ] 현대적인 카드 디자인 (그림자, 둥근 모서리)
  - [ ] 터치 친화적 버튼 크기
  - [ ] 명확한 에러 메시지 표시
- [ ] Signup.vue
  - [ ] 반응형 폼 레이아웃
  - [ ] 단계별 입력 가이드 (선택사항)
  - [ ] 실시간 유효성 검사 피드백
- [ ] Home.vue
  - [ ] 반응형 로고 및 타이틀
  - [ ] 모바일 최적화된 폼 레이아웃

### 7. 설문조사 관련 뷰 마이그레이션
- [ ] CreateSurvey.vue
  - [ ] 반응형 2단 레이아웃 (데스크톱: 사이드바 + 메인, 모바일: 세로 스택)
  - [ ] Accordion 컴포넌트로 질문 관리 UI 개선
  - [ ] 드래그 앤 드롭으로 질문 순서 변경 (선택사항)
- [ ] SurveyDetail.vue
  - [ ] 반응형 카드 레이아웃
  - [ ] QR 코드 모바일 최적화
  - [ ] 터치 친화적 버튼 배치
- [ ] SurveyResponse.vue
  - [ ] 모바일 최적화된 폼 입력
  - [ ] 스크롤 가능한 질문 목록
  - [ ] 하단 고정 제출 버튼 (모바일)
  - [ ] 진행 상황 표시 (선택사항)
- [ ] SurveyResults.vue
  - [ ] 반응형 차트 (모바일: 세로 스택, 데스크톱: 가로 배치)
  - [ ] 워드클라우드 모바일 최적화
  - [ ] 테이블 모바일 대응 (가로 스크롤 또는 카드 변환)
- [ ] SurveyCompletion.vue
  - [ ] 심플한 완료 화면
  - [ ] 명확한 CTA 버튼
- [ ] AllSurveys.vue
  - [ ] 반응형 테이블 (모바일: 카드, 데스크톱: 테이블)
  - [ ] 필터 및 검색 모바일 최적화
  - [ ] 무한 스크롤 또는 페이지네이션
- [ ] RecentSurveys.vue
  - [ ] 반응형 그리드 레이아웃
  - [ ] 카드 호버 효과

### 8. 기타 뷰 마이그레이션
- [ ] About.vue

### 9. 공통 컴포넌트 및 유틸리티 마이그레이션
- [ ] useSnackbar composable 업데이트 (v-snackbar → Toast/Sonner)
- [ ] 스타일 유틸리티 클래스 변환
- [ ] 반응형 레이아웃 클래스 변환
- [ ] 반응형 헬퍼 유틸리티 함수 생성 (useBreakpoint, useResponsive 등)
- [ ] 공통 애니메이션 유틸리티 구현

### 10. 테마 및 스타일링 설정
- [ ] Tailwind CSS 커스텀 테마 설정
- [ ] 기존 Vuetify 테마 색상 (primary, secondary 등) Tailwind로 변환
- [ ] 다크모드 지원 여부 결정 및 설정 (권장: 라이트 모드 우선)
- [ ] 전역 스타일 정리 (style.css)
- [ ] 반응형 breakpoint 커스터마이징 (tailwind.config.js)
- [ ] 일관된 간격 시스템 설정 (spacing scale)
- [ ] 타이포그래피 스케일 정의
- [ ] 그림자 및 border-radius 시스템 설정
- [ ] 접근성 개선 (색상 대비 비율 확인)

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
- [ ] 반응형 디자인 확인
  - [ ] 모바일 (320px, 375px, 414px)
  - [ ] 태블릿 (768px, 1024px)
  - [ ] 데스크톱 (1280px, 1920px)
  - [ ] 가로/세로 모드 전환 테스트
- [ ] 터치 인터랙션 테스트 (모바일 디바이스)
- [ ] 폼 유효성 검사 기능 확인
- [ ] 스낵바/Toast 알림 기능 확인
- [ ] 네비게이션 및 라우팅 확인
- [ ] 브라우저 호환성 테스트 (Chrome, Firefox, Safari, Edge)
- [ ] 접근성 테스트
  - [ ] 키보드 네비게이션
  - [ ] 스크린 리더 테스트
  - [ ] 색상 대비 비율 확인
- [ ] 성능 테스트 (Lighthouse 점수)
- [ ] 로딩 속도 최적화 확인

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

## 반응형 디자인 체크리스트
- [ ] 모든 페이지가 모바일(< 640px)에서 정상 작동
- [ ] 모든 페이지가 태블릿(640px ~ 1024px)에서 정상 작동
- [ ] 모든 페이지가 데스크톱(> 1024px)에서 정상 작동
- [ ] 이미지가 반응형으로 크기 조정됨
- [ ] 텍스트가 모든 화면 크기에서 가독성 확보
- [ ] 버튼과 터치 영역이 모바일에서 충분히 큼 (최소 44x44px)
- [ ] 테이블이 모바일에서 가로 스크롤 또는 카드로 변환됨
- [ ] 폼 입력 필드가 모바일에서 적절한 크기
- [ ] 네비게이션이 모든 화면 크기에서 접근 가능
- [ ] 모달/다이얼로그가 모바일에서 전체 화면 또는 적절한 크기

## 디자인 품질 체크리스트
- [ ] 일관된 색상 시스템 사용
- [ ] 일관된 간격 시스템 사용 (Tailwind spacing scale)
- [ ] 일관된 타이포그래피 시스템 사용
- [ ] 충분한 여백(whitespace) 확보
- [ ] 명확한 시각적 계층 구조
- [ ] 부드러운 애니메이션 및 전환 효과
- [ ] 명확한 피드백 (버튼, 폼, 에러 등)
- [ ] 접근성 고려 (색상 대비, 키보드 네비게이션)
- [ ] 불필요한 요소 제거 (미니멀리즘)
- [ ] 로딩 상태 명확히 표시

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

**다음 작업 (작업 3-7): Container/Layout 관련 컴포넌트**
- 필요 정보:
  - shadcn-vue에는 직접적인 Container/Layout 컴포넌트가 없음
  - Tailwind CSS의 container 클래스와 grid/flex 유틸리티 사용
  - 또는 커스텀 레이아웃 컴포넌트 생성 필요
  - Separator 컴포넌트 설치 가능 (구분선)

**참고 링크:**
- shadcn-vue: https://www.shadcn-vue.com/
- Radix Vue: https://www.radix-vue.com/
- Tailwind CSS: https://tailwindcss.com/
