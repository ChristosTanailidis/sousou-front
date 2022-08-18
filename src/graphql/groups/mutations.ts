import gql from 'graphql-tag'

// BASE
export const mCreateGroup = gql`
mutation CreateGroup($data: GroupInputData!) {
  createGroup(data: $data)
}
`

export const mUpdateGroup = gql`
mutation UpdateGroup($data: GroupInputData!, $updateGroupId: String!) {
  updateGroup(data: $data, id: $updateGroupId)
}
`

export const mDeleteGroup = gql`
mutation DeleteGroup($deleteGroupId: String!) {
  deleteGroup(id: $deleteGroupId)
}
`

// ADMIN SETTINGS
export const mUpdateGroupPreferences = gql`
mutation UpdateGroupPreferences($data: GroupPreferencesInputData!, $updateGroupPreferencesId: String!) {
  updateGroupPreferences(data: $data, id: $updateGroupPreferencesId)
}
`

export const mTransferOwnershipToUser = gql`
mutation TransferOwnershipToUser($newOwnerId: String!, $transferOwnershipToUserId: String!) {
  transferOwnershipToUser(newOwnerId: $newOwnerId, id: $transferOwnershipToUserId)
}
`

// INVITES
export const mCreateGroupInvite = gql`
mutation CreateGroupInvite($data: GroupInviteInputData!) {
  createGroupInvite(data: $data)
}
`

export const mCancelGroupInvite = gql`
mutation CancelGroupInvite($cancelGroupInviteId: String!) {
  cancelGroupInvite(id: $cancelGroupInviteId)
}
`

export const mAnswerGroupInvite = gql`
mutation AnswerGroupInvite($answer: Boolean!, $answerGroupInviteId: String!) {
  answerGroupInvite(answer: $answer, id: $answerGroupInviteId)
}
`
