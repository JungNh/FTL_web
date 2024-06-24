import React, { FC, useEffect, useState } from 'react'
import TweenOne from 'rc-tween-one'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

type Props = Record<string, unknown>

const Loading: FC<Props> = () => {
  const [display, setDisplay] = useState('initial')
  const [opacity, setOpacity] = useState(0)
  const loading = useSelector((pageState: RootState) => pageState.login?.loading)

  useEffect(() => {
    let timeOut: ReturnType<typeof setTimeout> | null = null
    if (loading) {
      setDisplay('initial')
      timeOut = setTimeout(() => setOpacity(1), 10)
    } else {
      setOpacity(0)
      timeOut = setTimeout(() => setDisplay('none'), 500)
    }
    return () => {
      setDisplay('initial')
      if (timeOut !== null) {
        clearTimeout(timeOut)
      }
    }
  }, [loading])
  const animation = [
    {
      scale: 1.2,
      rotate: '-5deg',
      opacity: 1,
    },
    { rotate: '5deg' },
    {
      scale: 1,
      rotate: '0deg',
      opacity: 0.5,
    },
  ]

  return (
    <div
      className="loading__panel"
      style={{
        opacity,
        transition: '0.5s all ease',
        display,
      }}
    >
      <div className="animation__wrapper">
        <TweenOne
          animation={animation}
          className="loading__image"
          repeat={-1}
          yoyo
          style={{
            position: 'absolute',
            opacity: 0.5,
          }}
        />
      </div>
    </div>
  )
}

export default Loading
