import React, { FC } from 'react'
import Sound from 'react-sound'
import ico_speaker from '../../../assets/images/ico_speaker.svg'

type Props = {
  suggestText: any
  suggestAudioUrl: string
  quesionTitle: string
  isDisabled?: boolean
  setIsPlayAnsAudio: (play: boolean) => void
  isPlayAudio: boolean
}

const TextTitle: FC<Props> = ({
  suggestAudioUrl,
  suggestText,
  quesionTitle,
  isDisabled,
  setIsPlayAnsAudio,
  isPlayAudio,
}) => (
  <div className="d-flex flex-column align-items-center my-5">
    {/**
     * // ? SOUND AND AUDIO
     *  */}
    <Sound
      url={suggestAudioUrl}
      playStatus={isPlayAudio && suggestAudioUrl ? 'PLAYING' : 'STOPPED'}
      playFromPosition={0}
      onFinishedPlaying={() => setIsPlayAnsAudio(false)}
      autoLoad
      onError={() => {
        setIsPlayAnsAudio(false)
        console.log('there iss a a error')
      }}
    />
    <p className="question__text">{quesionTitle}</p>
    <div className="pronounce__result d-flex">
      <img
        src={ico_speaker}
        alt="sound"
        className={`cursor-pointer small_speaker ms-3 ${isPlayAudio ? 'playing' : ''}`}
        onClick={() => {
          if (suggestAudioUrl && !isDisabled) setIsPlayAnsAudio(true)
        }}
      />
      <p className="mb-0 flex-1">{suggestText}</p>
    </div>
  </div>
)

export default TextTitle
