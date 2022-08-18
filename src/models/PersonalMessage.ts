import { PersonalChat } from './PersonalChat'
import { User } from './User'

export type MessageStateType = 'SENDED' | 'DELETED_FOR_ME' | 'DELETED_FOR_ALL'

export interface PersonalMessage {
  id: string
  createdAt: Date
  text: string
  deleteForAll?: boolean
  state: MessageStateType
  file?: string
  from: User
  readBy: [User]
  deletedFromUsers: [User]
  personalChat: PersonalChat
}
