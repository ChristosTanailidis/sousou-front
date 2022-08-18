import { User } from './User'

export interface FriendRequest {
  id: string
  message: string
  createdAt: Date
  updatedAt?: Date
  answer?: boolean
  canceled?: boolean
  fromUser: User
  toUser: User
}
