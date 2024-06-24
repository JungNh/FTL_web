interface Contest {
  id: number
  name: string
  allow_register: boolean
  contest_id: number
  round_index: number
  datetime_from_register: Date | string
  exam_start_time: Date | string
  exam_start_time_remaining_timestamp: number
  exam_end_time: Date | string
  exam_end_time_remaining_timestamp: number
  is_active: boolean
  contest_name: string
  contest_grade_name: string
  contest_subject_name: string
  contest_avatar: string
  contest_rules: string
  contest_status: string
  total_candidates: number
  status: string
  is_registed: boolean
  is_submitted: boolean
  is_dialed: boolean
  vip: boolean
  no_vip: boolean
  code_round: string
}

interface Quiz {
  id: number
  name: string
  sections: Section[]
}
interface Section {
  id: number
  audio: string
  image: string
  video: string
  name: string
  prefer: string
  questions: Question[]
}
interface Question {
  type_article?: string
  fill_text?: string | undefined
  id: number
  exam_section_id: number
  audio: string
  image: string
  video: string
  name: string
  content: string
  type: string
  answers: Answer[]
  answered?: number[]

  section_name: string
  section_prefer: string
  section_audio: string
  section_image: string
  section_video: string
}
interface Answer {
  id: number
  audio: string
  image: string
  misc: string
  type: string
  text: string
  video: string
}
interface Gift {
  id: number
  name: string
  number_of_units_per_hit: number
  image: string
}
