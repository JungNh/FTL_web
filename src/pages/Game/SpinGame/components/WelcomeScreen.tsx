import React, { FC } from 'react'
import { ImageResourcesType } from '../types'

type Props = {
  backCourse: () => void
  onStartGame: () => void
  imageResources: ImageResourcesType
}

const WelcomeScreen: FC<Props> = ({ backCourse, onStartGame, imageResources }) => (
  <div>
    <div className="w-100 container-game">
      <img
        width={900}
        src={imageResources?.game_name}
        alt="logo"
        className="game-background-logo user-drag--none"
      />
      <img
        width={200}
        src={imageResources?.logo}
        className="game-logo user-drag--none"
        alt="button-back"
      />
      <img
        width={80}
        src={imageResources?.btn_back}
        className="game-button back-button user-drag--none"
        alt="button-back"
        onClick={backCourse}
      />
      <div className="w--100 start-button" onClick={onStartGame}>
        <p className="btn__play--text">PLAY NOW</p>
        <img
          width={250}
          src={imageResources?.btn}
          alt="button-back"
          className="game-button user-drag--none"
        />
      </div>
    </div>
  </div>
)

export default WelcomeScreen
