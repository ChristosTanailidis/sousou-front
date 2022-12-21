import { PersonalMessage } from './PersonalMessage'
import { User } from './User'

export interface PersonalChat {
  id: string
  users: [User]
  messages: [PersonalMessage]
}

export interface PersonalChatUsersPivot {
  id: string
  personalChat: PersonalChat
  users: [User]
  lastReadMessage?: PersonalMessage
  mute: boolean
}
