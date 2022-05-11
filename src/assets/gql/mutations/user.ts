import gql from 'graphql-tag'

export const mCreateUser = gql`
  mutation registerUser($data: UserRegisterInputData!) {
    registerUser(data: $data)
  }
`

// todo: this is a query
export const mLoginUser = gql`
  mutation loginUser($data: LoginUserInputData!) {
    token: loginUser(data: $data)
  }
`

// todo: this is a query
export const mLogoutUser = gql`
  mutation logoutUser {
    loggedOut: logoutUser
  }
`

export const mCreateFriendRequest = gql`
  mutation CreateFriendRequest($data: FriendRequestInputData!) {
    created: createFriendRequest(data: $data) {
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
  }
`
