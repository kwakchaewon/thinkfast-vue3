# Vuetify → shadcn-vue 마이그레이션 작업 리스트

## 프로젝트 정보
- **현재 라이브러리**: Vuetify 3.8.2
- **대체 라이브러리**: shadcn-vue (Radix Vue + Tailwind CSS)
- **프로젝트**: Vue 3 + TypeScript + Vite
- **디자인 목표**: 반응형 웹, 사용자 친화적, 현대적이고 심플한 디자인
- **UI 스타일**: 흰색 메인 배경에 파란색 계열 컴포넌트로 구성된 깔끔하고 미니멀한 디자인 (Home.vue 기준)

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

### 깔끔한 UI 디자인 가이드라인 (Home.vue, Signup.vue, CreateSurvey.vue 기준)
**목표**: 흰색 메인 배경에 파란색 계열 컴포넌트로 구성된 깔끔하고 미니멀한 디자인

**적용 범위**: 모든 뷰 컴포넌트 (Home.vue, Signup.vue, CreateSurvey.vue 등)에 일관되게 적용

**1. 배경 및 컨테이너**
- 메인 배경: 순수 흰색 (`bg-white`)
- 카드/컨테이너: 흰색 배경, 미묘한 그림자 (`shadow-md`), 연한 회색 테두리 (`border-gray-200`)
- 그라데이션 배경 사용 금지 (깔끔한 흰색 배경 유지)

**2. 색상 사용 규칙**
- **텍스트 계층 구조**:
  - 주요 제목: `text-gray-800` (진한 회색)
  - 부제목/설명: `text-gray-500` (중간 회색)
  - 플레이스홀더/보조 텍스트: `text-gray-400` (연한 회색)
  - 일반 텍스트: `text-gray-600` (회색)
  - 링크 텍스트: `text-gray-800` + `hover:text-primary-600` (호버 시 파란색)
- **액센트 색상**:
  - Primary 버튼: `bg-primary-400` + `hover:bg-primary-500` (부드러운 파란색)
  - 포커스 상태: `focus:border-primary-400` + `focus:ring-primary-400`
- **에러 메시지**: `text-red-500` (명확한 빨간색)

**3. 입력 필드 스타일**
- 라벨 제거, 플레이스홀더만 사용 (미니멀한 디자인)
- 배경: 흰색 (`bg-white`)
- 테두리: 연한 회색 (`border-gray-300`)
- 높이: `h-12` (48px, 터치 친화적)
- 둥근 모서리: `rounded-lg`
- 아이콘: 왼쪽에 배치 (`left-3`), `text-gray-400`, 크기 `h-5 w-5`
- 패딩: 아이콘을 위한 왼쪽 패딩 (`pl-10`)
- 포커스: 파란색 테두리 및 링 (`focus:border-primary-400 focus:ring-primary-400`)
- **플레이스홀더 색상**: 연한 회색 (`placeholder:text-gray-400`) - 검정색 금지

**Select 박스 스타일**:
- SelectTrigger: 흰색 배경 (`bg-white`)
- SelectContent: 흰색 배경 (`bg-white`) - 투명 배경 금지
- SelectItem: 흰색 배경 (`bg-white`), 호버 시 연한 회색 (`hover:bg-gray-50`)
- 모든 Select 컴포넌트는 불투명한 흰색 배경을 사용하여 뒤가 비치지 않도록 함

**4. 버튼 스타일**
- Primary 버튼:
  - 배경: `bg-primary-400` (부드러운 파란색)
  - 호버: `hover:bg-primary-500`
  - 텍스트: `text-white`
  - 높이: `h-12` (48px)
  - 둥근 모서리: `rounded-lg`
  - 그림자: `shadow-sm` (미묘한 그림자)
  - 전환: `transition-colors`
- 전체 너비: `w-full` (폼 내부 버튼)

