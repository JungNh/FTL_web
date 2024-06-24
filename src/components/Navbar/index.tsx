import React from 'react'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { Button } from '..'
import homeBlack from '../../assets/images/ico_home-black.svg'
import homeWhite from '../../assets/images/ico_home-white.svg'
import rocketBlack from '../../assets/images/ico_rocket-black.svg'
import rocketWhite from '../../assets/images/ico_rocket-white.svg'
import growBlack from '../../assets/images/ico_grow-black.svg'
import growWhite from '../../assets/images/ico_grow-white.svg'
// import searchBlack from '../../assets/images/ico_search-black.svg'
// import searchWhite from '../../assets/images/ico_search-white.svg'
import userBlack from '../../assets/images/ico_userNav-black.svg'
import userWhite from '../../assets/images/ico_userNav-white.svg'
import { actionGetLastestCourse } from '../../store/study/actions'

type Panel = 'home' | 'study' | 'progress' | 'dictionary' | 'user-setting'

type Props = {
  activePanel: Panel
  changePanel: (panel: Panel) => void
}

const DefaultNavbar: React.FC<Props> = ({ activePanel, changePanel }) => {
  const history = useHistory()

  const dispatch = useDispatch()

  const changToStudyPage = async () => {
    Swal.fire('Tính năng sắp ra mắt!')
    // const response: any = await dispatch(actionGetLastestCourse())
    // if (response?.id !== undefined) {
    //   changePanel('study')
    //   history.push(`/study/${response?.id}`)
    // }
  }

  return (
    <div className="navbar__components">
      <Button.Solid
        className={`navbar__btn ${activePanel === 'home' ? 'active' : ''}`}
        onClick={() => {
          changePanel('home')
          history.push('/home')
        }}
        content={(
          <div className="flex justify-content-center align-items-center fw-bold">
            <img
              src={activePanel === 'home' ? homeWhite : homeBlack}
              alt="nav btn"
              className="me-2 py-1"
            />
            TRANG CHỦ
          </div>
        )}
      />
      <Button.Solid
        className={`navbar__btn ${activePanel === 'progress' ? 'active' : ''}`}
        onClick={() => {
          changePanel('progress')
          history.push('/progress')
        }}
        content={(
          <div className="flex justify-content-center align-items-center fw-bold">
            <img
              src={activePanel === 'progress' ? growWhite : growBlack}
              alt="nav btn"
              className="me-2 py-1"
            />
            TIẾN TRÌNH
          </div>
        )}
      />
      <Button.Solid
        // className={`navbar__btn ${activePanel === 'study' ? 'active' : ''}`}
        className="navbar__btn"
        onClick={changToStudyPage}
        content={(
          <div className="flex justify-content-center align-items-center fw-bold">
            <img
              // src={activePanel === 'study' ? rocketWhite : rocketBlack}
              src={rocketBlack}
              alt="nav btn"
              className="me-2 py-1"
            />
            QUÀ TẶNG
          </div>
        )}
      />

      {/*
     // ! NOTE Tính năng chưa khả dụng nên tạm khóa lại
     <Button.Solid
        className={`navbar__btn ${activePanel === 'dictionary' ? 'active' : ''}`}
        onClick={() => {
          history.push('/dictionary')
          changePanel('dictionary')
        }}
        content={
          <div className="flex justify-content-center align-items-center fw-bold">
            <img
              src={activePanel === 'dictionary' ? searchWhite : searchBlack}
              alt="nav btn"
              className="me-2 py-1"
            />
            TỪ ĐIỂN
          </div>
        }
      /> */}
      <Button.Solid
        className={`navbar__btn ${activePanel === 'user-setting' ? 'active' : ''}`}
        onClick={() => {
          history.push('/user-setting')
          changePanel('user-setting')
        }}
        content={(
          <div className="flex justify-content-center align-items-center fw-bold">
            <img
              src={activePanel === 'user-setting' ? userWhite : userBlack}
              alt="nav btn"
              className="me-2 py-1"
            />
            CÁ NHÂN
          </div>
        )}
      />
    </div>
  )
}

export default DefaultNavbar
