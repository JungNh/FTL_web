import React, { FC, useEffect, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { Image } from 'react-bootstrap'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { htmlSpecialLetter, convertUrl } from '../../../../../utils/common'
import { QuestionType } from '../QuesType/types'

type Props = {
  question: QuestionType
}

const SubTitleQues: FC<Props> = ({ question }) => {
  const audioPlayer = React.createRef<AudioPlayer>()
  const [richText, setRichText] = useState<string | null>(null)
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [readingId, setReadingId] = useState<number | null>(null)
  const [listeningId, setListeningId] = useState<number | null>(null)

  useEffect(() => {
    if (question?.readingId || question?.readingId !== readingId) {
      setRichText(question?.richText || null)
      setReadingId(question?.readingId || null)
    }
    if (question?.listeningId || question?.listeningId !== listeningId) {
      setAudioUrl(question?.audioUrl || null)
      setListeningId(question?.listeningId || null)
    }
    if (question?.type === 'multiple_choice') {
      setImgUrl(question?.imageUrl || null)
      setAudioUrl(question?.audioUrl || null)
    }
    return () => {
      if (question?.readingId === null) {
        setReadingId(null)
        setRichText(null)
      }
      if (question?.listeningId === null) {
        setReadingId(null)
        setRichText(null)
      }
    }
  }, [listeningId, question, readingId])

  const pauseAudio = () => {
    if (audioPlayer.current?.audio?.current) audioPlayer.current.audio.current.pause()
  }

  return (
    <div>
      {(richText || audioUrl) && (
        <div>
          <p>{question?.questionTitle}</p>
        </div>
      )}

      {richText && (
        <div className="divider__horizontal my-3">
          {ReactHtmlParser(htmlSpecialLetter(richText || ''))}
        </div>
      )}
      {imgUrl && (
        <div className="my-3">
          <Image className="quiz__image__question" src={convertUrl(imgUrl, 'image') || ''} />
        </div>
      )}
      {audioUrl && (
        <div className="custome__audio_player-blue">
          <AudioPlayer
            ref={audioPlayer}
            autoPlay
            src={convertUrl(audioUrl || '', 'audio')}
            showJumpControls={false}
            customControlsSection={[]}
            customProgressBarSection={[
              RHAP_UI.MAIN_CONTROLS,
              RHAP_UI.PROGRESS_BAR,
              RHAP_UI.CURRENT_TIME,
            ]}
            layout="stacked"
            style={{ boxShadow: 'none' }}
            className="audioPlayer_custom"
            onEnded={() => pauseAudio()}
          />
        </div>
      )}
    </div>
  )
}

export default SubTitleQues
