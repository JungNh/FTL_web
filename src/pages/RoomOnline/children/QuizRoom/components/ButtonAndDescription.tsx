import React from 'react'
import type { FC } from 'react'
import ReactHtmlParser from 'react-html-parser'
import Button from '../../../../../components/Button'
import { htmlSpecialLetter } from '../../../../../utils/common'

type Props = {
  isAnswerShow: boolean
  correctAns: string | string[]
  userAns: string | string[]
  questionExplain: string
  isCorrect: boolean
  changQuestion: (type: 'prev' | 'next') => void
  btnDisabled: { left: boolean; right: boolean }
}

const ButtonAndDescription: FC<Props> = ({
  isAnswerShow,
  correctAns,
  userAns,
  isCorrect,
  questionExplain,
  changQuestion,
  btnDisabled,
}) => (
  <div>
    {isAnswerShow && (
    <div className="explain__result">
      <div className="title__exp">Đáp án:</div>
      <div className="correct_exp mt-1 d-flex">
        <p className="me-3 mb-0">Đáp án chính xác là: </p>
        <span>
          {typeof correctAns === 'object'
            ? correctAns.map((item: any, index: number) => (
              <p key={index} className="mb-0">
                {ReactHtmlParser(
                  htmlSpecialLetter(`${correctAns.length > 1 ? '- ' : ''}${item}`)
                )}
              </p>
            ))
            : correctAns}
        </span>
      </div>

      {isCorrect === false && userAns && (
      <div className="wrong_exp mt-1 d-flex">
        <p className="me-3 mb-0">Câu trả lời của bạn là: </p>
        <span>
          {typeof userAns === 'object'
            ? userAns?.map((item: any, index: number) => (
              <p key={index} className="mb-0">
                {ReactHtmlParser(
                  htmlSpecialLetter(`${userAns?.length > 1 ? '- ' : ''}${item}`)
                )}
              </p>
            ))
            : userAns}
        </span>
      </div>
      )}
      {questionExplain && (
      <>
        <div className="title__exp mt-3">Giải thích đáp án</div>
        <div>{ReactHtmlParser(questionExplain)}</div>
      </>
      )}
    </div>
    )}

    <div className="d-flex justify-content-center px-5 button__direct">
      <Button.Solid
          // color="gray"
        className="my-3 mx-3 prev__button text-uppercase fw-bold"
        content="Trước"
        onClick={() => changQuestion('prev')}
        disabled={btnDisabled.left}
      />
      <Button.Solid
        className="my-3 mx-3 text-uppercase fw-bold"
        content="Tiếp theo"
        disabled={btnDisabled.right}
        onClick={() => changQuestion('next')}
      />
    </div>
  </div>
)

export default ButtonAndDescription
