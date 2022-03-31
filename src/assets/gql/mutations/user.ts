import gql from 'graphql-tag'

export const createUser = gql`
  mutation RegisterUser($data: UserRegisterInputData!) {
    user: registerUser(data: $data) { ## todo: change this to boolean return
      id
      displayName,
      email,
    }
  }
`

export const loginUser = gql`
  mutation loginUser($data: LoginUserInputData!) {
    loginUser(data: $data)
  }
`