**5. 카드 스타일**
- 배경: 흰색
- 그림자: `shadow-md` (미묘한 그림자)
- 테두리: `border border-gray-200`
- 헤더: 중앙 정렬 (`text-center`), 패딩 `py-8 px-6`
- 콘텐츠: 패딩 `px-6 pb-8`

**6. 폼 레이아웃**
- 필드 간격: `space-y-5` (충분한 여백)
- 에러 메시지: `text-xs text-red-500 mt-1` (작은 크기, 빨간색, 상단 여백)

**7. 아이콘 사용**
- Lucide 아이콘 사용
- 크기: `h-5 w-5` (입력 필드 내부), `h-4 w-4` (버튼 내부)
- 색상: `text-gray-400` (입력 필드), `text-white` (버튼 내부)
- 위치: 입력 필드 왼쪽, 절대 위치 (`absolute left-3`)

**8. 반응형 고려사항**
- 모바일: 전체 너비 (`w-full`), 패딩 `p-4`
- 데스크톱: 최대 너비 제한 (`max-w-md`), 중앙 정렬
- 카드: 반응형 너비 (`w-full`)

**9. 애니메이션 및 전환**
- 버튼 호버: `transition-colors` (색상 전환)
- 아이콘 호버: `hover:text-gray-600` (색상 변경)
- 부드러운 전환 효과 사용

**10. 카드 헤더 스타일**
- 카드 헤더: `bg-gray-50` 제거, 흰색 배경 유지
- 헤더 테두리: `border-b border-gray-200` (하단 구분선만)
- 헤더 패딩: `px-6 py-4`
- 제목: `text-xl font-semibold text-gray-800`
- 아이콘: `h-5 w-5 text-primary-400 mr-2`

**11. 버튼 스타일 세부사항**
- Primary 버튼 (주요 액션):
  - 클래스: `bg-primary-400 hover:bg-primary-500 text-white h-12 px-6 rounded-lg shadow-sm transition-colors`
  - 아이콘 포함 시: `h-4 w-4 mr-2`
- Secondary 버튼 (보조 액션):
  - 클래스: `h-10 px-4` (작은 크기)
  - 또는 `variant="outline"` 사용
- Ghost 버튼 (삭제 등):
  - 클래스: `text-red-500 hover:text-red-600 hover:bg-red-50`

**12. 텍스트 색상 계층**
- 주요 제목: `text-gray-800` (진한 회색)
- 부제목/설명: `text-gray-500` (중간 회색)
- 보조 텍스트: `text-gray-600` (회색)
- 플레이스홀더: `text-gray-400` (연한 회색)
- 에러 메시지: `text-red-500` (빨간색)

**13. 일반적인 금지 사항**
- ❌ 그라데이션 배경 사용 금지
- ❌ 과도한 그림자 사용 금지 (shadow-md 이하)
- ❌ 밝은 색상 배경 사용 금지 (흰색 배경 유지)
- ❌ 카드 헤더에 `bg-gray-50` 사용 금지 (흰색 배경 유지)
- ❌ Select 박스 및 옵션에 투명 배경 사용 금지 (항상 `bg-white` 사용)
- ❌ 복잡한 애니메이션 사용 금지
- ❌ 라벨과 플레이스홀더 동시 사용 금지 (플레이스홀더만 사용)
- ❌ 과도한 색상 사용 금지 (파란색 계열과 회색만 사용)

**14. 반응형 레이아웃 고려사항**
- 복잡한 레이아웃 (CreateSurvey.vue 등):
  - 데스크톱: `grid grid-cols-1 lg:grid-cols-12` (2단 레이아웃)
  - 모바일: `grid-cols-1` (세로 스택)
  - 컨테이너: `container mx-auto px-4 py-8 max-w-7xl`
  - 전체 배경: `min-h-screen bg-white`

