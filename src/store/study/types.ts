export enum Types {
  SAVE_ALL_LESSONS = 'SAVE_ALL_LESSONS',
  SAVE_ALL_SECTIONS = 'SAVE_ALL_SECTIONS',
  SAVE_CURRENT_COURSE = 'SAVE_CURRENT_COURSE',
  SAVE_CURRENT_SECTION = 'SAVE_CURRENT_SECTION',
  SAVE_PARENT_LESSON = 'SAVE_PARENT_LESSON',
  SAVE_CHILD_LESSON = 'SAVE_CHILD_LESSON',
  SAVE_GAME_RESOURCES = 'SAVE_GAME_RESOURCES',
  SAVE_MODAL_WELCOME = 'SAVE_MODAL_WELCOME',
  RESET = 'RESET',
  SAVE_CHECK_LANGUAGE = 'SAVE_CHECK_LANGUAGE',
  SAVE_LIST_PURCHARSE = 'SAVE_LIST_PURCHARSE',
  SHOW_ACTIVE = 'SHOW_ACTIVE',
  SAVE_PER_SECTION_COURSE = 'SAVE_PER_SECTION_COURSE'
}

export type SectionType = {
  courseId: number
  id: number
  name: string
  sequenceNo: number
  lessons?: LessionType[]
  totalScore?: number
  percentage?: number
}

export type SectionScoreType = {
  unit_duration: number
  unit_id: number
  unit_parent_id: number | null
  unit_percentage: number | null
  unit_score: number
  unit_total_score: number
}

export type LessionType = {
  canAccess: boolean
  childs?: LessionType[]
  canAccessCourse: boolean
  canComment: boolean
  commentCount: number
  content: string
  duration: number
  finishQuestion: boolean
  hasQuestion: boolean
  id: number
  isPrivate: boolean
  isQuiz: boolean
  name: string
  parentId: number | null
  percentage: number
  quizType: string
  quizzCount: number
  sectionId: number
  section?: SectionType
  sequenceNo: number
  slug: string
  status: string
  studentUnitStatus: string
  studentunits: {
    accountId: number | null
    endAt: string | null
    id: number
    startAt: string
    status: string
    studentId: number
    unitId: number
  }[]
  type: string
  updatedBy: number
  visibleOn: number
  metas?: string[]

  // ** custom
  isPercentLock?: boolean
}
export type CourseScore = { name: string; url: string }
export type RankUser = {
  ranking: number
  diamond_available: number
  score: number
  user_id: number
  user_avatar: string
  user_name: string
  user_sex: string
}
export type ResourceType = { name: string; url: string }
export type GameResoucesType = { name: string; image: ResourceType[]; audio: ResourceType[] }
