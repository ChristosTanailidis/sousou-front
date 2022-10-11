import gql from 'graphql-tag'

export const qGetUsers = gql`
  query GetUsers($paginatedData: PaginatedInputData!) {
    getUsers(paginatedData: $paginatedData) {
      data {
        id
        username
        displayName
        email
        code
        icon
        createdAt
        confirmEmailToken
        emailConfirm
        jwtToken
        preferences
        connectedVoiceChannel {
          id
        }
        groups {
          id
          icon
          color
        }
        ownedGroups {
          id
          icon
          color
        }
        friendRequests {
          id,
        }
        myFriendRequests {
          id
        }
        friendList {
          id
        }
        personalChats {
          id
        }
      }
      total
    }
  }
`

export const qGetUsersToAdd = gql`
  query GetAvailableUsersToAdd($paginatedData: PaginatedInputData!) {
    getAvailableUsersToAdd(paginatedData: $paginatedData) {
      data {
        id
        username
        displayName
        email
        code
        icon
        createdAt
        confirmEmailToken
        emailConfirm
        jwtToken
        preferences
        connectedVoiceChannel {
          id
        }
        groups {
          id
        }
        ownedGroups {
          id
        }
        friendRequests {
          id
        }
        myFriendRequests {
          id
        }
        friendList {
          id
        }
        groupInvites {
          id
        }
        myGroupInvites {
          id
        }
        personalChats {
          id
        }
        pending
      }
      total
    }
  }
`

export const qGetUsersToInvite = gql`
  query GetAvailableUsersToInvite($paginatedData: PaginatedInputData!, $groupId: String!) {
    getAvailableUsersToInvite(paginatedData: $paginatedData, groupId: $groupId) {
      data {
        id
        username
        displayName
        email
        code
        icon
        createdAt
        confirmEmailToken
        emailConfirm
        jwtToken
        preferences
        connectedVoiceChannel {
          id
        }
        groups {
          id
        }
        ownedGroups {
          id
        }
        friendRequests {
          id
        }
        myFriendRequests {
          id
        }
        friendList {
          id
        }
        groupInvites {
          id
        }
        myGroupInvites {
          id
        }
        personalChats {
          id
        }
        pending(groupId: $groupId)
      }
      total
    }
  }
`

export const qGetFriendRequests = gql`
query GetFriendRequests($forMe: Boolean!, $paginatedData: PaginatedInputData!) {
  getFriendRequests(forMe: $forMe, paginatedData: $paginatedData) {
    data {
      id
      message
      updatedAt
      createdAt
      answer
      canceled
      fromUser {
        id
      }
      toUser {
        id
      }
    }
    total
  }
}
`
