import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/Main.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Signup.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: MainView,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

export default router 