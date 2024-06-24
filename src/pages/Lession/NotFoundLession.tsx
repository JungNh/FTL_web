import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import backArrow from '../../assets/images/ico_arrowLeft-blue.svg'
import notFound from '../../assets/images/notFoundBG.svg'
import { Button } from '../../components'

type Props = {
  goBack: () => void
}

const NotFoundLession: FC<Props> = ({ goBack }) => (
  <div className="not__found__lession">
    <Button.Shadow
      className="button__back"
      color="gray"
      content={<img src={backArrow} alt="back" />}
      onClick={() => goBack()}
    />
    <Image src={notFound} />
    <h1>Không tìm thấy bài học</h1>
  </div>
)

export default NotFoundLession
