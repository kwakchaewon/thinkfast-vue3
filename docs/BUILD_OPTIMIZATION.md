# 빌드 최적화 설정 가이드

## 개요

Vite 빌드 최적화 설정 및 최적화 전략을 문서화합니다.

## 현재 최적화 설정

### 1. 빌드 타겟

```typescript
target: 'es2020'
```

- ES2020 이상 지원 브라우저 타겟
- 최신 JavaScript 기능 활용으로 더 작은 번들 크기

### 2. 소스맵

```typescript
sourcemap: false
```

- 프로덕션 빌드에서는 소스맵 비활성화
- 빌드 크기 감소 및 보안 향상

### 3. CSS 최적화

```typescript
cssCodeSplit: true,
minify: 'esbuild'
```

- **CSS 코드 분할**: 각 청크에 필요한 CSS만 포함
- **CSS 최소화**: esbuild 사용 (terser보다 빠름)

### 4. 코드 스플리팅 (Code Splitting)

```typescript
manualChunks: (id) => {
  if (id.includes('node_modules')) {
    // Vue 관련 라이브러리
    if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
      return 'vue-vendor'
    }
    // UI 라이브러리
    if (id.includes('reka-ui') || id.includes('lucide-vue-next')) {
      return 'ui-vendor'
    }
    // Chart 라이브러리
    if (id.includes('chart.js') || id.includes('vue-chartjs')) {
      return 'chart-vendor'
    }
    // 유틸리티 라이브러리
    if (id.includes('axios') || id.includes('@vueuse/core')) {
      return 'utils-vendor'
    }
    // 기타 vendor 라이브러리
    return 'vendor'
  }
}
```

#### 청크 분리 전략

1. **vue-vendor**: Vue, Vue Router, Pinia
   - 핵심 프레임워크 라이브러리
   - 대부분의 페이지에서 사용

2. **ui-vendor**: reka-ui, lucide-vue-next
   - UI 컴포넌트 라이브러리
   - 필요한 페이지에서만 로드

3. **chart-vendor**: Chart.js, vue-chartjs
   - 차트 라이브러리
   - 차트가 필요한 페이지에서만 로드

4. **utils-vendor**: Axios, @vueuse/core
   - 유틸리티 라이브러리
   - 공통 기능 제공

5. **vendor**: 기타 라이브러리
   - 나머지 외부 라이브러리

### 5. 파일명 포맷

```typescript
chunkFileNames: 'assets/js/[name]-[hash].js',
entryFileNames: 'assets/js/[name]-[hash].js',
assetFileNames: (assetInfo) => {
  // CSS 파일
  if (assetInfo.name && assetInfo.name.endsWith('.css')) {
    return 'assets/css/[name]-[hash][extname]'
  }
  // 이미지 파일
  if (assetInfo.name && /\.(png|jpe?g|svg|gif|webp)$/.test(assetInfo.name)) {
    return 'assets/images/[name]-[hash][extname]'
  }
  // 폰트 파일
  if (assetInfo.name && /\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
    return 'assets/fonts/[name]-[hash][extname]'
  }
  // 기타 파일
  return 'assets/[name]-[hash][extname]'
}
```

#### 파일 구조

빌드 후 생성되는 파일 구조:

```
dist/
├── assets/
│   ├── js/
│   │   ├── index-[hash].js
│   │   ├── vue-vendor-[hash].js
│   │   ├── ui-vendor-[hash].js
│   │   ├── chart-vendor-[hash].js
│   │   ├── utils-vendor-[hash].js
│   │   └── vendor-[hash].js
│   ├── css/
│   │   └── index-[hash].css
│   ├── images/
│   │   └── [image]-[hash].png
│   └── fonts/
│       └── [font]-[hash].woff2
└── index.html
```

### 6. 청크 크기 경고

```typescript
chunkSizeWarningLimit: 500
```

- 청크 크기가 500KB를 초과하면 경고 표시
- 큰 청크 식별 및 최적화 유도

### 7. 개발 서버 최적화

```typescript
server: {
  hmr: {
    overlay: true
  }
}
```

- HMR (Hot Module Replacement) 오버레이 활성화
- 개발 중 에러 표시 개선

## 최적화 효과

### 1. 초기 로딩 속도 개선

- 코드 스플리팅으로 초기 로드 청크 크기 감소
- 필요한 청크만 로드하여 초기 로딩 시간 단축

### 2. 캐싱 효율성 향상

- 청크별 해시 파일명으로 변경된 파일만 재로드
- 변경되지 않은 vendor 청크는 캐시 활용

### 3. 병렬 로딩

- 여러 청크를 병렬로 로드 가능
- 네트워크 활용도 향상

## 추가 최적화 권장사항

### 1. 이미지 최적화

- WebP 형식 사용
- 적절한 이미지 크기 조정
- Lazy loading 적용

### 2. 트리 쉐이킹 (Tree Shaking)

- Vite와 Rollup이 자동으로 처리
- 사용하지 않는 코드 제거

### 3. 동적 임포트

```typescript
// ❌ 정적 임포트
import HeavyComponent from '@/components/HeavyComponent.vue'

// ✅ 동적 임포트
const HeavyComponent = () => import('@/components/HeavyComponent.vue')
```

- 큰 컴포넌트는 동적 임포트 사용
- 필요할 때만 로드

### 4. CSS 최적화

- Tailwind CSS의 purge 기능 활용
- 사용하지 않는 CSS 자동 제거

### 5. 번들 분석

```bash
# 번들 분석 도구 설치
npm install --save-dev rollup-plugin-visualizer

# 빌드 후 분석
npm run build
```

- 번들 크기 분석
- 최적화 포인트 식별

## 빌드 성능 모니터링

### 빌드 시간 측정

```bash
# 빌드 시간 측정
time npm run build
```

### 번들 크기 확인

```bash
# 빌드 후 dist 디렉토리 크기 확인
du -sh dist/
```

### 청크 크기 확인

빌드 로그에서 각 청크의 크기를 확인할 수 있습니다:

```
dist/assets/js/vue-vendor-xxxxx.js    150.23 kB
dist/assets/js/ui-vendor-xxxxx.js     45.67 kB
dist/assets/js/chart-vendor-xxxxx.js 89.12 kB
...
```

## 문제 해결

### 청크 크기가 너무 큰 경우

1. **동적 임포트 사용**
   - 큰 컴포넌트를 동적 임포트로 변경

2. **불필요한 라이브러리 제거**
   - 사용하지 않는 의존성 제거

3. **청크 분리 조정**
   - manualChunks 설정 조정

### 빌드 시간이 오래 걸리는 경우

1. **minify 옵션 확인**
   - `esbuild` 사용 (기본값, 가장 빠름)

2. **소스맵 비활성화**
   - 프로덕션에서는 `sourcemap: false`

3. **캐시 활용**
   - Vite의 빌드 캐시 활용

## 참고 자료

- [Vite Build Options](https://vitejs.dev/config/build-options.html)
- [Rollup Output Options](https://rollupjs.org/configuration-options/#output)
- [Code Splitting Best Practices](https://web.dev/code-splitting-splitting-apps/)

