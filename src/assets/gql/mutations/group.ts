import gql from 'graphql-tag'

export const mCreateGroup = gql`
  mutation createGroup($data: GroupInputData!) {
    created: createGroup(data: $data)
  }
`
