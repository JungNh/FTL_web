import _ from 'lodash'
import React, { FC, useState } from 'react'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import { convertUrl } from '../../../../utils/common'
import ico_sound from '../../../../assets/images/ico_sound-white.svg'
import { Image } from 'react-bootstrap'
import Swal from 'sweetalert2'
import './styles.scss'

type Props = {
  metas: any
  notAudio?: boolean
}

const HandleMetas: FC<Props> = ({ metas, notAudio }) => {
  const [isListening, setIsListening] = useState(false)
  const listMetas: any = metas
  const objImage: any = listMetas.find((item: any) => item?.key === 'image')
  const objAudio: any = listMetas.find((item: any) => item?.key === 'audio')
  const audioPlayer = React.createRef<AudioPlayer>()

  // console.log('===METAS===', objImage, objAudio)

  const playAudio = () => {
    if (audioPlayer.current?.audio?.current) audioPlayer.current.audio.current.play()
  }

  const pauseAudio = () => {
    if (audioPlayer.current?.audio?.current) audioPlayer.current.audio.current.pause()
  }

  return (
    <div>
      {objImage?.value && (
        <Image
          src={objImage?.value}
          className="question__images"
          style={{ width: '40%', marginLeft: '30%', objectFit: 'contain', marginBottom: 30 }}
        />
      )}
      <div className="question__audios">
        {objAudio?.value && !notAudio && (
          <>
            <div className="image_speak_container">
              <Image
                className="image_speak"
                src={ico_sound}
                onClick={() => {
                  if (objAudio?.value) {
                    if (isListening) pauseAudio()
                    if (!isListening) playAudio()
                    setIsListening(!isListening)
                  }
                  if (!objAudio?.value) {
                    Swal.fire('Có lỗi xảy ra', 'Không tìm thấy audio?', 'error')
                  }
                }}
              />
            </div>
            <AudioPlayer
              ref={audioPlayer}
              autoPlay={objAudio?.value}
              src={convertUrl(objAudio?.value)}
              showJumpControls={false}
              customControlsSection={[
                <div key="blankDiv" className="w-100" />,
                RHAP_UI.CURRENT_TIME
              ]}
              customProgressBarSection={[RHAP_UI.PROGRESS_BAR]}
              layout="stacked-reverse"
              style={{ boxShadow: 'none' }}
              className="audioPlayer_custom mb-3"
              onEnded={() => {
                pauseAudio()
                setIsListening(false)
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default HandleMetas
