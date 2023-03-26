import { PersonalChat } from './PersonalChat'
import { PersonalMessage } from './PersonalMessage'
import { TextChannel } from './TextChannel'
import { TextChannelMessage } from './TextChannelMessage'
import { User } from './User'

export interface LastReadMessagePivot {
  user: User
  personalChat?: PersonalChat
  lastReadMessage: PersonalMessage
}

export interface TextChannelUserPivot {
  textChannel?: TextChannel
  user: User
  lastReadMessage?: TextChannelMessage
  mute: boolean
}

export type MessageReadData = LastReadMessagePivot | TextChannelUserPivot