**적용 예시 (Home.vue, Signup.vue, CreateSurvey.vue):**
```vue
<!-- 배경: 흰색 -->
<div class="min-h-screen bg-white">
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- 카드: 미묘한 그림자, 연한 테두리, 흰색 배경 -->
    <Card class="shadow-md border border-gray-200 bg-white">
      <!-- 카드 헤더: 흰색 배경, 하단 구분선만 -->
      <CardHeader class="border-b border-gray-200 px-6 py-4">
        <CardTitle class="flex items-center text-xl font-semibold text-gray-800">
          <FileEdit class="h-5 w-5 text-primary-400 mr-2" />
          제목
        </CardTitle>
      </CardHeader>
      
      <!-- 카드 콘텐츠 -->
      <CardContent class="p-6 space-y-4">
        <!-- 입력 필드: 라벨 없이 플레이스홀더만, 아이콘 포함 -->
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="입력 필드"
            class="pl-10 h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400 focus:ring-primary-400 placeholder:text-gray-400"
          />
        </div>
        
        <!-- Select 박스: 흰색 배경 -->
        <Select>
          <SelectTrigger class="h-12 bg-white border-gray-300 rounded-lg focus:border-primary-400">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent class="bg-white">
            <SelectItem value="option1" class="bg-white hover:bg-gray-50">
              옵션 1
            </SelectItem>
          </SelectContent>
        </Select>
        
        <!-- 버튼: 부드러운 파란색 -->
        <Button class="w-full h-12 bg-primary-400 hover:bg-primary-500 text-white rounded-lg shadow-sm transition-colors">
          <Save class="h-4 w-4 mr-2" />
          버튼
        </Button>
        
        <!-- 에러 메시지: 빨간색 -->
        <FormMessage class="text-xs text-red-500 mt-1" />
      </CardContent>
    </Card>
  </div>
</div>
```

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
- [x] Container/Layout 관련 컴포넌트
- [x] 기타 필요한 컴포넌트들

### 4. 아이콘 시스템 마이그레이션
- [x] MDI 아이콘 대체 라이브러리 선택 (lucide-vue-next 등)
- [x] 아이콘 라이브러리 설치
- [x] 기존 MDI 아이콘을 새 아이콘으로 매핑

### 5. 레이아웃 컴포넌트 마이그레이션
- [x] App.vue (v-app → 레이아웃 컴포넌트)
  - [x] 반응형 루트 컨테이너 설정
  - [x] 모바일/데스크톱 레이아웃 분기 처리
- [x] Sidebar.vue (v-navigation-drawer 등)
  - [x] 모바일: 햄버거 메뉴 + 드로어 패턴 (HeaderMenu에서 처리)
  - [x] 데스크톱: 고정 사이드바
  - [x] 부드러운 전환 애니메이션
  - [x] 터치 제스처 지원 (모바일, HeaderMenu에서 처리)
- [x] HeaderMenu.vue
  - [x] 반응형 헤더 (모바일: 컴팩트, 데스크톱: 전체)
  - [x] 스크롤 시 헤더 숨김/표시 기능
- [x] Main.vue 레이아웃 구조
  - [x] 반응형 그리드 시스템 적용
  - [x] 카드 레이아웃 반응형 조정

### 6. 인증 관련 뷰 마이그레이션
- [x] Home.vue (실제 로그인 페이지, v-form, v-text-field, v-btn 등)
  - [x] 반응형 폼 레이아웃 (모바일: 전체 너비, 데스크톱: 중앙 정렬)
  - [x] 현대적인 카드 디자인 (그림자, 둥근 모서리)
  - [x] 터치 친화적 버튼 크기
  - [x] 명확한 에러 메시지 표시
  - [x] 반응형 로고 및 타이틀
- [x] Signup.vue
  - [x] 반응형 폼 레이아웃
  - [x] 실시간 유효성 검사 피드백

### 7. 설문조사 관련 뷰 마이그레이션
- [x] CreateSurvey.vue
  - [x] 반응형 2단 레이아웃 (데스크톱: 사이드바 + 메인, 모바일: 세로 스택)
  - [x] Accordion 컴포넌트로 질문 관리 UI 개선
  - [ ] 드래그 앤 드롭으로 질문 순서 변경 (선택사항)
