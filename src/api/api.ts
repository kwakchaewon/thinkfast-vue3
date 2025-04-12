import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface SignupRequest {
  username: string
  password: string
  name: string
  birthDate: string
}

export const authApi = {
  signup: async (data: SignupRequest) => {
    const response = await api.post('/auth/signup', data)
    return response.data
  }
}

export default api 