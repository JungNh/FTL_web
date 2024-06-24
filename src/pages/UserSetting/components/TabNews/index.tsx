import React, { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import { useDispatch } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import { Image, Col, Modal, Row } from 'react-bootstrap'
import { NewsItem } from '../../../../components'

import { actionGetNews } from '../../../../store/settings/actions'
import { convertUrl } from '../../../../utils/common'
import { itemPopupSlider } from '../../../../store/popup/actions'
import { useHistory } from 'react-router'

type Props = Record<string, unknown>

const TabNews: React.FC<Props> = () => {
  const [listNews, setListNews] = useState<any[]>([])
  const [currentView, setCurrentView] = useState<any>(null)
  const history = useHistory()
  const dispatch = useDispatch()

  const getListNews = useCallback(
    async ({ offset, limit }: { offset: number; limit: number }) => {
      const response: any = await dispatch(
        actionGetNews({
          offset,
          limit,
          order: 'ASC'
        })
      )
      if (response?.data) {
        setListNews(response?.data?.data)
      }
    },
    [dispatch]
  )

  useEffect(() => {
    getListNews({ offset: 0, limit: 10 })
  }, [getListNews])

  return (
    <div className="tab__news">
      <div className="tab__wrap">
        <Row>
          {listNews?.map((item: any, index: number) => (
            <Col xs={6} key={index} className="mb-3">
              <NewsItem
                data={item}
                onClick={() => {
                  dispatch(itemPopupSlider(item))
                  history.push('/posts')
                }}
              />
            </Col>
          ))}
        </Row>
      </div>

      {/* MODAL VIEW DETAIL NEWS */}
      <Modal size="xl" show={false} onHide={() => setCurrentView(null)}>
        <div className="p-3">
          <div className="d-flex justify-content-end mb-3">
            <small className="ms-auto">
              {currentView?.createdAt
                ? format(new Date(currentView?.createdAt), 'eeee, dd/MM/yyyy, HH:mm (z)', {
                    locale: viLocale
                  })
                : ''}
            </small>
          </div>
          <h1 className="fw-bold">{currentView?.title}</h1>
          {/* <Image width="100%" className="mb-3" src={convertUrl(currentView?.imageUrl, 'image')} /> */}

          <div className="html__container">{ReactHtmlParser(currentView?.content)}</div>
          <div className="d-flex justify-content-end mb-3">
            <h4 className="fw-bold fst-italic">{currentView?.createdUser?.email}</h4>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default TabNews
