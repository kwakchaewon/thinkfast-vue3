# real_username 통합 작업 가이드

## 📋 작업 개요

백엔드에서 `real_username` 필드가 추가되었습니다. 이제 `username`(이메일)과 별개로 `real_username`(실제 유저 이름 또는 닉네임)을 표기해야 합니다.

---

## 🎯 작업 목표

1. `real_username` 필드를 전체 시스템에 통합
2. UI에서 사용자 이름 표시 시 `real_username` 우선 사용 (없으면 `username` 사용)
3. 회원가입 시 `real_username` 입력 필드 추가 (필수 필드, 이름 필드로 표시)

---

## 📝 작업 목록

### - [x] 1. TypeScript 인터페이스 업데이트

**파일**: `src/interfaces/authInterface.ts`

#### 1.1 SignupRequest 인터페이스 업데이트
- `realUsername: string` 필드 추가 (필수 필드)

#### 1.2 LoginResponse 인터페이스 업데이트
- `realUsername?: string | null` 필드 추가

#### 1.3 신규 인터페이스 추가
- `UpdateProfileRequest` 인터페이스 추가
- `UserProfileResponse` 인터페이스 추가

---

### - [x] 2. 유틸리티 함수 추가

**파일**: `src/composables/useUserDisplay.ts` (신규 생성)

#### 2.1 getDisplayName 함수 구현
```typescript
export const getDisplayName = (
  realUsername: string | null | undefined,
  username: string
): string => {
  return realUsername?.trim() || username;
};
```

---

### - [x] 3. API 업데이트

**파일**: `src/apis/authApi.ts`

#### 3.1 signup 메서드 업데이트
- `SignupRequest` 타입에 `realUsername` 필드 포함

#### 3.2 login 메서드 업데이트
- 응답에서 `realUsername` 필드 처리

#### 3.3 신규 API 메서드 추가
- `updateProfile`: 프로필 수정 API (`PUT /auth/profile`)
- `getUserProfile`: 사용자 정보 조회 API (`GET /auth/me`)

---

### - [x] 4. Store 업데이트

**파일**: `src/store/index.ts`

#### 4.1 userState 인터페이스 업데이트
- `realUsername: string | null` 필드 추가

#### 4.2 loadState 함수 업데이트
- localStorage에서 `realUsername` 로드

#### 4.3 SET_USER_DATA mutation 업데이트
- `realUsername` 필드 저장 (state 및 localStorage)

#### 4.4 CLEAR_USER_DATA mutation 업데이트
- `realUsername` 제거 (state 및 localStorage)

#### 4.5 setUser action 업데이트
- payload에 `realUsername` 필드 추가

---

### - [x] 5. 회원가입 폼 업데이트

**파일**: `src/views/Signup.vue`

#### 5.1 Form 스키마 업데이트
- `realUsername` 필드 추가 (필수, 문자열 검증)

#### 5.2 UI에 realUsername 입력 필드 추가
- 이메일 입력 필드 다음에 배치
- "이름" 필드로 표시 (필수 필드)

#### 5.3 handleSignup 함수 업데이트
- `authApi.signup` 호출 시 `realUsername` 포함

---

### - [x] 6. 로그인 처리 업데이트

**파일**: `src/views/Home.vue`, `src/views/Login.vue`

#### 6.1 handleLogin 함수 업데이트
- `authApi.login` 응답에서 `realUsername` 추출
- `store.dispatch('setUser')` 호출 시 `realUsername` 포함

---

### - [x] 7. 토큰 갱신 처리 업데이트

**파일**: `src/apis/axios.ts`

#### 7.1 토큰 갱신 응답 처리 업데이트
- `/auth/refresh` 응답에서 `realUsername` 추출
- localStorage에 `realUsername` 저장
- Store에 `realUsername` 업데이트

---

### - [x] 8. UI에서 사용자 이름 표시 업데이트

**파일**: `src/components/common/Sidebar.vue`

#### 8.1 userName computed 업데이트
- `getDisplayName` 함수 사용
- `realUsername` 우선, 없으면 `username` 사용
- localStorage에서 `realUsername` 가져오기

#### 8.2 userEmail computed 유지
- `username` (이메일)은 그대로 표시

---

### - [x] 9. 알림 메시지 처리 업데이트

**파일**: `src/components/common/Sidebar.vue`

