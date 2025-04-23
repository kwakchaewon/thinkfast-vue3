export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SUBJECTIVE = 'SUBJECTIVE',
  SCALE = 'SCALE'
}

export interface QuestionRequest {
  content: string
  type: QuestionType
  required: boolean
  options?: string[]
  orderIndex: number
}

export interface CreateSurveyRequest {
  title: string
  description: string
  endDate: string // 날짜 문자열 (YYYY-MM-DD)
  endTime: string // 시간 문자열 (HH:mm:ss)
  showResults: boolean
  questions: QuestionRequest[]
}

export interface getQuestionsResponse {
  id: number
  content: string
  type: string
  required?: boolean
  options?: Array<{ id: number, content: string }>
}

export interface GetSurveyDetailResponse {
  id: number
  title: string
  description: string
  isActive: boolean
  endTime: string
  answerCount: number
  questions: getQuestionsResponse[]
}

export interface GetRecentSurveysResponse {
  surveys: GetSurveyDetailResponse[]
}

