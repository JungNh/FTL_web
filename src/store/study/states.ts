import { LessionType, SectionType, GameResoucesType } from './types'

export default interface States {
  readonly allSections: any
  readonly currentCourse: any
  readonly currentSection: {
    index: number
    data: SectionType
  } | null
  readonly parentLessons: {
    index: number
    data: LessionType
    childLessons: LessionType[]
  } | null
  readonly childLesson: {
    index: number
    data: LessionType
  } | null
  readonly gameResouces: GameResoucesType[]
  readonly modalWelcome: boolean
  readonly checkLang: any
  readonly listPurcharse: any
  readonly showActiveCode: any
  readonly sectionInCourse: any
  readonly perSectionsCourse: any
}
