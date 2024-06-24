import _ from 'lodash'
import React, { FC, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RootState } from '../../../../../store'
import {
  actionGetChildsLesson,
  actionJoinLesson,
  actionSaveParentLessons,
} from '../../../../../store/study/actions'
import { LessionType } from '../../../../../store/study/types'
import { openError } from '../../../../../utils/common'

type Props = {
  lessionInfo: LessionType
  lessIndex: number
}

const ChildrenLessionBox: FC<Props> = ({ lessionInfo, lessIndex }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const currentCourse = useSelector((state: RootState) => state.study.currentCourse)

  const goToLesson = async (id: number) => {
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

  const checkChildLession = async () => {
    const dataDetail: any = await dispatch(actionGetChildsLesson(lessionInfo?.id))
    /**
     * ? Gọi children của lession (cha)
     * * Lưu dữ liệu parentLesson with childLessons
     * * Nếu có dữ liệu => return true / false
     */

    await dispatch(
      actionSaveParentLessons({
        index: lessIndex || 0,
        data: lessionInfo,
        childLessons: _.isEmpty(dataDetail) ? null : dataDetail,
      })
    )
    if (_.isEmpty(dataDetail)) return false
    return true
  }

  const onClickParentLess = async () => {
    /**
     * TODO [X] Check canAccess
     * TODO [X] Check prev lesson percent > 80% (isPercentLock)
     * TODO [X] Check lesson has child or not
     */
    if (lessionInfo?.canAccess) {
      if (!lessionInfo?.isPercentLock || currentCourse?.scope !== 'limit') {
        const isHaveChildLesson = await checkChildLession()
        if (!isHaveChildLesson) goToLesson(lessionInfo?.id)
      } else {
        openError('Bạn cần hoàn thành bài học trước đó.')
      }
    } else {
      openError('Hãy nâng cấp tài khoản VIP để mở khóa tất cả bài học bạn nhé!')
    }
  }

  const backgroundStyle = useMemo(() => {
    if (lessionInfo?.metas) {
      const imageObj: any = lessionInfo?.metas?.find((i: any) => i?.key === 'image')

      if (imageObj?.value) {
        return {
          backgroundImage: `url(${imageObj?.value || ''})`,
        }
      }
    }
    return undefined
  }, [lessionInfo?.metas])

  return (
    <>
      {/* active or not */}
      <div
        // className="children__box active"
        className="children__box"
        style={backgroundStyle}
        onClick={() => onClickParentLess()}
      >
        {/* <div className="star__container d-flex justify-content-center align-items-center">
          <img src={ico_star} alt="star_icon" />
          <p className="mb-0 mx-3">35/35</p>
        </div> */}
        <div className="start__lession">
          <p className="mb-0 mx-3">Vào học</p>
        </div>
      </div>
      <p className="children__box-name">{lessionInfo?.name}</p>
    </>
  )
}

export default ChildrenLessionBox
