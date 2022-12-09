
import gql from 'graphql-tag'

export const qFetchTextChannel = gql`
query GetTextChannelById($getTextChannelByIdId: String!) {
  getTextChannelById(id: $getTextChannelByIdId) {
    group {
      id
    }
    id
    messages {
      id
    }
    name
    slowMode
    users {
      id
    }
  }
}
`
