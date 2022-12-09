import gql from 'graphql-tag'

export const mCreateTextChannel = gql`
mutation CreateTextChannel($data: TextChannelInputData!) {
  createTextChannel(data: $data)
}
`
