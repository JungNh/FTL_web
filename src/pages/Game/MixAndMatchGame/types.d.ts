export type ImageResourcesType = {
  bg: string
  btn: string
  btn_answer: string
  btn_answer_blue: string
  btn_answer_gray: string
  btn_answer_green: string
  btn_answer_off: string
  btn_answer_pink: string
  btn_answer_red: string
  btn_answer_teal: string
  btn_answer_yellow: string
  btn_back: string
  btn_null: string
  btn_sound_off: string
  btn_sound_on: string
  btn_summary: string
  game_logo: string
  game_name: string
  ico_board_correct: string
  ico_board_question: string
  ico_board_summary: string
  ico_board_text: string
  ico_heart_empty: string
  ico_heart_full: string
  ico_result_correct: string
  ico_result_wrong: string
  ico_robo_happy: string
  ico_robo_sad: string
  ico_sound: string
  logo: string
}

export type AudioResourcesType = {
  theme: string
  sound_wrong: string
  sound_correct: string
  sound_break: string
  sound_ohno: string
  sound_amazing: string
}

export type AnswerType = { id: string | number; value: string; isCorrect: boolean }

export type UserAnswerType = {
  text: string
  isCorrect: boolean
  quesImage: string
  quesAudio: string
}
