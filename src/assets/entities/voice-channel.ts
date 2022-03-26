import type Group from './group'
import type User from './user'

export default interface VoiceChannel {
  id: string
  name: string
  maxUsers: number
  group: Group
  users: Array<User>
}
