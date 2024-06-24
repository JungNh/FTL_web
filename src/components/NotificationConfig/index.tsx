import React, { FC, useCallback, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import { Modal, Image } from 'react-bootstrap'
import { format } from 'date-fns'
import ReactHtmlParser from 'react-html-parser'
import viLocale from 'date-fns/locale/vi'
import { actionGetOneNotification } from '../../store/settings/actions'
import { actionCourseWithId } from '../../store/home/actions'
import {
  actionGetChildsLesson,
  actionGetOneLesson,
  actionSaveChildLesson,
  actionSaveCurrentCourse,
  actionSaveParentLessons
} from '../../store/study/actions'
import { convertUrl, openError } from '../../utils/common'

type Props = {}

const NotificationConfig: FC<Props> = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [newsDetail, setNewsDetail] = useState<any>(null)
  const history = useHistory()

  const changePageToCourse = useCallback(
    async (courseId: number, lessionId: number) => {
      const [courseResult, lessonDetail, lessonChilds]: any = await Promise.all([
        dispatch(actionCourseWithId(courseId)),
        lessionId && dispatch(actionGetOneLesson(lessionId)),
        lessionId && dispatch(actionGetChildsLesson(lessionId))
      ])
      console.log('actionSaveCurrentCourse', courseResult)
      if (!_.isEmpty(courseResult)) {
        if (courseResult?.id) {
          dispatch(actionSaveCurrentCourse(courseResult))
          dispatch(actionSaveChildLesson(null))
          if (!_.isEmpty(lessonDetail)) {
            await dispatch(
              actionSaveParentLessons({
                index: 0,
                data: lessonDetail,
                childLessons: _.isEmpty(lessonChilds) ? null : lessonChilds
              })
            )
          }
        }
        history.push(`/study/${courseResult?.id}`)
      }
    },
    [dispatch, history]
  )

  const getNotifications = useCallback(
    async (notiInfo: any) => {
      const token = localStorage.getItem('token')
      if (token) {
        const response: any = await dispatch(
          actionGetOneNotification({ notiId: Number(notiInfo?.notificationId) })
        )
        if (response?.status === 200 && response?.data) {
          const courseId = Number(response?.data?.extra1)
          const lessionId = Number(response?.data?.extra2)

          switch (response?.data?.filterType) {
            case 'all':
            case 'by_age':
            case 'by_under_expire':
            case 'by_not_expire':
            case 'by_expired':
            case 'by_telephone':
            case 'auto_birthday':
            case 'auto_under_expire':
            case 'auto_expired':
            case 'auto_daily':
              setNewsDetail(response?.data)
              break
            case 'auto_not_doing_course':
            case 'by_course':
              changePageToCourse(courseId, lessionId)
              break
            default:
              break
          }
        }
      }
    },
    [changePageToCourse, dispatch]
  )

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    if (params?.notiId !== undefined) {
      getNotifications(params?.notiId)
    }
  }, [getNotifications, location.search])

  return (
    <div className="notification">
      <Modal size="lg" show={newsDetail !== null} centered onHide={() => setNewsDetail(null)}>
        <div className="p-3">
          <div className="d-flex justify-content-end mb-3">
            <small className="ms-auto">
              {newsDetail?.createdAt
                ? format(new Date(newsDetail?.createdAt), 'eeee, dd/MM/yyyy, HH:mm (z)', {
                    locale: viLocale
                  })
                : ''}
            </small>
          </div>
          <h1 className="fw-bold">{newsDetail?.title}</h1>
          {newsDetail?.imageUrl && (
            <Image
              width="100%"
              style={{ maxHeight: 500, objectFit: 'contain' }}
              className="mb-3"
              src={convertUrl(newsDetail?.imageUrl, 'image')}
            />
          )}
          <div className="html__container">{ReactHtmlParser(newsDetail?.content)}</div>
          <div className="d-flex justify-content-end mb-3">
            <h4 className="fw-bold fst-italic">{newsDetail?.createdUser?.email}</h4>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default NotificationConfig
