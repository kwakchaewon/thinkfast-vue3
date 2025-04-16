import { createStore } from 'vuex'
import router from '@/router'
import { authApi } from '@/apis/authApi'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
}

interface RootState {
  user: User | null
  accessToken: string | null
}

export default createStore<RootState>({
  state: {
    user: null,
    accessToken: localStorage.getItem('accessToken')
  },

  mutations: {
    SET_USER(state: RootState, user: User) {
      state.user = user
    },
    SET_ACCESS_TOKEN(state: RootState, token: string) {
      state.accessToken = token
      localStorage.setItem('accessToken', token)
    },
    CLEAR_AUTH(state: RootState) {
      state.user = null
      state.accessToken = null
      localStorage.removeItem('accessToken')
    }
  },

  actions: {
    async login({ commit }, { user, accessToken }) {
      commit('SET_USER', user)
      commit('SET_ACCESS_TOKEN', accessToken)
    },

    async logout({ commit }) {
      commit('CLEAR_AUTH')
      router.push('/login')
    },

    async handleTokenExpiration({ commit }) {
      commit('CLEAR_AUTH')
      router.push('/login')
    },

    async loginWithEmail({ commit }, { email, password }) {
      try {
        const response = await authApi.login(email, password)
        commit('SET_USER', {
          id: response.id,
          name: response.name,
          email: response.email
        })
        commit('SET_ACCESS_TOKEN', response.accessToken)
        return response
      } catch (error) {
        throw error
      }
    },

    async logoutWithApi({ commit }) {
      try {
        await authApi.logout()
        commit('CLEAR_AUTH')
      } catch (error) {
        throw error
      }
    },

    setUser({ commit }, user) {
      commit('SET_USER', user)
    }
  },

  getters: {
    isAuthenticated: (state: RootState) => !!state.accessToken,
    currentUser: (state: RootState) => state.user
  }
}) 