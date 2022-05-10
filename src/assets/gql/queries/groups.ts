import gql from 'graphql-tag'

export function qGetGroups(testIfICan: boolean) {
  return gql`
    query GetGroups($paginationInputData: PaginatedInputData!) {
      groups: getGroups(paginationInputData: $paginationInputData) {
        data {
          id
          icon
          invitationPermissionUsers {
            id
          }
          color
          createdAt
          preferences
          owner {
            id
          }
          members {
            id
          }
          ${testIfICan ? 'name' : ''}
        }
        total
      }
    }
  `
}
