import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import { openError, randomBG } from '../../../../../utils/common'
import { LessionType } from '../../../../../store/study/types'
import { actionJoinLesson, actionSaveChildLesson } from '../../../../../store/study/actions'

type Props = { data: LessionType; currentIndex: number }

const LessionBox: FC<Props> = ({ data, currentIndex }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [isCollapse, setIsCollapse] = useState(true)

  const callLesson = async (id: number) => {
    const dataJoin: any = await dispatch(
      actionJoinLesson({
        unitId: id,
      })
    )
    if (!_.isEmpty(dataJoin) && dataJoin?.status === 200) {
      history.push(`/lession/${id}`)
    } else {
      openError('Tham gia bài học không thành công')
    }
  }

  return (
    <>
      <div
        className="detail__children__box"
        style={{ backgroundImage: `url(${randomBG()})` }}
        onClick={() => {
          dispatch(
            actionSaveChildLesson({
              index: currentIndex,
              data,
            })
          )
          if (_.isEmpty(data?.childs)) {
            callLesson(data?.id || 0)
          } else {
            setIsCollapse(!isCollapse)
          }
        }}
      >
        <div className="detail__title">
          <p className="text-center detail__title-text">{data?.name}</p>
          <p className="text-center detail__title-text">{data?.content}</p>
        </div>
      </div>
      <div
        className="section__collapsed"
        style={{
          height: isCollapse ? 0 : `${data?.childs?.length || 0 * 4}rem`,
          opacity: isCollapse ? 0 : 1,
          width: isCollapse ? 0 : '32rem',
        }}
      >
        {data?.childs?.map((item: any, index: number) => (
          <div
            className="child__item d-flex justify-content-between align-items-center"
            key={index}
          >
            <div className="child__item--stt">{index + 1}</div>
            <div className="flex-1 ps-3">
              <p className="mb-0 fw-bold">{item?.name}</p>
              <p className="mb-0 small">{item?.content}</p>
            </div>
            <div className="pe-3">{item?.score}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default LessionBox
