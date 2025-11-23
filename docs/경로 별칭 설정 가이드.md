# 경로 별칭 설정 가이드

## 개요

프로젝트에서 사용하는 경로 별칭(path aliases) 설정 및 사용 방법을 문서화합니다.

## 설정 파일별 경로 별칭

### 1. Vite 설정 (vite.config.ts)

```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

- **별칭**: `@`
- **경로**: `./src`
- **용도**: Vite 빌드 시 경로 해석

### 2. TypeScript 설정 (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- **별칭**: `@/*`
- **경로**: `src/*`
- **용도**: TypeScript 타입 체크 및 IDE 자동완성

### 3. shadcn-vue 설정 (components.json)

```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "composables": "@/composables"
  }
}
```

- **별칭**: 여러 개 (components, utils, ui, lib, composables)
- **기본 별칭**: `@` 사용
- **용도**: shadcn-vue CLI가 컴포넌트를 생성할 때 사용하는 경로

## 사용 예시

### 기본 별칭 사용

```typescript
// ✅ 올바른 사용
import { Card } from '@/components/ui/card'
import { useSnackbar } from '@/composables/useSnackbar'
import { authApi } from '@/apis/authApi'
import Main from '@/views/Main.vue'

// ❌ 잘못된 사용 (상대 경로 사용)
import { Card } from '../../components/ui/card'
```

### shadcn-vue 별칭 사용

shadcn-vue CLI가 생성하는 컴포넌트는 다음과 같은 경로를 사용합니다:

- `@/components` - 일반 컴포넌트
- `@/components/ui` - UI 컴포넌트
- `@/lib/utils` - 유틸리티 함수
- `@/lib` - 라이브러리 관련 파일
- `@/composables` - Vue composables

## 디렉토리 구조

```
src/
├── apis/           → @/apis
├── components/     → @/components
│   └── ui/        → @/components/ui
├── composables/   → @/composables
├── interfaces/    → @/interfaces
├── lib/           → @/lib
│   └── utils.ts   → @/lib/utils
├── router/        → @/router
├── store/         → @/store
└── views/         → @/views
```

## 설정 간 일관성 확인

### ✅ 검증 완료

1. **vite.config.ts**와 **tsconfig.json** 간 일관성
   - `@` → `./src` (Vite)
   - `@/*` → `src/*` (TypeScript)
   - ✅ 일관성 있게 설정됨

2. **components.json** 별칭 확인
   - 모든 별칭이 `@/` 접두사를 사용
   - ✅ 일관성 있게 설정됨

3. **실제 사용 확인**
   - 코드베이스에서 `@/` 경로 별칭 사용 중
   - ✅ 올바르게 작동 중

## 주의사항

1. **상대 경로 사용 금지**
   - 가능한 한 경로 별칭(`@/`)을 사용하세요
   - 상대 경로는 파일 이동 시 유지보수가 어렵습니다

2. **별칭 일관성 유지**
   - `@/`로 시작하는 경로는 항상 `src/` 디렉토리를 가리킵니다
   - 다른 별칭을 추가할 때는 모든 설정 파일에 동일하게 추가해야 합니다

3. **shadcn-vue 별칭**
   - `components.json`의 별칭은 shadcn-vue CLI 전용입니다
   - 일반 코드에서는 `@/components`, `@/lib/utils` 등을 직접 사용하세요

## 문제 해결

### 경로 별칭이 작동하지 않는 경우

1. **TypeScript 에러 확인**
   - `tsconfig.json`의 `paths` 설정 확인
   - IDE를 재시작하거나 TypeScript 서버 재시작

2. **Vite 빌드 에러 확인**
   - `vite.config.ts`의 `alias` 설정 확인
   - 개발 서버 재시작

3. **import 경로 확인**
   - `@/`로 시작하는지 확인
   - 파일 확장자 포함 여부 확인 (`.vue`, `.ts` 등)

## 참고 자료

- [Vite Path Aliases](https://vitejs.dev/config/shared-options.html#resolve-alias)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [shadcn-vue Configuration](https://shadcn-vue.com/docs/introduction)

