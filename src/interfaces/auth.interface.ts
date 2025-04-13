export interface SignupRequest {
  username: string
  password: string
  name: string
  birthDate: string
} 

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    email: string
    name: string
  }
}