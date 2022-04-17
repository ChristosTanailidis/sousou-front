import gql from 'graphql-tag'

export const mCreateGroup = gql`
  mutation createGroup($data: GroupInputData!) {
    createGroup(data: $data)
  }
`
