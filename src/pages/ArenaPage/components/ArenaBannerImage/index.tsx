import * as React from 'react'
import type { FC } from 'react'
import './styles.scss'

import BackgroundArena from '../../assets/images/background-arena.webp'

type Props = {
  data: Contest | null
}

const ArenaBannerImage: FC<Props> = ({ data }) => {
  return (
    <div className="arenabannerimage__component">
      <div className="content__banner">
        <img src={BackgroundArena} alt="background" className="content__banner-background" />
      </div>
    </div>
  )
}

export default ArenaBannerImage
