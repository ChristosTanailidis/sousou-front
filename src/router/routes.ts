import { isLogged, isNotLogged } from 'src/middlewares/auth'
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: [isLogged],
    children: [
      { path: '', beforeEnter: [isLogged], component: () => import('pages/IndexPage.vue') },
      { path: 'group/:groupId', beforeEnter: [isLogged], component: () => import('pages/GroupPage.vue'), props: true }
    ]
  },
  {
    path: '/auth/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', beforeEnter: [isNotLogged], redirect: '/auth/login' },
      { path: 'login', beforeEnter: [isNotLogged], component: () => import('src/pages/auth-pages/Login.vue') },
      { path: 'logout', component: () => import('src/pages/auth-pages/Logout.vue') },
      { path: 'register', beforeEnter: [isNotLogged], component: () => import('src/pages/auth-pages/Register.vue') },
      { path: 'confirm-email/:emailToken', beforeEnter: [isNotLogged], component: () => import('src/pages/auth-pages/ConfirmEmail.vue'), props: true },
      { path: 'resend-email-confirmation/:email', beforeEnter: [isNotLogged], component: () => import('src/pages/auth-pages/ResendEmailConfirmation.vue'), props: true }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/auth-pages/ErrorNotFound.vue')
  }
]

export default routes
