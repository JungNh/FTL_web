import React, { FC, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import ico_sound from '../../../assets/images/ico_sound-green.svg'
import { convertUrl } from '../../../utils/common'

type Props = {
  data: {
    id?: number
    key?: string
    questionId?: number
    value: DataVocal
  }
  openWord: () => void
}

type DataVocal = {
  audio?: string
  mean?: string
  partOfSpeech?: string
  tu_loai?: string
  spell?: string
  thumb?: string
  word?: string
}

const WordHolder: FC<Props> = ({ data, openWord }) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlay, setIsPlay] = useState(false)

  const handleLoadData = () => {
    if (isPlay && audioRef?.current?.src) audioRef?.current?.play()
  }

  const playSound = () => {
    if (audioRef?.current?.src) {
      if (isPlay && audioRef.current?.currentTime) {
        setIsPlay(false)
        audioRef.current.currentTime = 0
        audioRef?.current?.pause()
      } else {
        setIsPlay(true)
        audioRef?.current?.play()
      }
    } else {
      Swal.fire('Không có audio', 'error')
    }
  }

  return (
    <div className="card__word">
      <audio
        ref={audioRef}
        src={data?.value?.audio}
        onLoadedData={() => handleLoadData()}
        onEnded={(e: any) => {
          setIsPlay(false)
          e.target.currentTime = 0
        }}
      >
        <track kind="captions" />
      </audio>
      <img
        className="img__card cursor-pointer"
        src={convertUrl(data?.value?.thumb, 'image')}
        alt="icon"
        onClick={() => openWord()}
      />
      <div className="flex-1">
        <p className="title cursor-pointer" onClick={() => openWord()}>
          {data?.value?.word}
        </p>
        <p className="sub">{data?.value?.spell}</p>
        {data?.value?.partOfSpeech || data?.value?.tu_loai ? (
          <p className="sub">
            (
            {data?.value?.partOfSpeech || data?.value?.tu_loai}
            )
          </p>
        ) : (
          ''
        )}
        <p className="sub">{data?.value?.mean}</p>
      </div>
      <div>
        {isPlay && <div className="spinner-grow effect__sound " />}
        <img
          className="cursor-pointer "
          src={ico_sound}
          alt="ico_sound"
          onClick={() => playSound()}
        />
      </div>
    </div>
  )
}

export default WordHolder
