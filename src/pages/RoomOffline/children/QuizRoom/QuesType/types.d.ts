type LessonType = {
  id?: number
  isQuiz?: boolean
  name?: string
  quizType?: string
  content?: string
  questions?: QuestionType[]
  sectionId?: number
  sequenceNo?: number
  childs?: any[]
  duration?: number
}

export type QuestionType = {
  id?: number
  questionExplain?: string
  questionText?: string
  questionTitle?: string
  childs?: QuestionType[]
  richText?: string
  duration?: number
  type?: string
  audioUrl?: string
  answers?: any[]
  sequenceNo?: number
  hasImage?: boolean
  metas?: MetaType[]
  readingId?: number
  listeningId?: number
  imageUrl?: string
}
/**
 * @param {string} desCorrectAns string hiển thị khi xem kết quả
 * @param {string} desUserAns string hiển thị khi xem kết quả
 */
export type Answer = {
  id?: number
  questionId?: number
  isCorrect?: boolean
  rawAnswer?: any[]
  questionType?: string
  label?: string
  value?: string
  desCorrectAns?: string // string hiển thị khi xem kết quả
  desUserAns?: string // string hiển thị khi xem kết quả
}

export type AnswerType = {
  id: number
  questionId: number
  isCorrect: boolean
  createdAt: string
  audioUrl: string | null
  imageUrl: string | null
  isActive: boolean
  updatedAt: string
  value: string
  label?: string
}

export type UserAnswerType = {
  questionId?: number
  isCorrect?: boolean
  value?: (number | string)[]
  valueString?: string
  score?: number
  desCorrectAns?: string | string[]
  desUserAns?: string | string[]
}

export type MetaType = {
  id: number
  key: 'image' | 'audio'
  questionId: number
  value: string
}
