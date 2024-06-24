export enum Types {
  SAVE_HISTORY_ME = 'SAVE_HISTORY_ME',
  RESET = 'RESET'
}

export type HistoryMeType = {
  chartBlock?: {
    avgPerDay: number
    percentage: number | null
    data: any[]
  }
  statisticCountBlock?: {
    unitCount: number | null
    questionCount: number | null
    score: number | null
    timeLearned: number | null
    prevUnitCount: number | null
    prevQuestionCount: number | null
    prevScore: number | null
    prevTimeLearned: number | null
  }
  courseBlock?: {
    name: string
    imageUrl: string
    duration: number
    unitCount: number
    timeFinishCourse: number
    unitLearnedCount: number
    categories: {
      id: number
      name: string
      slug: string
      imageUrl: string
      displayHome: boolean
      sequenceNo: number
      isActive: boolean
      parentId: number | null
    }[]
  }[]
}
