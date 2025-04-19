import { tbAxios } from '@/apis/axios'
import { useSnackbar } from '@/composables/useSnackbar'

const { showError } = useSnackbar()

export const surveyApi = {
  // 설문 목록 조회
  async getSurveys() {
    try {
      const response = await tbAxios.get('/surveys')
      return response.data
    } catch (error) {
      showError('설문 목록을 불러오는데 실패했습니다.')
      throw error
    }
  },

  // 설문 상세 조회
  async getSurvey(id: string) {
    try {
      const response = await tbAxios.get('/surveys/${id}')
      return response.data
    } catch (error) {
      showError('설문을 불러오는데 실패했습니다.')
      throw error
    }
  },

  // 설문 생성
  async createSurvey(surveyData: any) {
    try {
      const response = await tbAxios.post('/surveys')
      return response.data
    } catch (error) {
      showError('설문 생성에 실패했습니다.')
      throw error
    }
  },

  // 설문 수정
  async updateSurvey(id: string, surveyData: any) {
    try {
      const response = await tbAxios.put('/surveys/${id}')
      return response.data
    } catch (error) {
      showError('설문 수정에 실패했습니다.')
      throw error
    }
  },

  // 설문 삭제
  async deleteSurvey(id: string) {
    try {
      const response = await tbAxios.delete('/surveys/${id}')
      return response.data
    } catch (error) {
      showError('설문 삭제에 실패했습니다.')
      throw error
    }
  },

  // 설문 응답 제출
  async submitResponse(surveyId: string, responseData: any) {
    try {
      const response = await tbAxios.post('/surveys/${surveyId}/responses')
      return response.data
    } catch (error) {
      showError('응답 제출에 실패했습니다.')
      throw error
    }
  },

  // 설문 결과 조회
  async getSurveyResults(surveyId: string) {
    try {
      const response = await tbAxios.get('/surveys/${surveyId}/results')
      return response.data
    } catch (error) {
      showError('설문 결과를 불러오는데 실패했습니다.')
      throw error
    }
  },

  // 설문 인사이트 조회
  async getSurveyInsights(surveyId: string) {
    try {
      const response = await tbAxios.get('/surveys/${surveyId}/insights')
      return response.data
    } catch (error) {
      showError('설문 인사이트를 불러오는데 실패했습니다.')
      throw error
    }
  }
} 