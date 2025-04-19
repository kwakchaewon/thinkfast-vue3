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
}

export interface CreateSurveyRequest {
  title: string
  description: string
  endDate: string // 날짜 문자열 (YYYY-MM-DD)
  endTime: string // 시간 문자열 (HH:mm:ss)
  showResults: boolean
  questions: QuestionRequest[]
} 