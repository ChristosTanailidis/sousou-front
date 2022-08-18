export interface PaginationData {
  page: number
  limit: number
  filter?: string
}

export type GroupPaginationData = PaginationData
export type UserPaginationData = PaginationData
