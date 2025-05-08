import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { useSnackbar } from '@/composables/useSnackbar'
import Main from '@/views/Main.vue'
import CreateSurvey from '@/views/CreateSurvey.vue'
import SurveyDetail from '@/views/SurveyDetail.vue'

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
      component: Main,
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
    },
    {
      path: '/create-survey',
      name: 'create-survey',
      component: CreateSurvey,
      beforeEnter: (_to, _from, next) => {
        if (!store.getters.isAuthenticated) {
          showError('로그인이 필요합니다.')
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/survey/:id',
      name: 'survey-detail',
      component: SurveyDetail,
      props: true
    },
    {
      path: '/survey/:id/create-response',
      name: 'survey-response',
      component: () => import('@/views/SurveyResponse.vue'),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/survey-completion',
      name: 'SurveyCompletion',
      component: () => import('@/views/SurveyCompletion.vue')
    }
  ]
})

export default router 