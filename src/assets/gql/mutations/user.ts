import gql from 'graphql-tag'

export const qCreateUser = gql`
  mutation registerUser($data: UserRegisterInputData!) {
    registerUser(data: $data)
  }
`

// change this to return user
export const qLoginUser = gql`
  mutation loginUser($data: LoginUserInputData!) {
    loginUser(data: $data)
  }
`
