export type ImageResourcesType = {
  btn: string
  btn_answer: string
  btn_back: string
  btn_null: string
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
  bg_playing: string
  bg_correct: string
  ico_ball_big: string
  ico_robo_like: string
  ico_robo_shy: string
  game_name: string
  ico_robo_pre_throw: string
  ico_robo_throw: string
  ico_ball_small: string
  ico_basket_stand: string
  ico_basket: string
  ico_ball_shadow: string
  ico_board_correct: string
  ico_cup_gold: string
  ico_cup_silver: string
  ico_cup_bronze: string
  ico_laurel_wreath: string
  ico_podium: string
  ico_robo_lose: string
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
