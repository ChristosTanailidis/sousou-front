import axios from 'axios'

// interfaces
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

// stores
import { useLocalUser } from '~/stores/local-user'

// utils
import notify from '~/utils/notify'
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

api.interceptors.request.use(async(config: AxiosRequestConfig) => {
  const localUser = useLocalUser()
  const token = localUser.token ? localUser.token : localStorage.getItem('token')

  const token_expired = localUser.decodedToken ? Date.now() >= localUser.decodedToken.exp * 1000 : true
  // todo: fix this
  if (token_expired && token) {
    router.push('/logout')

    if (config.data && config.data.query.includes('mutation logoutUser'))
      return config

    notify('error', 'Your token is expired', 'Please logout and login again...')
    return
  }

  if (config && config.headers && token)
    config.headers = { Authorization: `Bearer ${token}` }

  return config
})

export { api }
