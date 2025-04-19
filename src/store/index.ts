// @ts-ignore
import { createStore } from 'vuex'
import router from '@/router'

interface userState {
  username: string | null
  accessToken: string | null
  role: string | null
}

// localStorage에서 사용자 정보를 불러오는 함수
const loadState = (): userState => {
  return {
    username: localStorage.getItem('username'),
    accessToken: localStorage.getItem('accessToken'),
    role: localStorage.getItem('role')
  }
}

export default createStore<userState>({
  state: loadState(),

  // mutations: state 직접 변경, 변수 증가와 같은 간단 로직
  mutations: {
    SET_USER_DATA(state: userState, payload: { accessToken: string; username: string; role: string}) {
      const { accessToken, username, role } = payload
      state.accessToken = accessToken
      state.username = username
      state.role = role

      // LocalStorage 에도 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
    },

    CLEAR_USER_DATA(state: userState) {
      state.accessToken = null;
      state.username = null;
      state.role = null;

      // LocalStorage 에도 저장
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
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
        payload: { username: string; accessToken: string; role: string }
    ) {
      console.log('setUser', payload);
      commit('SET_USER_DATA', payload)
    }
  },

  getters: {
    isAuthenticated: (state: userState) => !!state.accessToken,
    currentUser: (state: userState) => state.username
  }
}) 