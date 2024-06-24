import * as React from 'react'
import _ from 'lodash'
import './styles.scss'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'

import warning from '../../../../assets/images/warning.png'

type Props = {
  open: boolean
  questions: Question[]
  onClose: any
  onSubmit: any
  isDisable: boolean
}

const getNotAnswerList = (list: any) => {
  return !_.isEmpty(list) ? (
    <div className="content__warning">
      <img src={warning} alt="warning" />
      <p>
        Bạn vẫn chưa hoàn thành <b>{list.length}</b> câu: <b>{list.join(', ')}</b>
      </p>
    </div>
  ) : null
}

const PopupSubmit: React.FC<Props> = ({ questions, open, onClose, onSubmit, isDisable }) => {
  const list = questions
    .map((question: any, index: number) => {
      if (question.answered.length == 0) return index + 1
    })
    .filter((q: any) => q)

  // console.log('list', list, questions[0]?.answered, questions[0]?.answered)
  return open ? (
    <PopupContainer onClose={onClose}>
      <div className="popupsubmit__component">
        {getNotAnswerList(list)}
        <div className="content__text">
          <p>Bạn có muốn nộp bài không?</p>
        </div>
        <div className="content__buttons">
          <Button.Shadow content="NỘP BÀI" color="gray" onClick={onSubmit} disabled={isDisable} />
          {!_.isEmpty(list) && <Button.Shadow content="LÀM TIẾP" onClick={onClose} />}
        </div>
      </div>
    </PopupContainer>
  ) : null
}

export default PopupSubmit
