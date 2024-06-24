import * as React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import './styles.scss'
import AudioPlayerArena, { RHAP_UI } from 'react-h5-audio-player'
import { convertUrl } from '../../../../utils/common'

type Props = {
  src: string
  isAutoPlay?: boolean
  isHeaderAudio?: boolean
}

const Pause = () => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 47.607 47.607"
  >
    <g>
      <path
        fill="#FFFFFF"
        d="M17.991,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631C4.729,2.969,7.698,0,11.36,0
l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"
      />
      <path
        fill="#FFFFFF"
        d="M42.877,40.976c0,3.662-2.969,6.631-6.631,6.631l0,0c-3.662,0-6.631-2.969-6.631-6.631V6.631
C29.616,2.969,32.585,0,36.246,0l0,0c3.662,0,6.631,2.969,6.631,6.631V40.976z"
      />
    </g>
  </svg>
)

const Play = () => (
  <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.8216 6.74839C15.2012 7.50868 15.2012 9.49132 13.8216 10.2516L3.46532 15.9591C2.13239 16.6936 0.499999 15.7294 0.499999 14.2074L0.5 2.79256C0.5 1.2706 2.13239 0.306353 3.46533 1.04095L13.8216 6.74839Z"
      fill="white"
    />
  </svg>
)

const formatTime = (seconds: number) => {
  if (seconds) {
    return [Math.floor(seconds / 60), Math.floor(seconds % 60)]
      .map((x) => x.toString())
      .map((x) => (x.length === 1 ? `0${x}` : x))
      .join(':')
  }
  return '00:00'
}

const AudioPlayer: FC<Props> = ({ src, isAutoPlay = false, isHeaderAudio = false }) => {
  const ref = React.useRef<any>()
  const [status, setStatus] = React.useState(true)
  const [duration, setDuration] = React.useState(0)
  const [progress, setProgress] = React.useState(0)
  const [autoPlay, setAutoPlay] = React.useState<boolean>(false)

  const audioPlayer = React.createRef<AudioPlayerArena>()

  const pauseAudio = () => {
    if (audioPlayer.current?.audio?.current) audioPlayer.current.audio.current.pause()
  }

  const onClickButton = () => {
    if (status) {
      ref?.current?.play()
      setStatus(false)
    } else {
      ref?.current?.pause()
      setStatus(true)
    }
  }

  React.useEffect(() => {
    if (ref.current) {
      ref.current?.pause()
      // ref.current.load()
      setStatus(true)
      setProgress(0)
      // ref.current.currentTime = 0
    }
    if (isAutoPlay) {
      setTimeout(() => {
        ref.current?.pause()
        ref.current?.load()
        setStatus(false)
        setProgress(0)
        // ref.current.currentTime = 0
        setAutoPlay(true)
      }, 2000)
    }
  }, [src])

  return (
    <>
      {isHeaderAudio ? (
        <div className="custome__audio_player-blue">
          <AudioPlayerArena
            ref={audioPlayer}
            autoPlay
            src={convertUrl(src || '', 'audio')}
            showJumpControls={false}
            customControlsSection={[]}
            customProgressBarSection={[
              RHAP_UI.MAIN_CONTROLS,
              RHAP_UI.PROGRESS_BAR,
              RHAP_UI.CURRENT_TIME
            ]}
            layout="stacked"
            style={{ boxShadow: 'none' }}
            className="audioPlayer_custom"
            onEnded={() => pauseAudio()}
          />
        </div>
      ) : (
        <div className="audioplayer__component">
          <div className="component__button" onClick={onClickButton}>
            {status ? <Play /> : <Pause />}
          </div>
          <div className="component__breaker" />
          <div className="component__progress">
            <div style={{ width: progress + '%' }} />
          </div>
          <p>{formatTime(duration)}</p>
          <audio
            autoPlay={autoPlay}
            id="auto-play-audio"
            controls
            ref={ref}
            onLoadedData={() => {
              setDuration(ref?.current?.duration)
            }}
            onTimeUpdate={() => {
              setProgress((ref?.current?.currentTime / ref?.current?.duration) * 100 || 0)
            }}
          >
            <source src={src} type="audio/mp3" />
          </audio>
        </div>
      )}
    </>
  )
}

export default AudioPlayer
