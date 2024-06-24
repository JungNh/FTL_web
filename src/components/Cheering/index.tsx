import React, { FC, useEffect, useRef } from 'react'
import cheering from '../../assets/images/cheering.gif'
import cheering1 from '../../assets/images/cheering1.gif'
import cheering2 from '../../assets/images/cheering2.gif'
import cheering_text from '../../assets/images/cheering_text.png'
import bg_cheering from '../../assets/images/bg_cheering.webp'
import fubo_unhappy from '../../assets/images/fubo_unhappy.gif'
import fubo_unhappy1 from '../../assets/images/fubo_unhappy1.gif'
import fubo_unhappy2 from '../../assets/images/fubo_unhappy2.gif'
import Button from '../Button'
import { type } from 'os'
import { useDispatch, useSelector } from 'react-redux'
import { actionShowCheer } from '../../store/lesson/actions'
import { Image } from 'react-bootstrap'
import { RootState } from '../../store'
import audio31 from '../../assets/cheer/31.mp3'
import audio32 from '../../assets/cheer/32.mp3'
import audio33 from '../../assets/cheer/33.mp3'
import audio34 from '../../assets/cheer/34.mp3'
import audio35 from '../../assets/cheer/35.mp3'
import audio36 from '../../assets/cheer/36.mp3'
import audio37 from '../../assets/cheer/37.mp3'
import audio38 from '../../assets/cheer/38.mp3'
import audio51 from '../../assets/cheer/51.mp3'
import audio52 from '../../assets/cheer/52.mp3'
import audio53 from '../../assets/cheer/53.mp3'
import audio54 from '../../assets/cheer/54.mp3'
import audio55 from '../../assets/cheer/55.mp3'
import audio56 from '../../assets/cheer/56.mp3'
import audio57 from '../../assets/cheer/57.mp3'
import audio58 from '../../assets/cheer/58.mp3'
import audio59 from '../../assets/cheer/59.mp3'
import audio101 from '../../assets/cheer/101.mp3'
import audio102 from '../../assets/cheer/102.mp3'
import audio103 from '../../assets/cheer/103.mp3'
import audio104 from '../../assets/cheer/104.mp3'
import audio105 from '../../assets/cheer/105.mp3'
import audio106 from '../../assets/cheer/106.mp3'

type Props = {
  showBtn?: boolean
  showSum?: any
}

type cheerText = {
  id: number
  text: string
  audio: string
}

const cheerArr = [
  { id: 1, img: cheering },
  { id: 2, img: cheering1 },
  { id: 3, img: cheering2 }
]

const unHappyArr = [
  { id: 1, img: fubo_unhappy },
  { id: 2, img: fubo_unhappy1 },
  { id: 3, img: fubo_unhappy2 }
]

const arr5correct = [
  { id: 1, text: 'Great!\n Such an excellent job!', audio: audio51 },
  { id: 2, text: 'Fantastic!\n Five correct answers in a row!', audio: audio52 },
  { id: 3, text: "Wow, 5 correct answers in a row!\n That's amazing!", audio: audio53 },
  { id: 4, text: 'Fabulous!\n You have 5 correct answers in a row !', audio: audio54 },
  { id: 5, text: "You're definitely a master of the knowledge!", audio: audio55 },
  { id: 6, text: "Let's break the next 10 correct answers record!", audio: audio56 },
  { id: 7, text: 'Fantastic!\n Keep going to beat the next ones!', audio: audio57 },
  { id: 8, text: 'Excellent effort, keep it up!', audio: audio58 },
  { id: 9, text: 'Five correct answers in a row!\n So nice!!!', audio: audio59 }
]

const arr10correct = [
  { id: 1, text: 'Wonderful, 10 correct answers in a row.\n Keep it up!', audio: audio101 },
  { id: 2, text: "10 sentences in a row,\n you're gifted in English!", audio: audio102 },
  { id: 3, text: "Let's keep going with this!", audio: audio103 },
  { id: 4, text: "Wow, that's incredible!\n I'm full of joy about your great", audio: audio104 },
  { id: 5, text: "You're doing great!\n Let us cheer!!", audio: audio105 },
  {
    id: 6,
    text: "Extremely good!\n That's a total of ten correct answers in a row!",
    audio: audio106
  }
]

const arr3wrong = [
  { id: 1, text: 'Are you doing too quickly?\n Let us calm down and continue!', audio: audio31 },
  { id: 2, text: "It's all right,\n you can do it! Let's go ahead!", audio: audio32 },
  { id: 3, text: "It's almost okay,\n Let's give it your all!", audio: audio33 },
  { id: 4, text: 'Things are challenging before it gets easy.', audio: audio34 },
  { id: 5, text: "Don't be upset!\n Practice makes perfect!", audio: audio35 },
  { id: 6, text: "Let's keep going!\n Failure is the mother of success.", audio: audio36 },
  { id: 7, text: 'Your mistakes are teaching you a lot.\n Come on, kids!', audio: audio37 },
  { id: 8, text: "Don't give up,\n just keep trying!", audio: audio38 }
]

const random = (length: number) => {
  const numberRandom = Math.random()
  const numText = Math.round(numberRandom * length)
  return numText
}
const num5Cheer = random(arr5correct.length - 1)
const num10Cheer = random(arr10correct.length - 1)
const numWrong = random(arr10correct.length - 1)
const imgFubo = random(2)

const NewlineText = (props: any) => {
  const text = props.text
  return text.split('\n').map((str: any) => (
    <div style={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Quicksand', fontSize: 20 }}>
      {str}
      <br />
    </div>
  ))
}

const Cheering: FC<Props> = ({ showBtn, showSum }) => {
  console.log('BTN_SHOW', showBtn)
  const audioRef = useRef<HTMLAudioElement>(null)
  const dispatch = useDispatch()
  const numberCorrect = useSelector((state: RootState) => state.lesson.numberCorrect)
  const cheerChoiced: cheerText =
    numberCorrect > 0
      ? numberCorrect >= 10
        ? arr10correct[num10Cheer]
        : arr5correct[num5Cheer]
      : arr3wrong[numWrong]

  useEffect(() => {
    audioRef?.current?.play()
  }, [])
  return (
    <div className="bg_cheer">
      <Image className="cheering_background" src={bg_cheering} />
      <div className="bg_cheer_text">
        <img src={cheering_text} className="cheering_text_img" />
        <div className="container_text">
          <div>
            <NewlineText text={cheerChoiced.text} />
          </div>
        </div>
      </div>
      <img
        src={numberCorrect > 0 ? cheerArr[imgFubo].img : unHappyArr[imgFubo].img}
        className="img_fubo"
      />
      <Button.Solid
        className={`btn_cheer ${showBtn ? 'padding_btn' : ''}`}
        onClick={() => {
          dispatch(actionShowCheer(false))
          if (showSum) showSum()
        }}
        content={
          <div className="flex justify-content-center align-items-center fw-bold">TIẾP TỤC</div>
        }
      />
      <audio ref={audioRef} src={cheerChoiced.audio}></audio>
    </div>
  )
}

export default Cheering
