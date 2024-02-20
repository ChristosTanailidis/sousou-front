import gql from 'graphql-tag'

export const mCreateFriendRequest = gql`
mutation CreateFriendRequest($data: FriendRequestInputData!) {
  createFriendRequest(data: $data) {
    id
    message
    createdAt
    updatedAt
    answer
    canceled
    fromUser {
      id
    }
    toUser {
      id
    }
  }
}
`

export const mCancelFriendRequest = gql`
mutation CancelFriendRequest($cancelFriendRequestId: String!) {
  cancelFriendRequest(id: $cancelFriendRequestId) {
    id
    message
    updatedAt
    createdAt
    answer
    canceled
    fromUser {
      id
    }
    toUser {
      id
    }
  }
}
`

export const mAnswerFriendRequest = gql`
mutation AnswerFriendRequest($answer: Boolean!, $answerFriendRequestId: String!) {
  answerFriendRequest(answer: $answer, id: $answerFriendRequestId) {
    id
    message
    createdAt
    updatedAt
    answer
    canceled
    fromUser {
      id
    }
    toUser {
      id
    }
  }
}
`

export const mRemoveFriend = gql`
mutation DeleteFriend($deleteFriendId: String!) {
  deleteFriend(id: $deleteFriendId)
}
`