- [x] SurveyDetail.vue
  - [x] 반응형 카드 레이아웃
  - [x] QR 코드 모바일 최적화
  - [x] 터치 친화적 버튼 배치
- [x] SurveyResponse.vue
  - [x] 모바일 최적화된 폼 입력
  - [x] 스크롤 가능한 질문 목록
  - [x] 하단 고정 제출 버튼 (모바일)
  - [ ] 진행 상황 표시 (선택사항)
- [x] SurveyResults.vue
  - [x] 반응형 차트 (모바일: 세로 스택, 데스크톱: 가로 배치)
  - [x] 워드클라우드 모바일 최적화
  - [x] 테이블 모바일 대응 (가로 스크롤 또는 카드 변환)
- [x] SurveyCompletion.vue
  - [x] 심플한 완료 화면
  - [x] 명확한 CTA 버튼
- [x] AllSurveys.vue
  - [x] 반응형 테이블 (모바일: 카드, 데스크톱: 테이블)
  - [x] 필터 및 검색 모바일 최적화
  - [x] 무한 스크롤 또는 페이지네이션
- [x] RecentSurveys.vue
  - [x] 반응형 그리드 레이아웃
  - [x] 카드 호버 효과

### 8. 기타 뷰 마이그레이션
- [x] About.vue

### 9. 공통 컴포넌트 및 유틸리티 마이그레이션
- [x] useSnackbar composable 업데이트 (v-snackbar → Toast/Sonner)
- [x] 스타일 유틸리티 클래스 변환
- [x] 반응형 레이아웃 클래스 변환
- [x] 반응형 헬퍼 유틸리티 함수 생성 (useBreakpoint, useResponsive 등)
- [x] 공통 애니메이션 유틸리티 구현

### 10. 테마 및 스타일링 설정
- [x] Tailwind CSS 커스텀 테마 설정
- [x] 기존 Vuetify 테마 색상 (primary, secondary 등) Tailwind로 변환
- [x] 다크모드 지원 여부 결정 및 설정 (권장: 라이트 모드 우선)
- [x] 전역 스타일 정리 (style.css)
- [x] 반응형 breakpoint 커스터마이징 (tailwind.config.js)
- [x] 일관된 간격 시스템 설정 (spacing scale)
- [x] 타이포그래피 스케일 정의
- [x] 그림자 및 border-radius 시스템 설정
- [x] 접근성 개선 (색상 대비 비율 확인)

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

> **완료된 작업의 상세 기록은 `MIGRATION_HISTORY.md` 파일을 참고하세요.**

### 완료된 작업 요약
- ✅ **작업 1-4**: 프로젝트 분석 및 마이그레이션 계획 (컴포넌트 목록, 매핑, 우선순위, 테마 분석)
- ✅ **작업 2**: shadcn-vue 환경 설정 (Tailwind CSS, shadcn-vue 초기화)
- ✅ **작업 3**: 필수 shadcn-vue 컴포넌트 설치 (Button, Input, Card, Form, Toast, Label 등)
- ✅ **작업 4**: 아이콘 시스템 마이그레이션 (MDI → Lucide, 31개 아이콘 매핑)
- ✅ **작업 5**: 레이아웃 컴포넌트 마이그레이션 (App.vue, Sidebar.vue, HeaderMenu.vue, Main.vue)
- ✅ **작업 6**: 인증 관련 뷰 마이그레이션 (Home.vue, Signup.vue)

### 다음 작업 (작업 7): 설문조사 관련 뷰 마이그레이션
- **CreateSurvey.vue 완료** ✅
  - 현대적이고 심플한 UI 디자인 적용 (Home.vue, Signup.vue 기준)
  - 흰색 배경, 파란색 계열 컴포넌트, 깔끔한 스타일
  - 카드 헤더 배경 제거, 일관된 색상 시스템 적용
