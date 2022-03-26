import gql from 'graphql-tag'

export const createUser = gql`
  mutation Mutation($data: UserRegisterInputData!) {
    user: registerUser(data: $data) { ## todo: change this to boolean return
      id
      displayName,
      email,
    }
  }
`
