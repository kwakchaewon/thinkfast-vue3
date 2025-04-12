import {tbAxios} from "@/apis/axios.ts";

export interface SignupRequest {
  username: string
  password: string
  name: string
  birthDate: string
}

export const authApi = {
  signup: async (data: SignupRequest) => {
    const response = await tbAxios.post('/auth/signup', data)
    return response.data
  }
}