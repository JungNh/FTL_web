import * as React from 'react'
import type { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '../../components'
import backArrow from '../../assets/images/ico_arrowLeft-blue.svg'
import './styles.scss'

type Props = {
  background?: string
  to?: string
  isBack?: boolean
}

const ContainerWithBack: FC<Props> = ({ to, background = '#fff', children, isBack = true }) => {
  const history = useHistory()
  return (
    <div style={{ background }}>
      <div className="containerwithback__component">
        {isBack && (
          <Button.Shadow
            className="button__back"
            color="gray"
            onClick={() => (to ? history.push(to) : history.goBack())}
            content={<img src={backArrow} alt="bageSection" />}
          />
        )}
        {children}
      </div>
    </div>
  )
}

export default ContainerWithBack
