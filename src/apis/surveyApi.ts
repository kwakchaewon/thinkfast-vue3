import { tbAxios } from '@/apis/axios'
import { useSnackbar } from '@/composables/useSnackbar'
import {
  CreateSurveyRequest,
  GetRecentSurveysResponse,
  Survey,
  Question, GetSurveyDetailResponse,
  CreateAnswerRequest,
  SurveySummary,
  WordCloudResponse,
  QuestionStatisticsResponse,
  QuestionResponsesResponse,
  PublicSurveysResponse
} from '@/interfaces/surveyInterface'

const { showError } = useSnackbar()

export const surveyApi = {
  // 전체 설문 목록 조회 (본인 설문만)
  async getSurveys(): Promise<Survey[]> {
    try {
      const response = await tbAxios.get('/survey')
      return response.data.data
    } catch (error) {
      showError('설문 목록을 불러오는데 실패했습니다.')
      throw error
    }
  },

  // 공개 설문 목록 조회 (인증 불필요)
  async getPublicSurveys(
    page: number = 1,
    size: number = 10,
    sort: 'newest' | 'oldest' | 'responses' = 'newest',
    search?: string
  ): Promise<PublicSurveysResponse> {
    try {
      const params: Record<string, any> = { page, size, sort }
      if (search) {
        params.search = search
      }
      const response = await tbAxios.get<{ success: boolean; data: PublicSurveysResponse }>('/survey/public', { params })
      if (!response.data.success) {
        throw new Error('공개 설문 목록을 불러오는데 실패했습니다.')
      }
      return response.data.data
    } catch (error: any) {
      // 404 같은 경우는 에러를 표시하지 않고 빈 목록 반환
      if (error.response?.status === 404) {
        return {
          surveys: [],
          pagination: {
            currentPage: 1,
            pageSize: size,
            totalPages: 0,
            totalCount: 0
          }
        }
      }
      showError(error.response?.data?.message || '공개 설문 목록을 불러오는데 실패했습니다.')
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
        showError(response.data.message)
        throw new Error(response.data.message)
      }
      return response.data.data
    } catch (error: any) {
      throw error
    }
  },

  // 설문 상세 질문 리스트
  async getQuestionsBySurveyId(id: number): Promise<Question[]> {
    try {
      const response = await tbAxios.get('/survey/' + id + '/questions')
      // null 또는 undefined 체크 추가
      if (!response.data || !response.data.data) {
        console.warn('질문 데이터가 없습니다:', response.data)
        return []
      }
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
      // deviceId 생성 및 주입
      const getDeviceId = (): string => {
        const storageKey = 'thinkfast_device_id'
        let deviceId = localStorage.getItem(storageKey)
        if (!deviceId) {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.textBaseline = 'top'
            ctx.font = '14px Arial'
            ctx.fillText('Device fingerprint', 2, 2)
          }
          const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset().toString(),
            canvas.toDataURL()
          ].join('|')
          deviceId = btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)
          localStorage.setItem(storageKey, deviceId)
        }
        return deviceId
      }

      // payload에 clientInfo.deviceId 주입
      const enhancedPayload: CreateAnswerRequest = {
        ...payload,
        clientInfo: {
          ...payload.clientInfo,
          deviceId: getDeviceId()
        }
      }

      // 유효성 검사: answers의 값이 null인 항목이 있는지 확인
      const hasNull = payload.answers.some(answer => {
        // MULTIPLE_CHOICE: optionId가 null/undefined
        if (answer.type === 'MULTIPLE_CHOICE') {
          return answer.optionId === null || answer.optionId === undefined
        }
        // SUBJECTIVE: content가 null/undefined/빈 문자열
        if (answer.type === 'SUBJECTIVE') {
          return answer.content === null || answer.content === undefined || answer.content === ''
        }
        // SCALE 등 기타 타입: content가 null/undefined/빈 문자열
        return answer.content === null || answer.content === undefined || answer.content === ''
      })
      if (hasNull) {
        throw new Error('미응답 항목이 있습니다.')
      }

      const response = await tbAxios.post(`/survey/${surveyId}/responses`, enhancedPayload)
      return response  
    } catch (error: any) {
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
  },

  // 설문 요약 리포트 조회
  async getSurveySummary(surveyId: number): Promise<SurveySummary> {
    try {
      const response = await tbAxios.get(`/survey/${surveyId}/summary`)
      if (!response.data.success) {
        showError(response.data.message || '설문 요약 리포트를 불러오는데 실패했습니다.')
        throw new Error(response.data.message || '설문 요약 리포트를 불러오는데 실패했습니다.')
      }
      return response.data.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        showError('설문 요약 리포트에 접근할 권한이 없습니다.')
      } else if (error.response?.status === 404) {
        showError('설문을 찾을 수 없습니다.')
      } else {
        showError(error.response?.data?.message || '설문 요약 리포트를 불러오는데 실패했습니다.')
      }
      throw error
    }
  },

  // 워드클라우드 조회
  async getWordCloud(surveyId: number, questionId: number): Promise<WordCloudResponse> {
    try {
      const response = await tbAxios.get(`/survey/${surveyId}/questions/${questionId}/wordcloud`)
      if (!response.data.success) {
        showError(response.data.message || '워드클라우드를 불러오는데 실패했습니다.')
        throw new Error(response.data.message || '워드클라우드를 불러오는데 실패했습니다.')
      }
      return response.data.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        showError('워드클라우드에 접근할 권한이 없습니다.')
      } else if (error.response?.status === 404) {
        showError('질문을 찾을 수 없습니다.')
      } else {
        showError(error.response?.data?.message || '워드클라우드를 불러오는데 실패했습니다.')
      }
      throw error
    }
  },

  // 질문별 인사이트 텍스트 조회
  async getQuestionInsight(surveyId: number, questionId: number): Promise<string> {
    try {
      const response = await tbAxios.get(`/survey/${surveyId}/questions/${questionId}/insight`)
      if (!response.data.success) {
        showError(response.data.message || '인사이트를 불러오는데 실패했습니다.')
        throw new Error(response.data.message || '인사이트를 불러오는데 실패했습니다.')
      }
      return response.data.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        showError('인사이트에 접근할 권한이 없습니다.')
      } else if (error.response?.status === 404) {
        showError('질문을 찾을 수 없습니다.')
      } else {
        showError(error.response?.data?.message || '인사이트를 불러오는데 실패했습니다.')
      }
      throw error
    }
  },

  // 질문별 통계 조회
  async getQuestionStatistics(surveyId: number, questionId: number): Promise<QuestionStatisticsResponse> {
    try {
      const response = await tbAxios.get(`/survey/${surveyId}/questions/${questionId}/statistics`)
      if (!response.data.success) {
        showError(response.data.message || '질문 통계를 불러오는데 실패했습니다.')
        throw new Error(response.data.message || '질문 통계를 불러오는데 실패했습니다.')
      }
      return response.data.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        showError('질문 통계에 접근할 권한이 없습니다.')
      } else if (error.response?.status === 404) {
        showError('질문을 찾을 수 없습니다.')
      } else {
        showError(error.response?.data?.message || '질문 통계를 불러오는데 실패했습니다.')
      }
      throw error
    }
  },

  // 질문별 전체 응답 조회
  async getQuestionResponses(
    surveyId: number,
    questionId: number,
    page: number = 1,
    size: number = 10
  ): Promise<QuestionResponsesResponse> {
    try {
      const response = await tbAxios.get(`/survey/${surveyId}/questions/${questionId}/responses`, {
        params: { page, size }
      })
      if (!response.data.success) {
        showError(response.data.message || '응답을 불러오는데 실패했습니다.')
        throw new Error(response.data.message || '응답을 불러오는데 실패했습니다.')
      }
      return response.data.data
    } catch (error: any) {
      if (error.response?.status === 403) {
        showError('응답 조회에 접근할 권한이 없습니다.')
      } else if (error.response?.status === 404) {
        showError('질문을 찾을 수 없습니다.')
      } else if (error.response?.status === 400) {
        showError(error.response?.data?.message || '잘못된 요청입니다.')
      } else {
        showError(error.response?.data?.message || '응답을 불러오는데 실패했습니다.')
      }
      throw error
    }
  }
} 