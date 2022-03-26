import type GroupPreferences from './preferences/group'
import type User from '~/assets/entities/user'

export default interface Group {
  id: string
  name: string
  invitationPermissionUsers: Array<User>
  icon: string
  color: string
  createdAt: Date
  preferences: GroupPreferences
  owner: User
  users: Array<User>
}
