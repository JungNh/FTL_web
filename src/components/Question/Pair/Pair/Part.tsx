import React, { FC, useMemo } from 'react'
import ico_partLeft from '../../../../assets/images/ico_pairLeft.svg'
import ico_partLeft_active from '../../../../assets/images/ico_pairLeft-active.svg'
import ico_partLeft_correct from '../../../../assets/images/ico_pairLeft-correct.svg'
import ico_partLeft_wrong from '../../../../assets/images/ico_pairLeft-wrong.svg'
import ico_partRight from '../../../../assets/images/ico_pairRight.svg'
import ico_partRight_active from '../../../../assets/images/ico_pairRight-active.svg'
import ico_partRight_correct from '../../../../assets/images/ico_pairRight-correct.svg'
import ico_partRight_wrong from '../../../../assets/images/ico_pairRight-wrong.svg'

type Props = {
  text: string
  active: boolean
  isPair: boolean
  status: 'correct' | 'wrong' | 'normal'
  onClick: () => void
  side: 'left' | 'right'
}

const Part: FC<Props> = ({
  text, onClick, side, isPair, active, status,
}) => {
  const convertBackground = useMemo(() => {
    switch (`${side} - ${status} - ${active ? 'active' : ''}`) {
      case 'left - normal - ':
        return ico_partLeft
      case 'left - normal - active':
        return ico_partLeft_active
      case 'left - correct - ':
      case 'left - correct - active':
        return ico_partLeft_correct
      case 'left - wrong - ':
      case 'left - wrong - active':
        return ico_partLeft_wrong
      case 'right - normal - ':
        return ico_partRight
      case 'right - normal - active':
        return ico_partRight_active
      case 'right - correct - ':
      case 'right - correct - active':
        return ico_partRight_correct
      case 'right - wrong - ':
      case 'right - wrong - active':
        return ico_partRight_wrong
      default:
        return ''
    }
  }, [active, side, status])

  return (
    <div
      className={`part__item mb-3 ${side === 'left' && 'right'} ${
        active ? 'active' : ''
      } ${status}`}
      style={{
        backgroundImage: `url(${convertBackground})`,
        // transform: isPair ? 'translateX(-48px)' : '',
        // transition: 'all .3s ease'
        zIndex: side === 'left' ? 1 : 0,
      }}
      onClick={onClick}
    >
      <p className={`pair-text mb-0 ${active ? 'text-white' : ''}`}>{text}</p>
    </div>
  )
}

export default Part