#### 9.1 RawNotification 인터페이스 업데이트
- `displayName?: string` 필드 추가

#### 9.2 알림 처리 로직 업데이트
- WebSocket 및 API 응답에서 `displayName` 필드 사용
- 알림 메시지에 `displayName` 표시 (있는 경우)

---

### - [ ] 10. 프로필 수정 기능 추가 (선택사항)

**파일**: `src/components/common/Sidebar.vue` 또는 별도 컴포넌트

#### 10.1 프로필 수정 UI 추가
- 프로필 섹션에 "프로필 수정" 버튼 추가
- Dialog 또는 별도 페이지로 프로필 수정 폼 구현

#### 10.2 프로필 수정 로직 구현
- `authApi.updateProfile` 호출
- 성공 시 Store 및 localStorage 업데이트

---

## 🔍 상세 작업 내용

### 작업 1: TypeScript 인터페이스 업데이트

**변경 파일**: `src/interfaces/authInterface.ts`

```typescript
// 기존
export interface SignupRequest {
  username: string
  password: string
  name: string
  birthDate: string
}

// 변경 후
export interface SignupRequest {
  username: string
  password: string
  name: string
  birthDate: string
  realUsername: string  // ⭐ 추가 (필수 필드)
}

// 기존
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  username: string
  role: string
  tokenType: string
}

// 변경 후
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  username: string
  realUsername?: string | null  // ⭐ 추가
  role: string
  tokenType: string
}

// ⭐ 신규 추가
export interface UpdateProfileRequest {
  realUsername: string
}

// ⭐ 신규 추가
export interface UserProfileResponse {
  username: string
  realUsername?: string | null
  role: string
  birthDate: string
}
```

---

### 작업 2: 유틸리티 함수 추가

**신규 파일**: `src/composables/useUserDisplay.ts`

```typescript
/**
 * 사용자 표시 이름을 반환합니다.
 * realUsername이 있으면 realUsername을, 없으면 username을 반환합니다.
 */
export const getDisplayName = (
  realUsername: string | null | undefined,
  username: string
): string => {
  return realUsername?.trim() || username;
};
```

---

### 작업 3: API 업데이트

**변경 파일**: `src/apis/authApi.ts`

```typescript
// signup 메서드는 자동으로 SignupRequest 타입에 realUsername 포함됨

// login 메서드는 자동으로 LoginResponse 타입에 realUsername 포함됨

// ⭐ 신규 추가
updateProfile: async (data: UpdateProfileRequest) => {
  const response = await tbAxios.put('/auth/profile', data)
  return response.data
},

// ⭐ 신규 추가
getUserProfile: async (): Promise<UserProfileResponse> => {
  const response = await tbAxios.get('/auth/me')
  return response.data.data
}
```

---

### 작업 4: Store 업데이트

**변경 파일**: `src/store/index.ts`

```typescript
interface userState {
  username: string | null
  realUsername: string | null  // ⭐ 추가
  accessToken: string | null
  role: string | null
}

const loadState = (): userState => {
  return {
    username: localStorage.getItem('username'),
    realUsername: localStorage.getItem('realUsername'),  // ⭐ 추가
    accessToken: localStorage.getItem('accessToken'),
    role: localStorage.getItem('role')
  }
}

// SET_USER_DATA mutation
SET_USER_DATA(state: userState, payload: { 
  username: string
  realUsername?: string | null  // ⭐ 추가
  accessToken: string
  refreshToken: string
  role: string
}) {
  const { username, realUsername, accessToken, refreshToken, role } = payload
  state.accessToken = accessToken
  state.username = username
  state.realUsername = realUsername || null  // ⭐ 추가
  state.role = role

  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('username', username)
  if (realUsername) {  // ⭐ 추가
    localStorage.setItem('realUsername', realUsername)
  }
  localStorage.setItem('role', role)
}

// CLEAR_USER_DATA mutation
CLEAR_USER_DATA(state: userState) {
  state.accessToken = null
  state.username = null
  state.realUsername = null  // ⭐ 추가
  state.role = null

  localStorage.removeItem('accessToken')
  localStorage.removeItem('username')
  localStorage.removeItem('realUsername')  // ⭐ 추가
  localStorage.removeItem('role')
}

// setUser action
setUser(
  { commit }: { commit: Function },
  payload: { 
    username: string
    realUsername?: string | null  // ⭐ 추가
    accessToken: string
    refreshToken: string
    role: string
  }
) {
  commit('SET_USER_DATA', payload)
}
```

