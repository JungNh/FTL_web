import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import backArrow from '../../../../../assets/images/ico_arrowLeft-blue.svg'
import { Button } from '../../../../../components'
import { RootState } from '../../../../../store'
import { actionSaveChildLesson, actionSaveParentLessons } from '../../../../../store/study/actions'
import LessionBox from './LessionBox'

type Props = {
  data: any
}

const DetailChildrenLession: FC<Props> = ({ data }) => {
  // const history = useHistory()
  const dispatch = useDispatch()

  const { parentLesson } = useSelector((state: RootState) => ({
    currentCourse: state.study.currentCourse,
    parentLesson: state.study.parentLessons,
  }))

  const goback = async () => {
    dispatch(
      actionSaveParentLessons({
        ...parentLesson,
        childLessons: undefined,
      })
    )
    dispatch(actionSaveChildLesson(null))
  }

  return (
    <div className="detail__children__lession">
      <div className="container">
        <Button.Shadow
          className="button__back"
          color="gray"
          onClick={() => goback()}
          content={<img src={backArrow} alt="bageSection" />}
        />
        <h2 className="fw-bold text-center py-5 text__title">Tên bài học: từ vựng</h2>

        <div className="d-flex flex-column align-items-center">
          {data?.childLessons?.map((less: any, index: number) => (
            <LessionBox key={less?.id} data={less} currentIndex={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default DetailChildrenLession
