import gql from 'graphql-tag'

export const createUser = gql`
  mutation registerUser($data: UserRegisterInputData!) {
    registerUser(data: $data)
  }
`

export const loginUser = gql`
  mutation loginUser($data: LoginUserInputData!) {
    loginUser(data: $data)
  }
`
