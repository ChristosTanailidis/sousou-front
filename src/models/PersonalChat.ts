import { Group } from './Group'
import { PersonalMessage } from './PersonalMessage'
import { User } from './User'

export interface PersonalChat {
  id: string
  users: [User]
  messages: [PersonalMessage]
  mute: boolean
}

export interface TextChannelChat {
  id: string
  group: Group
  name: string
  slowMode?: number
}

export interface PersonalChatUsersPivot {
  id: string
  personalChat: PersonalChat
  users: [User]
  lastReadMessage?: PersonalMessage
  mute: boolean
}
