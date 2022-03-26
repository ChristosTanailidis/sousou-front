import type User from './user'

export default interface FriendRequest {
  id: string
  message: string
  createdAt: Date
  updatedAt: Date
  answer: boolean
  cancelled: boolean
  fromUser: User
  toUser: User
}
