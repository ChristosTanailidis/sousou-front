export interface UserPagination {
  page: number
  limit: number
  filter?: string // todo: add this on filter-data instead of pagination-data?
}
