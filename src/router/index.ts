import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { useSnackbar } from '@/composables/useSnackbar'

const { showError } = useSnackbar()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      beforeEnter: (_to, _from, next) => {
        if (store.getters.isAuthenticated) {
          next('/main')
        } else {
          next()
        }
      }
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/views/Main.vue'),
      beforeEnter: (_to, _from, next) => {
        if (!store.getters.isAuthenticated) {
          showError('로그인 세션이 만료됐습니다.')
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      beforeEnter: (_to, _from, next) => {
        if (store.getters.isAuthenticated) {
          showError('로그인 세션이 만료됐습니다.')
          next('/main')
        } else {
          next()
        }
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/Signup.vue'),
      beforeEnter: (_to, _from, next) => {
        if (store.getters.isAuthenticated) {
          showError('로그인 세션이 만료됐습니다.')
          next('/main')
        } else {
          next()
        }
      }
    }
  ]
})

export default router 