import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { actionGetAllCource } from '../../../../store/achivements/actions'
import { convertUrl } from '../../../../utils/common'
import './style.scss'
import { RootState } from '../../../../store'
import backArrow from '../../../../assets/images/left.png'

type Props = {
  goToAchiveDetailTab: () => void
  goToSubAccTab: () => void
}

const TabAchievements: React.FC<Props> = ({ goToAchiveDetailTab, goToSubAccTab }) => {
  const [listData, setListData] = useState([])
  const userInfo = useSelector((state: RootState) => state.login.userInfo)
  const dispatch = useDispatch()
  useEffect(() => {
    const getAllCource = async () => {
      const dataList: any = await dispatch(actionGetAllCource())
      if (!_.isEmpty(dataList.data)) {
        setListData(dataList.data)
      } else {
        setListData([])
      }
    }
    getAllCource()
  }, [dispatch])

  const changePageDetail = (id: any) => {
    goToAchiveDetailTab()
    localStorage.setItem('courseId', id)
  }

  return (
    <div className="tab__info">
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}
      >
        <div className="h4" style={{ margin: 0 }}>
        Các khoá học của tôi
        </div>
      </div>
      <hr />
      <div className="tab__wrap">
        {listData.length == 0 ? (
          <div className="achievenment__no mb-3">
            {' '}
            <b className="wap1">{userInfo.fullname}</b> ơi, bạn chưa học khoá học nào. Hãy bắt đầu
            học một bài học ngay nhé!
          </div>
        ) : (
          <div className="achievenment__wrap mb-3">
            {listData?.map((item: any, index: number) => {
              return (
                <div className="d-flex justify-content-between align-items-center mb-3" key={index}>
                  <div className="align-items-center">
                    <div className="achive_item">
                      <div
                        className="item_img_wrap"
                        style={{
                          background: `url(${convertUrl(item?.imageUrl, 'image')})`,
                          backgroundSize: 'cover'
                        }}
                      >
                        <img src={item?.imageUrl} alt="" />
                      </div>
                      <div className="achive_item_ct">
                        <span>{item?.name}</span>
                        <br />
                        <Button onClick={() => changePageDetail(item.id)}>Xem chi tiết</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TabAchievements
