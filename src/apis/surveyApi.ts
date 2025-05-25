import { tbAxios } from '@/apis/axios'
import { useSnackbar } from '@/composables/useSnackbar'
import { useRouter } from 'vue-router'
import {
  CreateSurveyRequest,
  GetRecentSurveysResponse,
  Survey,
  Question, GetSurveyDetailResponse,
  CreateAnswerRequest
} from '@/interfaces/surveyInterface'

const { showError } = useSnackbar()

export const surveyApi = {
  // 전체 설문 목록 조회
  async getSurveys(): Promise<Survey[]> {
    try {
      const response = await tbAxios.get('/survey')
      return response.data.data
    } catch (error) {
      showError('설문 목록을 불러오는데 실패했습니다.')
      throw error
    }
  },

  async getRecentSurveys(): Promise<GetRecentSurveysResponse> {
    try {
      const response = await tbAxios.get<GetRecentSurveysResponse>('/survey/recent')
      return response.data
    } catch (error) {
      showError('최근 설문 목록을 불러오는데 실패했습니다.')
      throw error
    }
  },

  // 설문 상세
  async getSurveyDetail(id: number): Promise<GetSurveyDetailResponse> {
    try {
      const response = await tbAxios.get('/survey/' + id)
      if (!response.data.success){
        throw new Error(response.data.message)
      }
      return response.data.data
    } catch (error) {
      showError((error as Error).message)
      throw error
    }
  },

  // 설문 상세 질문 리스트
  async getQuestionsBySurveyId(id: number): Promise<Question[]> {
    try {
      const response = await tbAxios.get('/survey/' + id + '/questions')
      return response.data.data
    } catch (error) {
      showError('설문을 불러오는데 실패했습니다.')
      throw error
    }
  },

  // 설문 생성
  async createSurvey(payload: CreateSurveyRequest): Promise<Survey> {
    try {
      const response = await tbAxios.post('/survey', payload)
      return response.data
    } catch (error) {
      showError('설문 생성에 실패했습니다.')
      throw error
    }
  },
  
  // 설문 응답 제출
  async createAnswer(surveyId: number, payload: CreateAnswerRequest): Promise<any> {
    try {
      const response = await tbAxios.post(`/survey/${surveyId}/responses`, payload)
      return response  
    } catch (error) {
      showError('설문 응답 제출에 실패했습니다.')
      throw error
    }
  },

  // 설문 수정
  async updateSurvey(id: string, surveyData: Partial<Survey>): Promise<Survey> {
    try {
      const response = await tbAxios.put(`/surveys/${id}`, surveyData)
      return response.data
    } catch (error) {
      showError('설문 수정에 실패했습니다.')
      throw error
    }
  },

  // 설문 삭제
  async deleteSurvey(surveyId: number): Promise<void> {
    try {
      await tbAxios.delete('/survey/' + surveyId)
      return
    } catch (error) {
      showError('설문 삭제에 실패했습니다.')
      throw error
    }
  },

  // 설문 응답 제출
  async submitResponse(surveyId: string, responseData: any): Promise<any> {
    try {
      const response = await tbAxios.post(`/survey/${surveyId}/responses`, responseData)
      return response.data
    } catch (error) {
      showError('응답 제출에 실패했습니다.')
      throw error
    }
  },

  // 설문 결과 조회
  async getSurveyResults(surveyId: string): Promise<any> {
    try {
      const response = await tbAxios.get(`/survey/${surveyId}/results`)
      return response.data
    } catch (error) {
      showError('설문 결과를 불러오는데 실패했습니다.')
      throw error
    }
  },

  // 설문 인사이트 조회
  async getSurveyInsights(surveyId: string): Promise<any> {
    try {
      const response = await tbAxios.get(`/survey/${surveyId}/insights`)
      return response.data
    } catch (error) {
      showError('설문 인사이트를 불러오는데 실패했습니다.')
      throw error
    }
  }
} 