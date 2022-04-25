import axios from 'axios'

// interfaces
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// stores
import { useLocalUser } from '~/stores/local-user'

// utils
import notify, { notifyRequestErrors } from '~/utils/notify'
import { router } from '~/router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: `${import.meta.env.VITE_SERVER_URL}/graphql` })

// Errors interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.errors || !response)
      notifyRequestErrors(response.data.errors)

    return response
  },
  // Error interceptor
  (error: { message: string }) => {
    notify('error', error.message)
    console.log('Response Error (<--)\n', error)
    return Promise.reject(error)
  })

// Authorization interceptor
api.interceptors.request.use(
  async(config: AxiosRequestConfig) => {
    const localUser = useLocalUser()
    const token = localUser.token ? localUser.token : localStorage.getItem('token')

    // Checks if token is expired
    const token_expired = localUser.decodedToken ? Date.now() >= localUser.decodedToken.exp * 1000 : true

    if (token_expired && token) {
      localStorage.removeItem('token')
      router.push('/logout')

      if (config.data && config.data.query.includes('mutation logoutUser'))
        return config

      notify('error', 'Your token is expired', 'Please logout and login again...')
      return
    }

    if (config && config.headers && token)
      config.headers = { Authorization: `Bearer ${token}` }

    return config
  },
  // Error interceptor
  (error: { message: string }) => {
    notify('error', error.message)
    console.log('Request Error (-->)\n', error)
    return Promise.reject(error)
  })

export { api }
