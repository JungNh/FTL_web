import React, { FC } from 'react'
import { ImageResourcesType } from '../types'

type Props = {
  onStartPlay: () => void
  backCourse: () => void
  imageResources: ImageResourcesType
}

const GameWelcome: FC<Props> = ({ imageResources, onStartPlay, backCourse }) => (
  <div className="w-100 container-game">
    <img
      width={80}
      src={imageResources?.btn_back}
      className="game-button back-button user-drag--none"
      alt="button-back"
      onClick={() => backCourse()}
    />
    <img
      width={200}
      src={imageResources?.logo}
      className="game-logo user-drag--none"
      alt="button-back"
    />
    <div
      className="w--100 start-button-pokemon animation-start game-button cursor-pointer"
      onClick={onStartPlay}
    >
      <p className="btn__play--text ">PLAY NOW</p>
      <img width={250} src={imageResources?.btn} alt="button-play" className="user-drag--none" />
    </div>
    <div className="game-fubomon-logo">
      <img src={imageResources?.game_name} alt="logo" className="animation-logo user-drag--none" />
    </div>
    <div className="game-fubomon-pokeball">
      {[...new Array(9).keys()].map((item: any, index: number) => (
        <img
          key={index}
          width={100}
          src={imageResources?.ico_pokeball}
          alt="pokeball"
          className={`game-ball game-ball-${index + 1} user-drag--none`}
        />
      ))}
    </div>
  </div>
)

export default GameWelcome
