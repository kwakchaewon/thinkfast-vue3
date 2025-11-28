import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { useSnackbar } from '@/composables/useSnackbar'
import Main from '@/views/Main.vue'
import CreateSurvey from '@/views/CreateSurvey.vue'
import SurveyDetail from '@/views/SurveyDetail.vue'
import AllSurveys from '@/views/AllSurveys.vue'

const { showError } = useSnackbar()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: 'ThinkFast :: AI 인사이트 제공 설문 플랫폼',
        requiresAuth: false
      }
      // 인증 없이 접근 가능 (커뮤니티 페이지)
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      meta: {
        title: '대시보드 :: ThinkFast'
      },
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
      meta: {
        title: '로그인 :: ThinkFast'
      },
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
      meta: {
        title: '회원가입 :: ThinkFast'
      },
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
      meta: {
        title: '새 설문 만들기 :: ThinkFast'
      },
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
      props: true,
      meta: {
        title: '설문 상세 :: ThinkFast',
        dynamicTitle: true,
        requiresAuth: false // 공개 설문은 인증 불필요 (컴포넌트 내에서 권한 체크)
      }
    },
    {
      path: '/survey/:id/create-response',
      name: 'survey-response',
      component: () => import('@/views/SurveyResponse.vue'),
      meta: {
        requiresAuth: false,
        title: '설문 응답 :: ThinkFast',
        dynamicTitle: true
      }
    },
    {
      path: '/survey-completion',
      name: 'SurveyCompletion',
      component: () => import('@/views/SurveyCompletion.vue'),
      meta: {
        title: '설문 완료 :: ThinkFast'
      }
    },
    {
      path: '/all-surveys',
      name: 'all-surveys',
      component: AllSurveys,
      meta: {
        title: '전체 설문 :: ThinkFast'
      },
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
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/Posts.vue'),
      meta: {
        requiresAuth: false,
        title: '게시글 :: ThinkFast'
      }
    }
  ]
})

router.afterEach((to) => {
  if (to.meta.title && !to.meta.dynamicTitle) {
    document.title = to.meta.title as string
  }
})

export default router 