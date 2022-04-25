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

    // Logs out user when token is expired
    if (token_expired && token) {
      localStorage.removeItem('token')
      localUser.$reset()

      router.push('/logout')

      notify('error', 'Your token is expired', 'Please logout and login again...')

      // todo: this will be converted to a query
      // if (config.data && config.data.query.includes('query logoutUser'))
      //   return config

      // Allows only logoutUser mutation to be executed
      if (config.data && config.data.query.includes('mutation logoutUser'))
        return config

      return
    }

    // Adds Bearer token to Authorization in request header
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
