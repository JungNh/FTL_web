import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import '../../Homepage/styles.scss'
import { useHistory, useLocation } from 'react-router'
import { openError, randomBG } from '../../../utils/common'
import ItemFirsrCourse from './ItemFirstCourse'
import { actionGetHomeBlocks, actionGetHomeBlocksLanguage } from '../../../store/home/actions'
import { hideLoading, showLoading } from '../../../store/login/actions'
import panel_eng from '../../../assets/images/panel_eng.png'
import panel_chn from '../../../assets/images/panel_chn.png'
import panel_jap from '../../../assets/images/panel_jap.png'
import panel_kor from '../../../assets/images/panel_kor.png'
import right_ic from '../../../assets/images/right_ic.png'
import { Spinner } from 'react-bootstrap'

type Props = {
  setCurrentKey: (data: string) => void
  changeData: (data: any) => void
  setListCourse: (data: any) => void
  setCategoryCourse: (data: any) => void
  setVisibleCategory: (data: any) => void
}

const languageData = [
  {
    id: 1,
    title: 'Tiếng Anh',
    icon: panel_eng,
    language: 'en-UK'
  },
  {
    id: 2,
    title: 'Tiếng Trung',
    icon: panel_chn,
    language: 'zh-CN'
  },
  {
    id: 3,
    title: 'Tiếng Nhật',
    icon: panel_jap,
    language: 'ja-JP'
  },
  {
    id: 4,
    title: 'Tiếng Hàn',
    icon: panel_kor,
    language: 'ko-KR'
  }
]

const ListCourseLang: FC<Props> = ({
  setCurrentKey,
  changeData,
  setListCourse,
  setCategoryCourse,
  setVisibleCategory
}) => {
  const pathCurrent = useLocation()
  const dispatch = useDispatch()
  const history = useHistory()
  const [listCategories, setListCategories] = useState<any>([])
  const [dataCurrent, setDataCurrent] = useState<any>()
  let handlePath = pathCurrent.pathname.replace(/\//g, '')
  const languageObject = languageData.find((lang) => lang.language === handlePath)
  const [numberEng, setNumberEng] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const getCategory = async () => {
      setIsLoading(true)
      const dataList: any = await dispatch(actionGetHomeBlocksLanguage(handlePath))
      if (!_.isEmpty(dataList)) {
        setListCategories(dataList)
        setDataCurrent(dataList[numberEng])
        setIsLoading(false)
      } else {
        setListCategories([])
        setIsLoading(false)
      }
      setIsLoading(false)
    }
    getCategory()
  }, [dispatch, pathCurrent])

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
      <div className="bg_lang">
        <img src={languageObject?.icon} />
        <div className="title_course">{languageObject?.title}</div>
        {/* <img src={right_ic} style={{ height: 12, marginLeft: 10 }} /> */}
      </div>
      {listCategories?.map((item: any, index: number) => {
        return (
          <React.Fragment key={index}>
            {index < listCategories?.length  && (
              <ItemFirsrCourse
                key={index}
                name={item?.title}
                data={item?.blocks}
                setCurrentKey={setCurrentKey}
                changeData={changeData}
                setCategoryCourse={setCategoryCourse}
                setVisibleCategory={setVisibleCategory}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default ListCourseLang
