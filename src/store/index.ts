// @ts-ignore
import { createStore } from 'vuex'
import router from '@/router'

interface userState {
  username: string | null
  realUsername: string | null
  accessToken: string | null
  role: string | null
}

// localStorage에서 사용자 정보를 불러오는 함수
const loadState = (): userState => {
  return {
    username: localStorage.getItem('username'),
    realUsername: localStorage.getItem('realUsername'),
    accessToken: localStorage.getItem('accessToken'),
    role: localStorage.getItem('role')
  }
}

export default createStore<userState>({
  state: loadState(),

  // mutations: state 직접 변경, 변수 증가와 같은 간단 로직
  mutations: {
    SET_USER_DATA(state: userState, payload: { username: string; realUsername?: string | null; accessToken: string; refreshToken:string; role: string}) {
      const { username, realUsername, accessToken, refreshToken, role } = payload
      state.accessToken = accessToken
      state.username = username
      state.realUsername = realUsername || null
      state.role = role

      // LocalStorage 에도 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      if (realUsername) {
        localStorage.setItem('realUsername', realUsername);
      }
      localStorage.setItem('role', role);
    },

    CLEAR_USER_DATA(state: userState) {
      state.accessToken = null;
      state.username = null;
      state.realUsername = null;
      state.role = null;

      // LocalStorage 에도 저장
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      localStorage.removeItem('realUsername');
      localStorage.removeItem('role');
    },
  },

  actions: {
    async logout({ commit }: {commit:Function}) {
      commit('CLEAR_USER_DATA')
      router.push('/')
    },

    async handleTokenExpiration({ commit }: { commit: Function }) {
      commit('CLEAR_USER_DATA')
      router.push('/login')
    },

    setUser(
        { commit }: { commit: Function },
        payload: { username: string; realUsername?: string | null; accessToken: string; refreshToken:string; role: string }
    ) {
      commit('SET_USER_DATA', payload)
    }
  },

  getters: {
    isAuthenticated: (state: userState) => !!state.accessToken,
    currentUser: (state: userState) => state.username
  }
}) 