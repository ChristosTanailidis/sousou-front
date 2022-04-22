import type { AxiosResponse } from 'axios'

export type GraphQLResponse<T> = AxiosResponse<{
  data?: T
  errors?: Array<{ message: string; path: string[]; extensions: { code: string } }>
}>
