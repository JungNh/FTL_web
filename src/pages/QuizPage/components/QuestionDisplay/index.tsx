import * as React from 'react'
import './styles.scss'

import Video from '../Video'
import AudioPlayer from '../AudioPlayer'
import DisplayMarkup from '../DisplayMarkup'
import { Button, Input } from '../../../../components'
import ReactHtmlParser from 'react-html-parser'
import { htmlSpecialLetter } from '../../../../utils/common'

type Props = {
  data: Question
  currentQuestion: number
  questionLength: number
  chooseQuestion: any
  answerQuestion: any
  submit: any
}

const getHeading = (index: number) => {
  switch (index) {
    case 0:
      return 'A'
    case 1:
      return 'B'
    case 2:
      return 'C'
    case 3:
      return 'D'
  }
}

const QuestionDisplay: React.FC<Props> = ({
  data,
  currentQuestion,
  chooseQuestion,
  questionLength,
  answerQuestion,
  submit
}) => {
  const next = () => {
    if (currentQuestion === questionLength - 1) {
      submit()
    } else {
      chooseQuestion(currentQuestion + 1)
    }
  }
  const prev = () => chooseQuestion(currentQuestion - 1)

  const handleKeyDown = (event: any) => {
    if (event.key === 'ArrowLeft' && currentQuestion > 0) {
      event.preventDefault()
      prev() // Xử lý khi nhấn mũi tên trái
    } else if (event.key === 'ArrowRight' && currentQuestion < questionLength - 1) {
      event.preventDefault()
      next() // Xử lý khi nhấn mũi tên phải
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown) // Bắt sự kiện khi component được mount
    return () => {
      document.removeEventListener('keydown', handleKeyDown) // Hủy bắt sự kiện khi component được unmount
    }
  }, [currentQuestion])

  return (
    <div className="questiondisplay__component">
      {data?.section_name && <div className="component__header">{data.section_name}</div>}
      <DisplayMarkup string={data?.section_prefer ?? ''} />
      {data?.section_audio && (
        <div className="component__listen">
          {/* <p>Nghe và trả lời câu hỏi</p> */}
          <div className="listen__audio">
            {' '}
            <AudioPlayer src={data.section_audio} isAutoPlay isHeaderAudio />
          </div>
        </div>
      )}

      {data?.section_video && (
        <div className="component__video">
          <Video src={data?.section_video} />
        </div>
      )}

      {data?.section_image && (
        <div className="component__image">
          <img src={data?.section_image} alt="listen__image" />
        </div>
      )}

      <div className="component__header">
        Câu hỏi {currentQuestion + 1}: {data?.name}
      </div>
      <div className="component__question">
        <DisplayMarkup string={data?.content ?? ''} />
        {data?.audio && (
          <div className="component__listen">
            <div className="listen__audio">
              {' '}
              <AudioPlayer src={data.audio} isAutoPlay isHeaderAudio />
            </div>
          </div>
        )}
        {data?.video && (
          <div className="component__video">
            <Video src={data?.video} />
          </div>
        )}
        {data?.image && (
          <div
            className="component__image"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              src={data.image}
              alt="listen__image"
              style={{
                width: 450,
                height: 250,
                objectFit: 'contain'
              }}
            />
          </div>
        )}
      </div>

      {/* =====answer arena====== */}
      {data?.type_article == 'fill_out' ? (
        <Input.TextArea
          id="inputAns"
          value={data?.fill_text}
          className="resize-none"
          onChange={(text: string) => answerQuestion(data?.answers[0].id, text)}
          placeholder="Điền câu trả lời vào đây"
          rows={3}
          maxLength={1000}
          autoFocus
          // disabled={feedBackResult !== null}
        />
      ) : (
        <div className="component__answer">
          <div
            className="container"
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              className="row"
              style={{
                display: 'flex',
                width: '100%'
              }}
            >
              {data?.answers.slice(0, 2).map((answer: any, index: number) => (
                <div
                  key={index}
                  className="col"
                  style={{
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <div
                    key={answer.id}
                    className="row-item-answers"
                    //  style={{ width: 550, marginBottom: 20 }}
                  >
                    <div className="component__answer__label">
                      <input
                        type={data.type === 'many_correct' ? 'checkbox' : 'radio'}
                        id={`quiz${answer.id}`}
                        className="form-check-input"
                        onChange={() => answerQuestion(answer.id)}
                        checked={
                          data.type === 'many_correct'
                            ? data?.answered?.includes(answer.id)
                            : data?.answered?.[0] === answer.id
                        }
                      />
                      <label htmlFor={`quiz${answer.id}`}>
                        {answer.text ? (
                          <>{getHeading(index) + (answer.text ? `. ${answer.text}` : '')}</>
                        ) : answer.misc ? (
                          <>
                            {/* {getHeading(index) + '.'}&nbsp;<DisplayMarkup string={answer?.misc} /> */}
                            {getHeading(index) + '.'}&nbsp;
                            {ReactHtmlParser(htmlSpecialLetter(answer?.misc || ''))}
                          </>
                        ) : (
                          ''
                        )}
                      </label>
                    </div>
                    {(answer?.audio || answer?.video || answer?.image) && (
                      <div className="component__answer__media">
                        {answer?.audio && (
                          <div className="component__answer__media-audio">
                            <AudioPlayer src={answer.audio} />
                          </div>
                        )}
                        {answer?.video && <Video src={answer?.video} />}
                        {answer?.image && (
                          <div
                            className="component__answer__media-image"
                            style={{
                              backgroundColor:
                                data.type === 'many_correct'
                                  ? ''
                                  : data?.answered?.[0] === answer.id
                                  ? 'rgb(5,188,138)'
                                  : ''
                            }}
                            onClick={() => answerQuestion(answer.id)}
                          >
                            <img src={answer.image} alt="listen__image" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="row"
              style={{
                display: 'flex',
                width: '100%'
              }}
            >
              {data?.answers.slice(2).map((answer: any, index: number) => (
                <div
                  key={index}
                  className="col"
                  style={{
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <div
                    key={answer.id}
                    // style={{ width: 550, marginBottom: 20 }}
                    className="row-item-answers"
                  >
                    <div className="component__answer__label">
                      <input
                        type={data.type === 'many_correct' ? 'checkbox' : 'radio'}
                        id={`quiz${answer.id}`}
                        className="form-check-input"
                        onChange={() => answerQuestion(answer.id)}
                        checked={
                          data.type === 'many_correct'
                            ? data?.answered?.includes(answer.id)
                            : data?.answered?.[0] === answer.id
                        }
                      />

                      <label htmlFor={`quiz${answer.id}`}>
                        {answer.text ? (
                          <>{getHeading(2 + index) + (answer.text ? `. ${answer.text}` : '')}</>
                        ) : answer.misc ? (
                          <>
                            {/* {getHeading(index) + '.'}&nbsp;<DisplayMarkup string={answer?.misc} /> */}
                            {getHeading(2 + index) + '.'}&nbsp;
                            {ReactHtmlParser(htmlSpecialLetter(answer?.misc || ''))}
                          </>
                        ) : (
                          ''
                        )}
                      </label>
                    </div>
                    {(answer?.audio || answer?.video || answer?.image) && (
                      <div className="component__answer__media">
                        {answer?.audio && (
                          <div className="component__answer__media-audio">
                            <AudioPlayer src={answer.audio} />
                          </div>
                        )}
                        {answer?.video && <Video src={answer?.video} />}
                        {answer?.image && (
                          <div
                            className="component__answer__media-image"
                            style={{
                              backgroundColor:
                                data.type === 'many_correct'
                                  ? ''
                                  : data?.answered?.[0] === answer.id
                                  ? 'rgb(5,188,138)'
                                  : ''
                            }}
                            onClick={() => answerQuestion(answer.id)}
                          >
                            <img src={answer.image} alt="listen__image" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* answer arena */}

      <div className="component__buttons">
        {currentQuestion > 0 && (
          <Button.Solid content="TRƯỚC" className="component__buttons-prev" onClick={prev} />
        )}
        <Button.Solid
          content={currentQuestion === questionLength - 1 ? 'NỘP BÀI' : 'TIẾP THEO'}
          onClick={next}
        />
      </div>
    </div>
  )
}

export default QuestionDisplay
