import React, { useState } from 'react'
import { Image } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import Button from '../../Button'
import ico_speaker from '../../../assets/images/ico_speaker.svg'
import ico_record from '../../../assets/images/ico_record-white.svg'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import NavbarTest from '../../NavbarTest'
import ico_headphone from '../../../assets/images/ico_headphone.svg'

type Props = {
  lession?: {
    topic?: string
    imageSrc?: string
    imageName?: string
    correctAns?: string
    latinText?: string
    hint?: string
  }
  onNextLession: (results?: boolean) => void
  currentTestIndex?: number
  totalTest?: number
}

const SpeakAIWithBlank: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
}) => {
  const [isRecording] = useState<number[]>([])
  // const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const onCheck = () => {
    Swal.fire({
      title: 'Chính xác',
      text: `Đáp án là "${lession?.correctAns}"`,
      icon: 'success',
      confirmButtonText: 'Bài tiếp theo',
    })
      .then(() => onNextLession(true))
      .catch((error) => console.error(error))
  }
  const onHint = () => {
    Swal.fire({
      title: 'Gợi ý',
      text: 'Bạn có chắc chắn muốn xem gợi ý',
      confirmButtonText: 'Tôi muốn xem',
      showCancelButton: true,
      cancelButtonText: 'Không, tôi có thể làm được',
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          Swal.fire('Gợi ý !', lession?.hint, 'info')
        }
        return ''
      })
      .catch((error) => console.error(error))
  }
  const onSkip = () => {
    Swal.fire({
      title: 'Bạn muốn bỏ qua bài tập này',
      text: 'Bài tập này sẽ không được tính điểm',
      confirmButtonText: 'Bỏ qua',
      showCancelButton: true,
      cancelButtonText: 'Ở lại',
      icon: 'warning',
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          onNextLession(false)
        }
        return ''
      })
      .catch((error) => console.error(error))
  }

  return (
    <div className="lession__speakAIWithBlank pb-5">
      {/* <p className="subTitle__lession">What is it?</p>
      <p className="title__lession mb-5">{`Chủ đề ${lession?.topic}`}</p> */}
      <div className="d-flex align-items-center justify-content-center mb-5">
        <img src={ico_speaker} alt="sound" className="cursor-pointer" />
        &nbsp;
        <h1 className="mb-0 ms-2 fw-bold">How are you feeling to day?</h1>
      </div>
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
      />

      <div className="d-flex flex-column align-items-center">
        <p className="suggestion">Đọc cả câu trả lời với các từ gợi ý sau</p>
        <div className="pronounce__result mb-3">
          <img src={ico_speaker} alt="sound" className="cursor-pointer small_speaker" />
          <p className="mb-0">I feel very good</p>
        </div>
        <div className="pronounce__result">
          <p className="mb-0">I feel very good</p>
        </div>
      </div>

      <div className="main__question d-flex align-items-center justify-content-center my-5">
        <CircularProgressbar
          className="circlePercent"
          value={66}
          text="66%"
          styles={buildStyles({
            textColor: 'black',
            pathColor: '#04BC8A',
          })}
        />
        <div className="main__image--container mx-5">
          {isRecording && <div className="spinner-grow effect__sound" role="status" />}
          <Image className="" src={ico_record} onClick={() => {}} />
        </div>
        <div>
          <img src={ico_headphone} alt="icon" />
        </div>
      </div>

      <NavbarTest
        currentTest={(currentTestIndex || 0) + 1}
        totalTest={totalTest}
        onCheck={onCheck}
        onHint={onHint}
        onSkip={onSkip}
      />
    </div>
  )
}

export default SpeakAIWithBlank
