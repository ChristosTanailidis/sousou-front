import { Group } from './Group'
import { User } from './User'

export interface VoiceChannel {
  id: string
  name: string
  maxUsers?: number
  group: Group
  users: [User]
}
