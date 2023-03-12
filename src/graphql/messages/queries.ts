import gql from 'graphql-tag'

export const qGetPersonalMessages = gql`
  query GetPersonalMessagesActionByPersonalChatId($paginationInputData: PaginatedInputData!, $personalChatId: String!) {
    getPersonalMessages: getPersonalMessagesActionByPersonalChatId(paginationInputData: $paginationInputData, personalChatId: $personalChatId) {
      data {
        createdAt
        deleteForAll
        deletedFromUsers {
          id
        }
        file
        from {
          id
        }
        id
        state
        text
      }
      total
    }
  }
`

export const qGetGroupChannelMessages = gql`
  query GetPaginatedTextChannelMessagesByTextChannelId($getPaginatedTextChannelMessagesByTextChannelIdId: String!, $paginationInputData: PaginatedInputData!) {
    getChannelMessages: getPaginatedTextChannelMessagesByTextChannelId(id: $getPaginatedTextChannelMessagesByTextChannelIdId, paginationInputData: $paginationInputData) {
      data {
        createdAt
        deleteForAll
        deletedFromUsers {
          id
        }
        file
        from {
          id
        }
        id
        state
        text
      }
      total
    }
  }
`
