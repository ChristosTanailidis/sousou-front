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

export const qGetUsers = gql`
  query GetUsers($paginatedData: PaginatedInputData!) {
    users: getUsers(paginatedData: $paginatedData) {
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
      total
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
      # total
    }
  }
`

export const qGetFriendRequests = gql`
  query GetFriendRequests($forMe: Boolean!, $paginatedData: PaginatedInputData!) {
    friendRequests: getFriendRequests(forMe: $forMe, paginatedData: $paginatedData) {
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
      }
      total
    }
  }
`
