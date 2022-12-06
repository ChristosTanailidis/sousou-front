import { Group } from './Group'
import { User } from './User'

export interface GroupInvite {
  id: string
  answer?: boolean
  canceled?: boolean
  message: string
  createdAt: Date
  updatedAt?: Date
  group: Group
  fromUser: User
  toUser: User
}
