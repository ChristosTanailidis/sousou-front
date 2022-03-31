import gql from 'graphql-tag'

export const createUser = gql`
  mutation registerUser($data: UserRegisterInputData!) {
    registerUser(data: $data)
  }
`
