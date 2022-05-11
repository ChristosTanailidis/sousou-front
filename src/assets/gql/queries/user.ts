import gql from 'graphql-tag'

export const qGetUserByID = gql`
  query GetUserById($getUserByIdId: String!) {
    user: getUserById(id: $getUserByIdId) {
      id
      username
      displayName
      email
      code
      icon
      createdAt
      confirmEmailToken
      emailConfirm
      preferences
      connectedVoiceChannel {
        id
        name
        maxUsers
        group {
          id
        }
        users {
          id
        }
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
      personalConversations {
        id
      }
    }
  }
`

export const qGetLoggedUser = gql`
  query GetLoggedUser {
    user: getLoggedUser {
      id
      username
      displayName
      email
      code
      confirmEmailToken
      createdAt
      icon
      emailConfirm
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
      personalChats {
        id
      }
    }
  }
`

// todo: add a different query for this when added
export const qGetFriends = gql`
  query GetFriends($paginatedData: PaginatedInputData!) {
    users: getUsers(paginatedData: $paginatedData) {
      data {
        friends: friendList {
          id
          username
          displayName
          email
          code
          icon
          createdAt
          confirmEmailToken
          emailConfirm
        }
      }
      total
    }
  }
`

export const qGetFriendRequests = gql`
  # todo: add this when ready
  query GetFriends($paginatedData: PaginatedInputData!) {
    users: getUsers(paginatedData: $paginatedData) {
      data {
        friends: friendList {
          id
          username
          displayName
          email
          code
          icon
          createdAt
          confirmEmailToken
          emailConfirm
        }
      }
      total
    }
  }
`
