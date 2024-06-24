import React, { FC } from 'react'
import Sound from 'react-sound'
import ico_speaker from '../../../assets/images/ico_speaker.svg'
import KImage from '../../KImage'

type Props = {
  imgQuesUrl: string
  ansText: string
  suggestAudioUrl: string
  isDisabled: boolean
  setIsPlayAnsAudio: (play: boolean) => void
  isPlayAudio: boolean
  setIsPlayQuesAudio?: any
}

const ImgTitle: FC<Props> = ({
  imgQuesUrl,
  ansText,
  suggestAudioUrl,
  isDisabled,
  setIsPlayAnsAudio,
  isPlayAudio,
  setIsPlayQuesAudio
}) => (
  <div style={{ paddingBottom: '16rem' }}>
    <Sound
      url={suggestAudioUrl}
      playStatus={isPlayAudio ? 'PLAYING' : 'STOPPED'}
      playFromPosition={0}
      onFinishedPlaying={() => setIsPlayAnsAudio(false)}
      onError={() => {
        setIsPlayAnsAudio(false)
      }}
    />
    <div className="question__image--container mb-4">
      <KImage className="question__image--image" src={imgQuesUrl || ''} />
    </div>
    <div className="answers">
      {suggestAudioUrl && (
        <img
          src={ico_speaker}
          alt="sound"
          className={`cursor-pointer small_speaker ms-3 ${isPlayAudio ? 'playing' : ''}`}
          onClick={() => {
            if (suggestAudioUrl && !isDisabled) {
              setIsPlayAnsAudio(true)
              setIsPlayQuesAudio()
            }
          }}
        />
      )}
      <p className="mb-0">{ansText}</p>
    </div>
  </div>
)

export default ImgTitle
