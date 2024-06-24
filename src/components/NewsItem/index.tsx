import React, { FC } from 'react'
import { Image } from 'react-bootstrap'
import { format } from 'date-fns'
import { convertUrl } from '../../utils/common'

type Props = {
  data: {
    id: number
    description: string
    title?: string
    imageUrl?: string
    content: string
    createdAt: string // date string
    createdBy: number
    createdUser?: {
      id: number
      email: string
      createdAt: string
      password: string
      role: string
      socialId: number | null
      type: string
      updatedAt: string
    }
    sequenceNo: number
    slug: string
    status: string
    updateTime: string | null
    updatedAt: string | null
  }
  onClick: () => void
}

const NewsItem: FC<Props> = ({ data, onClick }) => (
  <div className="news__item" onClick={onClick}>
    <div className="news__images">
      <Image draggable={false} src={convertUrl(data?.imageUrl || '', 'image')} />
    </div>
    <div className="news__text">
      <div className="d-flex justify-content-between align-items-center">
        <p className="mb-0 news__time">
          {data?.createdAt ? format(new Date(data?.createdAt), 'dd/MM/yyyy') : ''}
        </p>
        <p className="mb-0 news__category">{data?.description}</p>
      </div>
      <div>
        <p className="news__title">{data.title}</p>
      </div>
    </div>
  </div>
)

export default NewsItem
