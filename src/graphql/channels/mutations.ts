import gql from 'graphql-tag'

export const mCreateTextChannel = gql`
mutation CreateTextChannel($data: TextChannelInputData!) {
  createTextChannel(data: $data)
}
`
export const mCreateVoiceChannel = gql`
mutation CreateVoiceChannel($data: VoiceChannelInputData!) {
  createVoiceChannel(data: $data)
}
`
