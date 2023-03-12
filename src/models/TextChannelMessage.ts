import { Message } from './Message'
import { TextChannel } from './TextChannel'
import { User } from './User'

export interface TextChannelMessage extends Message{
  textChannel: TextChannel
  readBy: User[]
}
