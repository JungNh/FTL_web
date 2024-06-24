import React, { FC } from 'react'
import Bubble from '../Bubble'
import { ImageResourcesType } from '../types'

type Props = {
  backCourse: () => void
  startGame: () => void
  imageResources: ImageResourcesType
}

const GameWelcome: FC<Props> = ({ backCourse, startGame, imageResources }) => (
  <div className="w-100 container-game bg-welcome">
    <Bubble />
    <img src={imageResources?.game_name} className="game__background--welcome" alt="background" />

    <img
      width={80}
      src={imageResources?.btn_back}
      className="game-button back-button"
      alt="button-back"
      onClick={() => backCourse()}
    />
    <img
      width={200}
      src={imageResources?.logo}
      className="game-logo"
      alt="button-back"
      style={{ position: 'absolute', top: '1rem', right: '1rem' }}
    />
    <div className="w--100 start-button" onClick={startGame}>
      <p className="btn__play--text">PLAY NOW</p>
      <img src={imageResources?.btn} alt="start_button" className="game-button" />
    </div>
  </div>
)

export default GameWelcome
