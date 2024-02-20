import { PersonalMessage } from './PersonalMessage'
import { User } from './User'

export interface PersonalChat {
  id: string
  users: [User]
  messages: [PersonalMessage]
  mute: boolean
  disabled?: boolean

  // my things
  latestMessage?: string,
  newMessagesNumber?: number
}
