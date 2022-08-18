import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: '/group/:groupId', component: () => import('pages/GroupPage.vue'), props: true }
    ]
  },
  { path: '/login', component: () => import('pages/Login.vue') },
  { path: '/logout', component: () => import('pages/Logout.vue') },
  { path: '/register', component: () => import('pages/Register.vue') },
  { path: '/confirm-email/:emailToken', component: () => import('pages/ConfirmEmail.vue'), props: true },
  { path: '/resend-email-confirmation/:email', component: () => import('pages/ResendEmailConfirmation.vue'), props: true },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
