import { FriendRequest } from './FriendRequest'
import { VoiceChannel } from './VoiceChannel'
import { PersonalChat } from './PersonalChat'
import { GroupInvite } from './GroupInvite'
import { Group } from './Group'

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
  groupInvites: [GroupInvite]
  myGroupInvites: [GroupInvite]
  friendList: [User]
  personalChats: [PersonalChat]
}

export interface UserToAdd extends User {
  pending?: boolean
}

export interface UserToInvite extends User {
  pending?: boolean
}
