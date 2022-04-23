import gql from 'graphql-tag'

export const qGetGroups = gql`
  query GetGroups($paginationInputData: PaginatedInputData!) {
    groups: getGroups(paginationInputData: $paginationInputData) {
      data {
        id
        name
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
      }
      total
    }
  }
`
