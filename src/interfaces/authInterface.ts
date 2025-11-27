export interface SignupRequest {
  username: string
  password: string
  name: string
  birthDate: string
  realUsername: string
} 

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  username: string
  realUsername?: string | null
  role: string
  tokenType: string
}

export interface UpdateProfileRequest {
  realUsername: string
}

export interface UserProfileResponse {
  username: string
  realUsername?: string | null
  role: string
  birthDate: string
}