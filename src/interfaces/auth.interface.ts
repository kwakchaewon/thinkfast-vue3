export interface SignupRequest {
  username: string
  password: string
  name: string
  birthDate: string
} 

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  username: string
  role: string
  tokenType: string
}