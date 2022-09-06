import gql from 'graphql-tag'

export const qGetLoggedUser = gql`
query GetLoggedUser {
  user: getLoggedUser {
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
      name
      icon
      color
      createdAt
      preferences
      owner {
        id
      }
      members {
        id
      }
      invitationPermissionUsers {
        id
      }
    }
    ownedGroups {
      id
      name
      icon
      color
      createdAt
      preferences
      owner {
        id
      }
      members {
        id
      }
      invitationPermissionUsers {
        id
      }
    }
    friendRequests {
      id
      message
      fromUser {
        id
        code
        displayName
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

      }
    }
    myFriendRequests {
      id
      message
      toUser {
        id
        code
        displayName
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

      }
    }
    friendList {
      id
      code
      displayName
      username
    }
    personalChats {
      id
    }
  }
}
`
