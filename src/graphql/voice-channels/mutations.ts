import gql from 'graphql-tag'

export const mConnectToVoiceChannel = gql`
mutation ConnectToVoiceChannel($voiceChannelId: String!) {
  connectToVoiceChannel(voiceChannelId: $voiceChannelId)
}
`

export const mDisconnectFromVoiceChat = gql`
mutation DisconnectFromVoiceChat {
  disconnectFromVoiceChat
}
`

export const mKickFromVoiceChannel = gql`
mutation KickFromVoiceChannel($voiceChannelId: String!, $kickFromVoiceChannelId: String!) {
  kickFromVoiceChannel(voiceChannelId: $voiceChannelId, id: $kickFromVoiceChannelId)
}
`
