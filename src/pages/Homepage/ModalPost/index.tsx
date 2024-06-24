import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Image } from 'react-bootstrap'
import _ from 'lodash'

// import './styles.scss'
import { RootState } from '../../../store'
import { IoClose } from 'react-icons/io5'
import ReactHtmlParser from 'react-html-parser'

type Props = {
  show: boolean
  handleClose: () => void
}

const NotifyPost: FC<Props> = ({ show, handleClose }) => {
  const { postsData } = useSelector((state: RootState) => state.home)
  return (
    <Modal size="xl" centered={true} show={show} onHide={handleClose}>
      <div className="p-3 relative">
        <h1 className="fw-bold">{postsData?.title_post || ''}</h1>
        <div>{ReactHtmlParser(postsData?.content_post)}</div>
      </div>
    </Modal>
  )
}

export default NotifyPost
