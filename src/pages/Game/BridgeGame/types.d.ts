export type ImageResourcesType = {
  btn: string
  btn_back: string
  btn_sound_off: string
  btn_sound_on: string
  btn_summary: string
  ico_board_text: string
  ico_heart_empty: string
  ico_heart_full: string
  ico_result_correct: string
  ico_result_wrong: string
  ico_robo_happy: string
  ico_robo_sad: string
  ico_sound: string
  logo: string
  ico_board_summary: string
  bg: string
  ico_stone_left: string
  ico_stone_middle: string
  ico_stone_right: string
  game_name: string
  ico_blossom_tree: string
  ico_water: string
  ico_decorate_right: string
  ico_decorate_left: string
  ico_decorate_right_2: string
  btn_null: string
  ico_stone: string
  ico_board_correct: string
  ico_wood_right: string
  ico_wood_left: string
  ico_wood_middle: string
  ico_blank: string
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
