export enum Types {
  SAVE_LIST_ROOM = 'SAVE_LIST_ROOM',
  SAVE_CURRENT_ROOM = 'SAVE_CURRENT_ROOM',
  SAVE_MEMBER = 'SAVE_MEMBER',
  SAVE_CONTEST = 'SAVE_CONTEST',
  RESET = 'RESET'
}

export type RoomType = {
  name: string
  gradeId: number
  periodId: number
  description: string
  memberCount: number
  isPrivate: boolean
  contestId: number
  password?: string
  expertise: string

  code?: number
  createdAt?: string
  createdBy?: number
  createdDate?: string
  id?: number
  joinedMemberCount?: number
  startedAt?: string | null
  status?: string
  updatedAt?: string
}
