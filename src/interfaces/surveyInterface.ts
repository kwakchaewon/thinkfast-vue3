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

export interface Survey {
  id: number
  title: string
  description: string
  startTime: string
  isActive: boolean
  createdAt: string
  answerCount: number
}

export interface GetRecentSurveysResponse {
  surveys: Survey[]
}

export interface Question{
  id: number
  surveyId: number
  type: string
  content: string
  orderIndex: number
}

export interface GetSurveyDetailResponse{
  id: number
  title: string
  description: string
  startTime: string
  endTime: string
  isActive: boolean
  createdAt: string
  answerCount: number
  questions: Question[]
}

