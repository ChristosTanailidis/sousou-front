import gql from 'graphql-tag'

export const qGetGroups = gql`
query GetGroups($paginationInputData: PaginatedInputData!) {
  getGroups(paginationInputData: $paginationInputData) {
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

export const qGetGroupById = gql`
query GetGroupById($getGroupByIdId: String!) {
  getGroupById(id: $getGroupByIdId) {
    id
    name
    invitationPermissionUsers {
      id
    }
    icon
    color
    createdAt
    preferences
    owner {
      id
    }
    members {
      id
      username
      displayName
      email
      code
      icon
    }
    textChannels {
      id
      name
      users {
        id
      }
    }
    voiceChannels {
      group {
        id
      }
      id
      maxUsers
      name
      users {
        id
      }
    }
  }
}`

export const qGetGroupInvites = gql`
query GetGroupInvites($forMe: Boolean!, $paginationInputData: PaginatedInputData!) {
  getGroupInvites(forMe: $forMe, paginationInputData: $paginationInputData) {
    data {
      id
      message
      createdAt
      updatedAt
      answer
      canceled
      fromUser {
        id
      }
      toUser {
        id
      }
      group {
        id
      }
    }
    total
  }
}
`
