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
