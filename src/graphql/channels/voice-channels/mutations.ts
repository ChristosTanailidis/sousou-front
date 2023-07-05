import gql from 'graphql-tag'

export const mCreateVoiceChannel = gql`
mutation CreateVoiceChannel($data: VoiceChannelInputData!) {
  createVoiceChannel(data: $data)
}
`

export const mConnectToVoiceChannel = gql`
mutation ConnectToVoiceChannel($connectToVoiceChannelId: String!) {
  connectToVoiceChannel(id: $connectToVoiceChannelId)
}
`

export const mKickFromVoiceChannel = gql`
mutation KickFromVoiceChannel($userId: String!, $kickFromVoiceChannelId: String!) {
  kickFromVoiceChannel(userId: $userId, id: $kickFromVoiceChannelId)
}
`
