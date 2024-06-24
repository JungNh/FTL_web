import React, { FC, useCallback, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import icon_notify from '../../../assets/images/icon_notify.png'
import header_attendance from '../../../assets/images/header_attendance.png'
import icon_book from '../../../assets/images/icon_book.png'
import avatarUser from '../../../assets/images/avatar.png'
import { useHistory } from 'react-router'
import NotifyModal from '../ModalNotify'
import { actionShowNews, actionShowPosts } from '../../../store/home/actions'
import ModalNews from '../ModalNews'
import ModalPost from '../ModalPost'

type Props = { title?: any }

const HeaderHome: FC<Props> = ({ title }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const avatarCore = useSelector((state: RootState) => state.login.userInfoCore.avatar)
  const { numberNotiNotRead, isShowNews, isShowPosts } = useSelector(
    (state: RootState) => state.home
  )

  const handleClose = () => setShow(false)

  const showNewsNoti = () => {
    setTimeout(() => {
      dispatch(actionShowNews(true))
    }, 1000)
  }

  const showPostsNoti = useCallback(() => {
    setTimeout(() => {
      dispatch(actionShowPosts(true))
    }, 1000)
  }, [])

  const hanleCloseNews = () => dispatch(actionShowNews(false))

  const hanleClosePosts = () => dispatch(actionShowPosts(false))

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: 20,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
      }}
    >
      {title}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          className="my_course_home"
          onClick={() => {
            history.push({
              pathname: '/my-leanning',
              state: { tabPanel: 'leanning' }
            })
          }}
        >
          <img src={icon_book} />
          <div className='text_my_course'>Khoá học của tôi</div>
        </div>
        <img
          onClick={() => history.push('/attendance')}
          src={header_attendance}
          className="img_attendance"
        />
        <div style={{ position: 'relative' }}>
          {numberNotiNotRead !== undefined && numberNotiNotRead !== 0 && (
            <div
              style={{
                position: 'absolute',
                right: 10,
                width: 25,
                height: 25,
                borderRadius: 15,
                color: 'white',
                display: 'flex',
                backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="num_text">{numberNotiNotRead}</span>
            </div>
          )}
          <img onClick={() => setShow(true)} src={icon_notify} className="img_noti" />
        </div>
        <img
          onClick={() => history.push('/user-setting')}
          src={avatarCore ? avatarCore : avatarUser}
          className="img_avatar"
        />
      </div>
      <NotifyModal
        show={show}
        handleClose={handleClose}
        showNews={showNewsNoti}
        showPosts={showPostsNoti}
      />
      <ModalNews show={isShowNews} handleClose={hanleCloseNews} />
      <ModalPost show={isShowPosts} handleClose={hanleClosePosts} />
    </div>
  )
}

export default HeaderHome