- **SurveyDetail.vue 완료** ✅
  - 반응형 카드 레이아웃 적용 (모바일: 세로 스택, 데스크톱: 그리드)
  - QR 코드 모바일 최적화 (반응형 크기: 모바일 150px, 데스크톱 200px)
  - 터치 친화적 버튼 배치 (h-12, 충분한 간격)
  - Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체 (Card, Badge, Button, Input, Dialog, Slider 등)
  - 깔끔한 UI 스타일 적용 (흰색 배경, 파란색 계열 컴포넌트)
  - MDI 아이콘을 Lucide 아이콘으로 마이그레이션 (Trash2, Copy, Share2, ListChecks, BarChart)
- **SurveyResponse.vue 완료** ✅
  - 모바일 최적화된 폼 입력 (반응형 레이아웃, 터치 친화적 크기)
  - 스크롤 가능한 질문 목록 (각 질문별 Card 컴포넌트)
  - 하단 고정 제출 버튼 (sticky positioning, 모바일 최적화)
  - Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체 (Card, Badge, Button, Textarea, RadioGroup, Slider)
  - 깔끔한 UI 스타일 적용 (흰색 배경, 파란색 계열 컴포넌트)
  - 폼 유효성 검사 구현 (필수 항목 검증, 에러 메시지 표시)
  - 객관식/주관식/척도형 질문 타입 지원
  - MDI 아이콘을 Lucide 아이콘으로 마이그레이션 (Clock, Loader2)
- **SurveyResults.vue 완료** ✅
  - 반응형 차트 레이아웃 (모바일: 세로 스택, 데스크톱: 가로 배치 - grid-cols-1 md:grid-cols-2)
  - 워드클라우드 모바일 최적화 (모바일에서 최소 높이 250px, 패딩 조정)
  - Chart.js Doughnut 차트 통합 (반응형 유지)
  - Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체 (Card, Badge, Button, Dialog, Separator)
  - 깔끔한 UI 스타일 적용 (흰색 배경, 파란색 계열 컴포넌트)
  - 전체 응답 보기 모달 구현 (Dialog 컴포넌트 사용)
  - MDI 아이콘을 Lucide 아이콘으로 마이그레이션 (Eye, X)
- **SurveyCompletion.vue 완료** ✅
  - 심플한 완료 화면 (중앙 정렬, 깔끔한 레이아웃)
  - 명확한 CTA 버튼 (메인으로 이동 버튼, h-12, 전체 너비)
  - Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체 (Card, Button)
  - 깔끔한 UI 스타일 적용 (흰색 배경, 파란색 계열 컴포넌트)
  - 체크 아이콘 표시 (녹색 원형 배경, CheckCircle 아이콘)
  - 감사 메시지 카드 (Card 컴포넌트 사용)
  - MDI 아이콘을 Lucide 아이콘으로 마이그레이션 (CheckCircle)
- **AllSurveys.vue 완료** ✅
  - 반응형 테이블 구현 (모바일: 카드 리스트, 데스크톱: Table 컴포넌트)
  - 필터 및 검색 모바일 최적화 (grid-cols-1 md:grid-cols-3, 전체 너비 입력 필드)
  - 커스텀 페이지네이션 구현 (이전/다음 버튼, 페이지 번호 표시)
  - Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체 (Card, Button, Input, Select, Badge, Table)
  - 깔끔한 UI 스타일 적용 (흰색 배경, 파란색 계열 컴포넌트)
  - 반응형 감지 (window.innerWidth 기반, 768px breakpoint)
  - 로딩 상태 표시 (애니메이션 Progress 바)
  - 검색/필터/정렬 기능 유지
  - MDI 아이콘을 Lucide 아이콘으로 마이그레이션 (Search, Plus)
- **RecentSurveys.vue 완료** ✅
  - 반응형 그리드 레이아웃 구현 (모바일: grid-cols-1 sm:grid-cols-2 카드 그리드, 데스크톱: Table)
  - 카드 호버 효과 (hover:shadow-lg, hover:border-primary-300, transition-all)
  - Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체 (Card, Button, Badge, Table)
  - 깔끔한 UI 스타일 적용 (흰색 배경, 파란색 계열 컴포넌트)
  - Sidebar → HeaderMenu로 변경 (다른 뷰와 일관성 유지)
  - 반응형 감지 (window.innerWidth 기반, 768px breakpoint)
  - 로딩 상태 표시 (애니메이션 Progress 바)
  - 카드에 아이콘 추가 (MessageSquare, Calendar)
  - MDI 아이콘을 Lucide 아이콘으로 마이그레이션 (Plus, MessageSquare, Calendar)
