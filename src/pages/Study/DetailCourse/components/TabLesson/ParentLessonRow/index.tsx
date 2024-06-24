import React, { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import _ from 'lodash'
import { Accordion } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { BsFillCaretRightFill } from 'react-icons/bs'
import Button from '../../../../../../components/Button'
import ChildLessionRow from './ChildLessionRow'
import backArrow from '../../../../../../assets/images/ico_arrowLeft-blue.svg'
import { RootState } from '../../../../../../store'
import { actionGetSectionScore } from '../../../../../../store/study/actions'

type Props = {
  data: any
  goBack: () => void
}

const ParentLessonRow: FC<Props> = ({ data, goBack }) => {
  const [expandedRow, setExpandedRow] = useState<string | string[] | null | undefined>('')
  const [sectionScore, setSectionScore] = useState<any>([])
  const { currentChild, parentName, sectionName, sectionId } = useSelector((state: RootState) => ({
    currentChild: state.study.childLesson,
    parentName: state.study.parentLessons?.data?.name,
    sectionName: state.study.currentSection?.data?.name,
    sectionId: state.study.parentLessons?.data?.sectionId
  }))

  const location = useLocation()
  const dispatch = useDispatch()

  // * get course id
  const indexLoca: number = location.pathname.lastIndexOf('/')
  const idCourse: string = location.pathname.substring(indexLoca + 1, location.pathname.length)

  useEffect(() => {
    if (currentChild) {
      setExpandedRow(currentChild?.data?.id?.toString())
    }
  }, [])

  useEffect(() => {
    const getSectionScore = async () => {
      const dataRes = await dispatch(
        actionGetSectionScore({
          course_id: Number(idCourse),
          section_id: Number(sectionId)
        })
      )

      if (!_.isEmpty(dataRes)) {
        setSectionScore(dataRes)
      }
    }

    if (sectionId) getSectionScore()
  }, [dispatch, idCourse, sectionId])

  return (
    <div className="child_second_lession">
      {/* <Button.Shadow
        className="button__back"
        color="gray"
        onClick={() => goBack()}
        content={<img src={backArrow} alt="bageSection" />}
      /> */}
      <div className="d-flex align-items-center fw-bold flex-wrap">
        <h4 className="fw-bold">{sectionName}</h4>
        <BsFillCaretRightFill style={{ margin: '0 0.5rem 0.5rem 0.5rem', fontSize: '1.5rem' }} />
        <h4 className="fw-bold">{parentName}</h4>
      </div>
      <Accordion
        activeKey={expandedRow?.toString()}
        onSelect={(key: string | string[] | null | undefined) => {
          setExpandedRow(key)
        }}
      >
        {data?.map((item: any, index: number) => (
          <ChildLessionRow
            data={item}
            key={item?.id}
            unitScore={sectionScore?.[item?.id]}
            sectionScore={sectionScore}
            currentIndex={index}
          />
        ))}
      </Accordion>
    </div>
  )
}

export default ParentLessonRow
