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
  responseCount: number
  questions: getQuestionsResponse[]
}

export interface recentSurvey {
  id: number
  title: string
  description: string
  isActive: boolean
  endTime: string
  responseCount: number
  createdAt: string
}

export type GetRecentSurveysResponse = {
  surveys: recentSurvey[]
}

export interface CreateAnswerRequest {
  clientInfo: ClientAnswerRequest;
  answers: CreateAnswerDto[];
}

export interface CreateAnswerDto {
  questionId: number;
  type: string;
  optionId?: number | null;
  content?: string | null;
}

export interface ClientAnswerRequest {
  deviceId: string;
}

// Question 타입 정의 및 export
export interface Question {
  id: number;
  content: string;
  type: string;
  required?: boolean;
  options?: Array<{ id: number, content: string }>;
}

// Survey 타입 정의 및 export
export interface Survey {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  endTime: string;
  responseCount: number;
  questions: Question[];
}

// 설문 요약 리포트 타입 정의
export interface SurveySummary {
  mainPosition: string;
  mainPositionPercent: number;
  improvements: string[];
}

// 워드클라우드 데이터 타입 정의
export interface WordCloudItem {
  word: string;
  count: number;
}

export interface WordCloudResponse {
  questionId: number;
  wordCloud: WordCloudItem[];
  totalResponses: number;
}