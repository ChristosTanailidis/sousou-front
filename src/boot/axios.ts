import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useLocalUser } from '~/stores/local-user'
// import { authService } from './auth'

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

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const localUser = useLocalUser()
  const token = localUser.token ? localUser.token : localStorage.getItem('token')

  // todo: expired token
  // if (localUser.decodedToken.expired) {
  //   localUser.logoutUser() // or fetch new token??

  //   return
  // }
  
  if(config && config.headers && token){
    config.headers = { Authorization: `Bearer ${token}`}
  }

  return config
})

export { api }