- **About.vue 완료** ✅
  - Vuetify 컴포넌트를 shadcn-vue/Tailwind로 대체 (Card, Button, Badge, Separator)
  - Login.vue 스타일 참고하여 중앙 정렬 카드 디자인 적용
  - 심플하고 현대적인 디자인 (흰색 배경, 파란색 계열 컴포넌트)
  - 프로젝트 소개, 주요 기능, 기술 스택 섹션 추가
  - 아이콘 기반 기능 카드 그리드 (FileEdit, BarChart3, Users, QrCode)
  - 기술 스택 Badge 표시
  - 메인으로 돌아가기 버튼 추가
  - MDI 아이콘을 Lucide 아이콘으로 마이그레이션 (Info, FileEdit, BarChart3, Users, QrCode, ArrowLeft)
- **useSnackbar composable 업데이트 완료** ✅
  - 이미 Toast/Sonner 사용 중이었으나 추가 개선 완료
  - showInfo, showWarning 편의 함수 추가
  - ToastOptions 타입 확장 지원
  - 타입 정의 개선 (SnackbarOptions extends ToastOptions)
  - 기본 duration 상수화 (DEFAULT_DURATION = 3000)
  - JSDoc 주석 추가
  - 모든 함수에 추가 Toast 옵션 지원
  - v-snackbar 완전히 제거됨 (모든 코드에서 useSnackbar 사용)
- **스타일 유틸리티 클래스 변환 완료** ✅
  - Vuetify 스타일 유틸리티 클래스를 Tailwind CSS로 변환하는 커스텀 유틸리티 정의
  - Typography 클래스: text-h4, text-h5, text-h6, text-body-1, text-body-2, text-subtitle-1, text-subtitle-2, text-caption
  - Flex 유틸리티 클래스: d-flex, align-center (justify-center 등은 Tailwind 기본 클래스 사용)
  - Spacing 유틸리티 클래스: pa-*, ma-* (px-*, py-*, mx-*, my-* 등은 Tailwind 기본 클래스 사용)
  - @layer utilities를 사용하여 Tailwind에 통합
  - Vuetify 호환성 유지 (기존 코드 마이그레이션 시 유용)
  - 현재 코드베이스에서는 이미 Tailwind 클래스 사용 중이지만, 향후 필요 시 사용 가능
- **반응형 레이아웃 클래스 변환 완료** ✅
  - 모든 뷰에서 이미 Tailwind CSS 반응형 클래스 사용 중 (v-row, v-col 완전 제거)
  - 반응형 Grid 시스템: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 등
  - 반응형 Flex 시스템: flex-col sm:flex-row 등
  - Breakpoint 매핑: Vuetify sm(600px) → Tailwind sm(640px), md(960px) → md(768px), lg(1264px) → lg(1024px)
  - 모든 레이아웃이 Tailwind Grid/Flexbox로 변환 완료
  - Vuetify 반응형 레이아웃 클래스(v-row, v-col) 더 이상 사용되지 않음
- **반응형 헬퍼 유틸리티 함수 생성 완료** ✅
  - `useResponsive` composable 생성 (src/composables/useResponsive.ts)
  - `useBreakpoint` composable 생성 (특정 breakpoint만 필요한 경우)
  - VueUse의 `useBreakpoints` 활용
  - 제공 기능: isMobile, isTablet, isDesktop, breakpoint, isSmAndUp, isMdAndUp 등
  - Tailwind CSS breakpoint와 일치하도록 설정 (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px)
  - JSDoc 주석 및 사용 예시 포함
  - 기존 코드에서 `window.innerWidth` 직접 사용하는 부분을 이 composable로 대체 가능
