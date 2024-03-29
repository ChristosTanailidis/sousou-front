import { TextChannel } from './TextChannel'
import { VoiceChannel } from './VoiceChannel'
import { User } from './User'

export interface Group {
  id: string
  name: string
  invitationPermissionUsers: [User]
  icon: string
  color: string
  createdAt: Date
  preferences: JSON
  owner: User
  members: [User]
  textChannels: [TextChannel]
  voiceChannels: [VoiceChannel]
}
