import type { AxiosInstance } from 'axios'
import axios from 'axios'
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

api.interceptors.request.use(async(config) => {
  // const accessToken = await authService.getAccessToken()
  // if (config && config.headers)
  //   config.headers.common.Authorization = 'Bearer test'
  return config
})

// api.interceptors.request.use(async(config) => {
//   const accessToken = await authService.getAccessToken()
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   config.headers.common.Authorization = `Bearer ${accessToken}`
//   return config
// })

export { api }
