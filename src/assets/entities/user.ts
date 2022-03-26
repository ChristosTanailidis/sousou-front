import type Group from './group'
import type VoiceChannel from './voice-channel'
import type FriendRequest from './friend-request'
import type UserPreferences from '~/assets/entities/preferences/user'

export default interface User {
  id: string
  username: string
  displayName: string
  email: string
  code: string
  password: string
  icon: string
  createdAt: Date
  token?: string
  preferences: UserPreferences
  connectedToVoiceChannel: VoiceChannel
  groups: Array<Group>
  ownedGroups: Array<Group>
  friendRequests: Array<FriendRequest>
  myFriendRequests: Array<FriendRequest>
  friendList: Array<User>
}
