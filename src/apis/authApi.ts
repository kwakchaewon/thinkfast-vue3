import { tbAxios } from "@/apis/axios.ts"
import { SignupRequest,LoginResponse } from "@/interfaces/auth.interface"


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
        await tbAxios.post('/auth/logout', { refreshToken })
      }
    } finally {
      // 로컬 스토리지 토큰 삭제
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  },

  signup: async (data: SignupRequest) => {
    const response = await tbAxios.post('/auth/signup', data)
    return response.data
  }
}