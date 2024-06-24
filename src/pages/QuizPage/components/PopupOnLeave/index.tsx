import * as React from 'react'
import './styles.scss'

import Button from '../../../../components/Button'
import PopupContainer from '../../../../components/PopupContainer'

type Props = {
  open: boolean,
  onSubmit: any,
  onClose: any,
}

const PopupOnLeave: React.FC<Props> = ({ onSubmit, open, onClose }) => {
  return open ? (
    <PopupContainer onClose={onClose}>
      <div className="popuponleave__component">
        <div className="content__text">
          <p>Bạn chưa hoàn thành bài thi! Bạn có muốn nộp bài và thoát khỏi ứng dụng không?</p>
        </div>
        <div className="content__button">
          <Button.Shadow content="NỘP BÀI" color='gray' onClick={onSubmit} />
          <Button.Shadow content="LÀM TIẾP" onClick={onClose} />
        </div>
      </div>
    </PopupContainer>
  ) : null;
}

export default PopupOnLeave
