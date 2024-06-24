export type ImageResourcesType = {
  bg: string
  btn: string
  btn_answer: string
  btn_answer_off: string
  btn_back: string
  btn_null: string
  btn_sound_off: string
  btn_sound_on: string
  btn_summary: string
  game_name: string
  ico_board_correct: string
  ico_board_text: string
  ico_board_summary: string
  ico_brick_blue: string
  ico_brick_cyan: string
  ico_brick_green: string
  ico_brick_purple: string
  ico_brick_red: string
  ico_brick_yellow: string
  ico_hammer: string
  ico_heart_empty: string
  ico_heart_full: string
  ico_result_correct: string
  ico_result_wrong: string
  ico_robo_happy: string
  ico_robo_sad: string
  ico_score_arrow: string
  ico_score_ladder: string
  ico_score_point: string
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
