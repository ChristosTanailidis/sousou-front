import { Message } from './Message'
import { PersonalChat } from './PersonalChat'
import { User } from './User'

export type MessageStateType = 'SENDED' | 'DELETED_FOR_ME' | 'DELETED_FOR_ALL'

export interface CallData {
  answer?: boolean
  startTimestamp?: Date
  endTimestamp?: Date
  endCallingTimestamp?: Date
}

export interface PersonalMessage extends Message {
  readBy: [User],
  personalChat: PersonalChat
  callData: CallData
  isCall: boolean
}