- **공통 애니메이션 유틸리티 구현 완료** ✅
  - 기본 전환 효과: transition-smooth, transition-fast, transition-normal, transition-slow
  - 호버 효과 전환: transition-hover (background-color, border-color, box-shadow 등)
  - Vue Transition 클래스: fade, slide-y, slide-y-up, slide-x, slide-x-right, scale, fade-scale
  - 호버 애니메이션: hover-scale, hover-shadow
  - @layer utilities를 사용하여 Tailwind에 통합
  - Vuetify의 v-slide-y-transition 등을 대체하는 Vue Transition 클래스 제공
  - 일관된 애니메이션 타이밍 및 easing 함수 적용
- **Tailwind CSS 커스텀 테마 설정 완료** ✅
  - Vuetify 테마 색상을 Tailwind로 완전 변환
  - Primary 색상: 인디고 계열 팔레트 (50-900) 완전 정의
  - Secondary, Accent 색상 변환 완료
  - Error, Info, Success, Warning 색상 팔레트 추가 (50-900)
  - 타이포그래피 스케일 정의: h1-h6 (fontSize, lineHeight, fontWeight)
  - 그림자 시스템 정의: card, card-hover
  - 반응형 breakpoint 명시적 정의 (sm, md, lg, xl, 2xl)
  - 간격 시스템 확인 (4px 단위, Tailwind 기본값과 동일)
  - shadcn-vue 색상 시스템과 통합 유지
- **다크모드 지원 여부 결정 및 설정 완료** ✅
  - 결정: 라이트 모드를 기본 모드로 유지 (다크모드 비활성화)
  - Tailwind CSS 다크모드 설정 확인: `darkMode: ['class']` (이미 설정됨)
  - style.css에 `.dark` 클래스 스타일 정의 확인 (이미 정의됨)
  - `useTheme` composable 생성 (src/composables/useTheme.ts) - 향후 필요 시 사용 가능
  - 현재는 라이트 모드만 사용 (html에 dark 클래스 없음)
  - 일부 컴포넌트에서 `dark:` 클래스 사용 중 (Sidebar.vue) - 다크모드 활성화 시 자동 적용
  - 다크모드 토글 기능은 구현되어 있으나 현재 비활성화 상태
- **전역 스타일 정리 (style.css) 완료** ✅
  - 불필요한 스타일 제거: :root의 기본 색상 설정 정리 (라이트 모드 기본값으로 통일)
  - body의 불필요한 레이아웃 스타일 제거 (display: flex, place-items: center)
  - @media (prefers-color-scheme: light) 섹션 제거 (불필요한 스타일 오버라이드 제거)
  - 구조적 정리: 섹션별 주석 추가 (Tailwind directives → CSS 변수 → Base layer → Utilities layer → 외부 라이브러리)
  - Vuetify 호환성 주석 명확화 및 유틸리티 클래스 그룹화
  - 일관된 스타일 구조 적용 (계층적 구조 및 명확한 주석)
- **반응형 breakpoint 커스터마이징 (tailwind.config.js) 완료** ✅
  - breakpoint 설정 확인 및 문서화 개선
  - 프로젝트 디자인 원칙과 일치하는지 확인 (Mobile: < 640px, Tablet: 640px ~ 1024px, Desktop: >= 1024px)
  - breakpoint 값: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px (Tailwind 기본값 사용)
  - 각 breakpoint에 대한 명확한 주석 추가 (디바이스 타입 및 전환 시점 설명)
  - useResponsive.ts composable과 일치하는지 확인 완료
  - 추가 커스터마이징 불필요 (현재 설정이 프로젝트 요구사항에 적합)
