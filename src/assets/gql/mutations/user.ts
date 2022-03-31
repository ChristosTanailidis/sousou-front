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
