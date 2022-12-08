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
      icon
    }
    personalChats {
      id
    }
    myGroupInvites {
      answer
      canceled
      createdAt
      fromUser {
        id
      }
      group {
        id
      }
      id
      message
      toUser {
        id
      }
      updatedAt
    }
    groupInvites {
      answer
      canceled
      createdAt
      fromUser {
        id
        displayName
      }
      group {
        id
        icon
        createdAt
        color
        name
        members {
          id
        }
      }
      id
      message
      updatedAt
    }
  }
}
`

export const qCheckUsernameAvailability = gql`
query Query($username: String!) {
  usernameExists(username: $username)
}
`
