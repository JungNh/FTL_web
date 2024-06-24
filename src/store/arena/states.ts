import { ContestType } from '../../utils/enums'

export default interface States {
  mode: ContestType | null
  is_registed: boolean
  candidate_info: any
  error_message: string | null
  contests_registration_succeed_id: number | null
  data_round_info: any
  tab_option: string
  is_open_popup_edit_user: boolean
  is_form_code: boolean
  answers?: any
}