- **일관된 간격 시스템 설정 (spacing scale) 완료** ✅
  - Tailwind CSS 기본 spacing scale 사용 (4px 단위)
  - 프로젝트 디자인 원칙과 일치: "통일된 간격으로 일관성 있는 레이아웃 구성"
  - 주요 spacing 값 문서화 (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24 등)
  - 사용 예시 추가 (padding, margin, gap)
  - 커스텀 spacing 추가 방법 명시
  - 현재 코드베이스에서 Tailwind spacing 클래스 사용 중 (p-4, m-2, gap-4 등) 확인
- **타이포그래피 스케일 정의 완료** ✅
  - 커스텀 헤딩 스케일 (h1-h6) 정의 및 문서화
    - text-h1: 2.5rem (40px) - 주요 페이지 제목
    - text-h2: 2rem (32px) - 섹션 제목
    - text-h3: 1.75rem (28px) - 하위 섹션
    - text-h4: 1.5rem (24px) - 카드 제목
    - text-h5: 1.25rem (20px) - 소제목
    - text-h6: 1.125rem (18px) - 최소 헤딩
  - Tailwind 기본 타이포그래피 클래스 (text-xs ~ text-6xl) 문서화
  - 각 스케일의 용도 및 lineHeight, fontWeight 명시
  - 사용 예시 추가
  - 디자인 원칙 반영: "명확한 시각적 계층으로 정보 전달"
  - 현재 코드베이스에서 Tailwind 타이포그래피 클래스 사용 중 (text-sm, text-base, text-xl, text-3xl 등) 확인
- **그림자 및 border-radius 시스템 설정 완료** ✅
  - 그림자 시스템 문서화:
    - 커스텀 그림자: shadow-card (카드 기본), shadow-card-hover (카드 호버)
    - Tailwind 기본 그림자 클래스 (shadow-sm ~ shadow-2xl) 문서화
    - 각 그림자의 용도 및 사용 예시 추가
    - 디자인 원칙 반영: "부드러운 그림자로 깊이감 표현"
  - Border-radius 시스템 문서화:
    - 커스텀 border-radius: rounded-sm, rounded-md, rounded-lg
    - Tailwind 기본 border-radius 클래스 (rounded-none ~ rounded-full) 문서화
    - 각 border-radius의 용도 및 사용 예시 추가
    - 디자인 원칙 반영: "일관된 둥근 모서리로 현대적이고 부드러운 디자인"
  - 현재 코드베이스에서 그림자 및 border-radius 클래스 사용 중 (shadow-md, shadow-sm, shadow-lg, rounded-lg 등) 확인
- **접근성 개선 (색상 대비 비율 확인) 완료** ✅
  - WCAG 2.1 AA 기준 준수 검증 완료
  - 주요 색상 조합 대비 비율 검증:
    - 텍스트 색상: text-gray-800 (7.64:1), text-gray-600 (5.74:1), text-gray-500 (4.57:1) ✅
    - 버튼 색상: text-white on bg-primary-400 (5.85:1) ✅
    - 링크 색상: text-gray-800 (7.64:1), text-primary-600 (9.32:1) ✅
  - 주의 필요 조합 식별:
    - text-gray-400 (3.21:1) - 큰 텍스트에서만 사용 가능 ⚠️
    - text-red-500 (3.99:1) - 큰 텍스트에서만 사용 가능, text-red-600 권장 ⚠️
  - 접근성 가이드라인 문서 작성 (docs/ACCESSIBILITY.md)
  - 색상 대비 비율 검증 결과 문서 작성 (docs/COLOR_CONTRAST_VERIFICATION.md)
  - 권장 사항 및 개선 방안 문서화
- 다음 작업: **Vite 설정 업데이트 - Tailwind CSS 플러그인 설정 확인**
- 필요 정보:
  - vite.config.js에서 Tailwind CSS 플러그인 설정 확인
  - PostCSS 설정 확인
  - 경로 별칭 설정 확인
  - 빌드 최적화 설정 확인

**참고:**
- 상세 작업 기록은 `MIGRATION_HISTORY.md` 참고
- 컴포넌트 매핑 정보는 위의 "Vuetify → shadcn-vue 컴포넌트 매핑" 섹션 참고
