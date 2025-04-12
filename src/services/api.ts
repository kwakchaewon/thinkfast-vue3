import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export const testApi = async () => {
  try {
    const response = await api.get('/test')
    return response.data
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error)
    throw error
  }
} 