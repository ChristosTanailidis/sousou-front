export interface RegisterUser {
  username: string
  email: string
  displayName: string
  password: string
}

export interface LoginUser {
  email: string
  password: string
}

export interface UpdateUserData {
  displayName: string
  username: string
  icon?: string
}

export interface GroupInputData {
  name: string
  icon: string
  color: string
}

export interface GroupInviteData {
  toUserId: string
  message: string
  groupId: string
}

export interface FriendRequestInputData {
  toUserId: string
  message: string
}
