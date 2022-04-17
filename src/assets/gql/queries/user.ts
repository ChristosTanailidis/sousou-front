import gql from 'graphql-tag'

export const qGetUserByID = gql`
  query GetUserById {
    user: getUserById(id: "a3fd5f56-f0c6-48d9-b393-a52780b90547") {
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
