import React, { FC, useState } from 'react'
import panel_eng from '../../../assets/images/panel_eng.png'
import panel_chn from '../../../assets/images/panel_chn.png'
import panel_jap from '../../../assets/images/panel_jap.png'
import panel_kor from '../../../assets/images/panel_kor.png'
import right_ic from '../../../assets/images/right_ic.png'
import { useHistory } from 'react-router'
import ItemFirstCourse from '../ListCourse/ItemFirstCourse'

type Props = {
  data: any[]
  language: string
  setCurrentKey: (data: string) => void
  changeData: (data: any) => void
  setCategoryCourse: (data: any) => void
  setVisibleCategory: (data: boolean) => void
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

const BlockLanguage: FC<Props> = ({
  data,
  language,
  setCurrentKey,
  changeData,
  setCategoryCourse,
  setVisibleCategory
}) => {
  const languageObject = languageData.find((lang) => lang.language === language)
  const history = useHistory()
  const [numberTag, setNumberTag] = useState<number>(0)

  return (
    <div>
      <div className="bg_lang cursor" onClick={() => history.push(`/${languageObject?.language}`)}>
        <img src={languageObject?.icon} />
        <div className="title_course">{languageObject?.title}</div>
        <img src={right_ic} style={{ height: 12, marginLeft: 10 }} />
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 10,
          overflow: 'hidden',
          overflowX: 'scroll',
          marginBottom: -20
        }}
      >
        {data.map((item: any, index: number) => {
          return (
            <div
              style={{
                padding: 10,
                backgroundColor: numberTag == index ? '#EAF5FF' : '#fff',
                fontSize: 12,
                color: numberTag == index ? '#008CFF' : 'black',
                marginRight: 5,
                borderRadius: 10,
                fontWeight: '600',
                minWidth: 150,
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onClick={() => {
                setNumberTag(index)
              }}
            >
              {item?.title}
            </div>
          )
        })}
      </div>
      {data[numberTag]?.blocks && (
        <ItemFirstCourse
          data={data[numberTag]?.blocks}
          setCurrentKey={setCurrentKey}
          changeData={changeData}
          setCategoryCourse={setCategoryCourse}
          setVisibleCategory={setVisibleCategory}
        />
      )}
    </div>
  )
}

export default BlockLanguage
