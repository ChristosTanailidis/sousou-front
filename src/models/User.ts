import { FriendRequest } from './FriendRequest'
import { VoiceChannel } from './VoiceChannel'
import { Group } from './Group'
import { PersonalChat } from './PersonalChat'

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  code: string
  icon: string
  createdAt: Date
  confirmEmailToken: string
  emailConfirm: boolean
  jwtToken?: string
  preferences: JSON
  connectedVoiceChannel?: VoiceChannel
  groups: [Group]
  ownedGroups: [Group]
  friendRequests: [FriendRequest]
  myFriendRequests: [FriendRequest]
  friendList: [User]
  personalChats: [PersonalChat]
}
