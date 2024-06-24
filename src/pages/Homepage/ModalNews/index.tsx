import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { Modal, Image } from 'react-bootstrap'
import _ from 'lodash'
import viLocale from 'date-fns/locale/vi'
import ReactHtmlParser from 'react-html-parser'

import './styles.scss'
import { RootState } from '../../../store'
import { format } from 'date-fns'
import { convertUrl } from '../../../utils/common'

type Props = {
  show: boolean
  handleClose: () => void
}

const ModalNews: FC<Props> = ({ show, handleClose }) => {
  const { newsData } = useSelector((state: RootState) => state.home)
  return (
    <Modal size="xl" show={show} onHide={handleClose}>
      <div className="p-3">
        <div className="d-flex justify-content-end mb-3">
          <small className="ms-auto">
            {newsData?.createdAt
              ? format(new Date(newsData?.createdAt), 'eeee, dd/MM/yyyy, HH:mm (z)', {
                  locale: viLocale
                })
              : ''}
          </small>
        </div>
        <h1 className="fw-bold">{newsData?.title}</h1>
        {/* <Image width="100%" className="mb-3" src={convertUrl(newsData?.imageUrl, 'image')} />  */}
        <div className="html__container">{ReactHtmlParser(newsData?.content)}</div>
        <div className="d-flex justify-content-end mb-3">
          <h4 className="fw-bold fst-italic">{newsData?.createdUser?.email}</h4>
        </div>
      </div>
    </Modal>
  )
}

export default ModalNews
