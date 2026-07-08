import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/prompts',
      name: 'prompts',
      component: () => import('../views/OnboardingView.vue'),
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('../views/PromptsView.vue'),
    },
    {
      path: '/course/:courseId',
      name: 'course',
      component: () => import('../views/CourseView.vue'),
    },
    {
      path: '/course/:courseId/slide/:id',
      name: 'slide',
      component: () => import('../views/SlideView.vue'),
    },
  ],
})
