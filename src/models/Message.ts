import { MessageStateType } from './PersonalMessage'
import { User } from './User'

export interface Message {
  id: string
  createdAt: Date
  text: string
  deleteForAll?: boolean
  state: MessageStateType
  file?: string
  from: User
  deletedFromUsers: User[]
}
