import { Group } from './Group'

export interface TextChannelChat {
  id: string
  group: Group
  name: string
  slowMode?: number
}
