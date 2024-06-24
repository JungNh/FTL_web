import React, { FC, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import '../styles.scss'
import { actionGetHomeBlocks } from '../../../store/home/actions'
import { hideLoading, showLoading } from '../../../store/login/actions'
import BlockLanguage from '../BlockLanguage'
import { Spinner } from 'react-bootstrap'

type Props = {
  setCurrentKey: (data: string) => void
  changeData: (data: any) => void
  setListCourse: (data: any) => void
  setCategoryCourse: (data: any) => void
  setVisibleCategory: (data: boolean) => void
}

const initDataHomeBlock = {
  'en-UK': [],
  'zh-CN': [],
  'ja-JP': [],
  'ko-KR': []
}

const ListCourse: FC<Props> = ({
  setCurrentKey,
  changeData,
  setListCourse,
  setCategoryCourse,
  setVisibleCategory
}) => {
  const dispatch = useDispatch()
  const [dataHomeBlock, setDataHomeBlock] = useState<any>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const getCategory = async () => {
      setIsLoading(true)
      const dataList: any = await dispatch(actionGetHomeBlocks())
      if (!_.isEmpty(dataList)) {
        setDataHomeBlock(dataList)
        console.log('dataList', dataList)
        setIsLoading(false)
      } else {
        setDataHomeBlock({})
        setIsLoading(false)
      }
      setIsLoading(false)
    }
    getCategory()
  }, [dispatch])

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 100
        }}
      >
        <Spinner animation="grow" />
        <Spinner animation="grow" style={{ marginLeft: 5, marginRight: 5 }} />
        <Spinner animation="grow" />
      </div>
    )
  }
  return (
    <div className="list__course">
      <div className="list__first"></div>
      {Object.keys(dataHomeBlock).map((key, index) => (
        <BlockLanguage
          data={dataHomeBlock[`${key}`]}
          key={index}
          language={key}
          setCurrentKey={setCurrentKey}
          changeData={changeData}
          setCategoryCourse={setCategoryCourse}
          setVisibleCategory={setVisibleCategory}
        />
      ))}
    </div>
  )
}

export default ListCourse