---

### 작업 5: 회원가입 폼 업데이트

**변경 파일**: `src/views/Signup.vue`

1. **Form 스키마에 realUsername 추가** (필수)
2. **템플릿에 realUsername 입력 필드 추가** (이름 필드로 표시)
3. **handleSignup에서 realUsername 전송**

---

### 작업 6: 로그인 처리 업데이트

**변경 파일**: `src/views/Home.vue`, `src/views/Login.vue`

```typescript
const handleLogin = handleSubmit(async (values: { email: string; password: string }) => {
  loading.value = true
  try {
    const response = await authApi.login(values.email, values.password)

    await store.dispatch('setUser', {
      username: response.username,
      realUsername: response.realUsername,  // ⭐ 추가
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      role: response.role
    })

    await router.push('/main')
    showSuccess('로그인에 성공했습니다.')
  } catch (error: any) {
    showError(error.response?.data?.message || '로그인에 실패했습니다.')
  } finally {
    loading.value = false
  }
})
```

---

### 작업 7: 토큰 갱신 처리 업데이트

**변경 파일**: `src/apis/axios.ts`

```typescript
const response = await tbAxios.post("/auth/refresh", 
  { refreshToken },
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);

const accessToken = response.data.data.accessToken;
const newRefreshToken = response.data.data.refreshToken;
const realUsername = response.data.data.realUsername;  // ⭐ 추가

localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", newRefreshToken);
if (realUsername) {  // ⭐ 추가
  localStorage.setItem("realUsername", realUsername);
}

// Store 업데이트도 필요하면 추가
store.dispatch('setUser', {
  username: localStorage.getItem('username') || '',
  realUsername: realUsername,  // ⭐ 추가
  accessToken: accessToken,
  refreshToken: newRefreshToken,
  role: localStorage.getItem('role') || ''
});
```

---

### 작업 8: UI에서 사용자 이름 표시 업데이트

**변경 파일**: `src/components/common/Sidebar.vue`

```typescript
import { getDisplayName } from '@/composables/useUserDisplay'

// 기존
const userName = computed(() => {
  const email = userEmail.value
  if (!email) return 'User'
  const emailPrefix = email.split('@')[0]
  return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)
})

// 변경 후
const userName = computed(() => {
  const username = userEmail.value
  const realUsername = localStorage.getItem('realUsername')
  return getDisplayName(realUsername, username || 'User')
})
```

---

### 작업 9: 알림 메시지 처리 업데이트

**변경 파일**: `src/components/common/Sidebar.vue`

```typescript
interface RawNotification {
  type: string
  surveyId: number
  surveyTitle: string
  isRead: boolean
  createdAt: string
  alarmCount: number
  displayName?: string  // ⭐ 추가
}

// 알림 메시지에 displayName 사용 (있는 경우)
// WebSocket 및 API 응답 처리 시 displayName 필드 확인
```

---

## ✅ 체크리스트

### 필수 작업
- [x] TypeScript 인터페이스 업데이트 (`authInterface.ts`)
- [x] 유틸리티 함수 추가 (`useUserDisplay.ts`)
- [x] API 업데이트 (`authApi.ts`)
- [x] Store 업데이트 (`store/index.ts`)
- [x] 회원가입 폼 업데이트 (`Signup.vue`)
- [x] 로그인 처리 업데이트 (`Home.vue`, `Login.vue`)
- [x] 토큰 갱신 처리 업데이트 (`axios.ts`)
- [x] UI 사용자 이름 표시 업데이트 (`Sidebar.vue`)
- [x] 알림 메시지 처리 업데이트 (`Sidebar.vue`)

### 선택 작업
- [ ] 프로필 수정 기능 추가
- [ ] 사용자 정보 조회 기능 추가

---

## 🧪 테스트 항목

1. **회원가입 테스트**
   - `realUsername` 필수 필드로 회원가입 (이름 필드)

2. **로그인 테스트**
   - `realUsername`이 있는 사용자 로그인
   - `realUsername`이 없는 사용자 로그인
   - UI에 올바른 이름 표시 확인

