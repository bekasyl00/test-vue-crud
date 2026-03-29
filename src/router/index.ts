import { createRouter, createWebHistory } from 'vue-router'

import UsersPage from '../pages/UsersPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/users',
    },
    {
      path: '/users',
      name: 'users',
      component: UsersPage,
    },
  ],
})

export default router
