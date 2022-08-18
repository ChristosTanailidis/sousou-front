import { AxiosResponse } from 'axios'

export interface CustomError {
  message: string
  path: string[]
  extensions: {
    code: string
  }
}

export type GraphQLResponse<T> = AxiosResponse<{
  data?: T
  errors?: CustomError[]
}>
