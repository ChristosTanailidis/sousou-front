import { TextChannelMessage } from './TextChannelMessage'
import { Group } from './Group'
import { User } from './User'

export interface TextChannel {
  id: string
  name: string
  slowMode: number
  group: Group
  users: User[]
  messages: TextChannelMessage[]
}
