import { TextChannel } from './TextChannel'
import { User } from './User'

export interface TextChannelMessage {
  textChannel: TextChannel
  readBy: User
}
