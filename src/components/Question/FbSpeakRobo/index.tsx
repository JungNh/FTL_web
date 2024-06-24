import React, { FC, useMemo } from 'react'
import fubo_blink from '../../../assets/images/fubo_blink.png'
import fubo_cry from '../../../assets/images/fubo_cry.png'
import fubo_love from '../../../assets/images/fubo_love.png'
import fubo_sing from '../../../assets/images/fubo_sing.png'
import fubo_wow from '../../../assets/images/fubo_wow.png'
import fubo_error from '../../../assets/images/fubo_error.png'
import ico_record from '../../../assets/images/ico_record-white.svg'

type Props = {
  percent: number | null
  isListening: boolean
  isConverting: boolean
  isError: boolean
}

type StatusType = 'before-talk' | 'talking' | 'converting' | 'error' | 'show-result'

const FbSpeakRobo: FC<Props> = ({ percent, isListening, isConverting, isError }) => {
  const status: StatusType = useMemo(() => {
    if (isListening) return 'talking'
    if (isConverting) return 'converting'
    if (isError) return 'error'
    if (percent !== null) return 'show-result'
    return 'before-talk'
  }, [isConverting, isError, isListening, percent])

  return (
    <div className="feed__back__robo">
      {status === 'before-talk' && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_blink} alt="robo" className="fubo__image" />
          <div className="d-flex align-items-center">
            Bạn bấm vào icon
            <span className="record_wrapper mx-2">
              <img src={ico_record} alt="ico_record" className="icon_record" />
            </span>
            và bắt đầu nói nhé
          </div>
        </div>
      )}
      {status === 'talking' && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_blink} alt="robo" className="fubo__image" />
          <div className="d-flex align-items-center">
            Mình đang nghe
            <span className="dot_animate--wrapper">
              <span className="dot_animate">...</span>
            </span>
          </div>
        </div>
      )}
      {status === 'converting' && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_blink} alt="robo" className="fubo__image" />
          <div className="d-flex align-items-center">
            Đang phân tích kết quả
            <span className="dot_animate--wrapper">
              <span className="dot_animate">...</span>
            </span>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_error} alt="robo" className="fubo__image" />
          <div>Tôi không nghe rõ bạn nói. Vui lòng thử lại?</div>
        </div>
      )}
      {status === 'show-result' && percent !== null && percent < 30 && percent >= 0 && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_cry} alt="robo" className="fubo__image" />
          <div>
            <p className="mb-0 fw-bold" style={{ color: '#F22845' }}>
              Chưa đúng rồi
            </p>
            <p className="mb-0 small">Hãy thử lại nhé !</p>
          </div>
        </div>
      )}
      {status === 'show-result' && percent !== null && percent < 50 && percent >= 30 && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_sing} alt="robo" className="fubo__image" />
          <div>
            <p className="mb-0 fw-bold" style={{ color: '#FF9900' }}>
              Gần đúng rồi, cố lên nào !
            </p>
            <p className="mb-0 small">
              Bạn phát âm giống <b>{percent}%</b> so với người bản ngữ
            </p>
          </div>
        </div>
      )}
      {status === 'show-result' && percent !== null && percent < 75 && percent >= 50 && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_blink} alt="robo" className="fubo__image" />
          <div>
            <p className="mb-0 fw-bold" style={{ color: '#86C256' }}>
              Tốt đấy, cố lên nào !
            </p>
            <p className="mb-0 small">
              Bạn phát âm giống <b>{percent}%</b> so với người bản ngữ
            </p>
          </div>
        </div>
      )}
      {status === 'show-result' && percent !== null && percent < 95 && percent >= 75 && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_wow} alt="robo" className="fubo__image" />
          <div>
            <p className="mb-0 fw-bold" style={{ color: '#04BC8A' }}>
              Người bản xứ đây rồi !
            </p>
            <p className="mb-0 small">
              Bạn phát âm giống <b>{percent}%</b> so với người bản ngữ
            </p>
          </div>
        </div>
      )}
      {status === 'show-result' && percent !== null && percent <= 100 && percent >= 95 && (
        <div className="d-flex justify-content-center align-items-center">
          <img src={fubo_love} alt="robo" className="fubo__image" />
          <div>
            <p className="mb-0 fw-bold" style={{ color: '#04BC8A' }}>
              Quá tuyệt vời !
            </p>
            <p className="mb-0 small">Chuẩn như người bản xứ !</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FbSpeakRobo
