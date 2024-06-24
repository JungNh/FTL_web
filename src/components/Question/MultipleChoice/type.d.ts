export type AnswerType = {
  audioUrl?: string
  id: number
  imageUrl?: string
  isCorrect?: boolean
  questionId?: number
  value?: string
}

export type MetaType = {
  id?: number
  key?: string
  questionId?: number
  value?: string
}

export type LessionType = {
  id: number
  questionTitle?: string
  questionText?: string
  questionExplain?: string
  answers?: AnswerType[]
  audioUrl?: string
  metas: MetaType
}
