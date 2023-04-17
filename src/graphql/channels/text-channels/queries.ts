
import gql from 'graphql-tag'

export const qFetchTextChannel = gql`
query GetTextChannelById($getTextChannelByIdId: String!) {
  getTextChannelById(id: $getTextChannelByIdId) {
    group {
      id
      members {
        id
        icon
        displayName
        code
      }
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
