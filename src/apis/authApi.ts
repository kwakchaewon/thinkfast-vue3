import {tbAxios} from "@/apis/axios.ts";
import { SignupRequest } from "@/interfaces/auth.interface";

export const authApi = {
  signup: async (data: SignupRequest) => {
    const response = await tbAxios.post('/auth/signup', data)
    return response.data
  }
}