import _ from 'lodash'
import React, {
  FC, useCallback, useEffect, useState,
} from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { HiOutlineDesktopComputer } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { actionGetGradeOffline } from '../../../../../../store/roomOffline/actions'

type Props = {
  setCurrent: (data: any) => void
}

const ListExam: FC<Props> = ({ setCurrent }) => {
  const [grade, setGrade] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const getGrades = useCallback(async () => {
    setLoading(true)
    const response: any = await dispatch(
      actionGetGradeOffline({
        offset: 0,
        limit: 1000,
        order: 'ASC',
      })
    )
    if (response?.data) {
      setGrade(response.data )
    }
    setLoading(false)
  }, [dispatch])

  useEffect(() => {
    getGrades()
  }, [getGrades])

  return (
    <div className="list__exam">
      {grade?.map((item: any) => (
        <div className="list__exam--item" key={item?.id} onClick={() => setCurrent(item?.id)}>
          <p className="list__exam--title">{item?.name}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="list__exam--count">
              <HiOutlineDesktopComputer className="me-3" />
              <p className="mb-0">
                {item?.contestCount || 0}
                {' '}
                đề
              </p>
            </div>
            <BsChevronRight className="list__exam--icon" />
          </div>
        </div>
      ))}
      {loading && (
        <div className="list__exam--loading">
          <p className="loading_text">Đang tải</p>
          <div className="dot_wrap">
            <p className="dot_animation mb-0">...</p>
          </div>
        </div>
      )}
      {!loading && _.isEmpty(grade) && (
        <div className="list__exam--loading">
          <p className="loading_text">Không có dữ liệu</p>
        </div>
      )}
    </div>
  )
}

export default ListExam
