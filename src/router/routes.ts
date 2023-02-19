import { isLogged, isNotLogged } from 'src/middlewares/auth'
import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: [isLogged],
    children: [
      { path: '', beforeEnter: [isLogged], component: () => import('pages/IndexPage.vue') },
      {
        path: 'group/:groupId',
        beforeEnter: [isLogged],
        component: () => import('pages/GroupPage.vue'),
        props: true,
        children: [
          { path: 'text/:textChannelId', component: () => import('components/group-page/containers/TextChannelContainer.vue'), props: true },
          { path: 'voice/:voiceChannelId', component: () => import('components/group-page/containers/VoiceChannelContainer.vue'), props: true }
        ]
      },
      {
        path: 'friend/:personalChatId',
        beforeEnter: [isLogged],
        component: () => import('pages/FriendPage.vue'),
        props: true,
        children: [
          { path: 'voice', component: () => import('components/friend-page/containers/VoiceContainer.vue'), props: true }
        ]
      }
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

      { path: 'forgot-password', beforeEnter: [isNotLogged], component: () => import('src/pages/auth-pages/ForgotPassword.vue') },
      { path: 'reset-password/:resetToken', beforeEnter: [isNotLogged], component: () => import('src/pages/auth-pages/ResetPassword.vue'), props: true },

      { path: 'resend-email-confirmation', beforeEnter: [isNotLogged], component: () => import('src/pages/auth-pages/ResendEmailConfirmation.vue') },
      { path: 'confirm-email/:emailToken', beforeEnter: [isNotLogged], component: () => import('src/pages/auth-pages/ConfirmEmail.vue'), props: true }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue')
  }
]

export default routes