3. **토큰 갱신 테스트**
   - 토큰 갱신 시 `realUsername` 유지 확인

4. **프로필 표시 테스트**
   - Sidebar에서 올바른 이름 표시 확인
   - `realUsername` 우선, 없으면 `username` 표시 확인

5. **알림 메시지 테스트**
   - `displayName` 필드가 있는 알림 처리 확인

---

## 📌 참고사항

1. **하위 호환성**: 기존 사용자 중 `realUsername`이 없는 경우도 정상 동작해야 함
2. **null 처리**: `realUsername`은 `null` 또는 `undefined`일 수 있으므로 안전하게 처리
3. **trim 처리**: `realUsername`은 공백만 있는 경우 빈 문자열로 처리
4. **localStorage**: `realUsername`은 선택적이므로 없을 수 있음

---

## 🔗 관련 파일 목록

### 수정 필요 파일
- `src/interfaces/authInterface.ts`
- `src/apis/authApi.ts`
- `src/store/index.ts`
- `src/views/Signup.vue`
- `src/views/Home.vue`
- `src/views/Login.vue`
- `src/apis/axios.ts`
- `src/components/common/Sidebar.vue`

### 신규 생성 파일
- `src/composables/useUserDisplay.ts`

---

## 📅 작업 순서 권장사항

1. **1단계**: TypeScript 인터페이스 및 유틸리티 함수 추가 ✅
2. **2단계**: Store 업데이트 ✅
3. **3단계**: API 업데이트 ✅
4. **4단계**: 회원가입/로그인 처리 업데이트 ✅
5. **5단계**: 토큰 갱신 처리 업데이트 ✅
6. **6단계**: UI 표시 업데이트 ✅
7. **7단계**: 알림 메시지 처리 업데이트 ✅
8. **8단계**: 테스트 및 검증

---

## 📝 다음 작업 정보

### 완료된 작업
- ✅ TypeScript 인터페이스 업데이트 (`authInterface.ts`)
- ✅ 유틸리티 함수 추가 (`useUserDisplay.ts`)
- ✅ API 업데이트 (`authApi.ts` - updateProfile, getUserProfile 추가)
- ✅ Store 업데이트 (`store/index.ts` - realUsername 필드 추가)
- ✅ 회원가입 폼 업데이트 (`Signup.vue` - realUsername 입력 필드 추가)
- ✅ 로그인 처리 업데이트 (`Home.vue`, `Login.vue`)
- ✅ 토큰 갱신 처리 업데이트 (`axios.ts`)
- ✅ UI 사용자 이름 표시 업데이트 (`Sidebar.vue`)
- ✅ 알림 메시지 인터페이스 업데이트 (`Sidebar.vue`)

### 다음 작업 (선택사항)
- [ ] 프로필 수정 기능 구현
  - 프로필 수정 UI 추가 (Dialog 또는 별도 페이지)
  - `authApi.updateProfile` 호출 로직 구현
  - 성공 시 Store 및 localStorage 업데이트
  
- [ ] 사용자 정보 조회 기능 구현
  - 앱 초기화 시 `authApi.getUserProfile` 호출
  - 사용자 정보 동기화

### 테스트 필요 항목
1. 회원가입 테스트
   - realUsername 필수 필드로 회원가입 (이름 필드)
   
2. 로그인 테스트
   - realUsername이 있는 사용자 로그인
   - realUsername이 없는 사용자 로그인
   - UI에 올바른 이름 표시 확인
   
3. 토큰 갱신 테스트
   - 토큰 갱신 시 realUsername 유지 확인
   
4. 프로필 표시 테스트
   - Sidebar에서 올바른 이름 표시 확인
   - realUsername 우선, 없으면 username 표시 확인

### 변경된 파일 목록
- `src/interfaces/authInterface.ts` - 인터페이스 업데이트
- `src/composables/useUserDisplay.ts` - 신규 생성
- `src/apis/authApi.ts` - API 메서드 추가
- `src/store/index.ts` - Store 업데이트
- `src/views/Signup.vue` - 회원가입 폼 업데이트
- `src/views/Home.vue` - 로그인 처리 업데이트
- `src/views/Login.vue` - 로그인 처리 업데이트
- `src/apis/axios.ts` - 토큰 갱신 처리 업데이트
- `src/components/common/Sidebar.vue` - UI 표시 업데이트

