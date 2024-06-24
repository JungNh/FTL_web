import { ContestType } from '../../utils/enums'

interface Item {
  id: number
  status: boolean
  title: string
  // Các trường dữ liệu khác...
}

export default interface States {
  list_popup: Item[]
  list_item_popup_show: Item[]
  item_popup: any
  list_item_slider: any
}
