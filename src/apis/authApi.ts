import { tbAxios } from "@/apis/axios.ts"
import { SignupRequest, LoginResponse, UpdateProfileRequest, UserProfileResponse } from "@/interfaces/authInterface.ts"
import store from "@/store";


export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
      const response = await tbAxios.post('/auth/login', { username, password })
      return response.data.data
  },

  logout: async () => {
    try {
      // 서버에 리프레시 토큰 무효화 요청
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await tbAxios.post('/logout', { refreshToken })
      }
    } finally {
      // 로컬 스토리지 토큰 삭제
      await store.dispatch('logout')
    }
  },

  signup: async (data: SignupRequest) => {
    const response = await tbAxios.post('/auth/signup', data)
    return response.data
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await tbAxios.put('/auth/profile', data)
    return response.data
  },

  getUserProfile: async (): Promise<UserProfileResponse> => {
    const response = await tbAxios.get('/auth/me')
    return response.data.data
  }
}