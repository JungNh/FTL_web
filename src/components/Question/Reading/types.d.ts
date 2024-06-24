export type UserAnswerType = {
  questionId?: number
  isCorrect?: boolean
  value?: number[]
  valueString?: string
  score?: number
}

export type AnswerType = {
  audioUrl: string | null
  createdAt: string
  id: number
  imageUrl: string | null
  isActive: boolean
  isCorrect: boolean
  questionId: number
  updatedAt: string
  value: string
  label?: string
}

export type QuestionType = {
  answers: AnswerType[]
  audioUrl: string | null
  childs: QuestionType[]
  contestId: number | null
  duration: number
  hasImage: boolean
  hasManyCorrectAnswers: boolean
  id: number
  isActive: true
  metas: unknown[]
  parentId: number | null
  questionExplain: string | null
  questionText: string | null
  questionTitle: string
  richText: string | null
  sequenceNo: number
  type: string
  unitId: number
  vocabs: unknown[]
}

type SectionScore = {
  unit_duration: number
  unit_id: number
  unit_parent_id: number | null
  unit_percentage: any
  unit_score: number
  unit_total_score: number
}
