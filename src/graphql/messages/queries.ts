import gql from 'graphql-tag'

// todo: https://github.com/Lemas97/Sousou-Api/issues/34
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
        # readBy {
        #   user {
        #     code
        #     displayName
        #     email
        #     id
        #     icon
        #   }
        # }
        id
        state
        text
        callData
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
