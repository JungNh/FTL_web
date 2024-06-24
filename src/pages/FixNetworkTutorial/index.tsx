import React from 'react'
// import ReactPlayer from 'react-player'
import { Image } from 'react-bootstrap'
import { useHistory } from 'react-router'
// import path from 'path'
// import { Link } from 'react-router-dom'
import tutorial1 from '../../assets/images/tutorial_1.jpg'
import tutorial2 from '../../assets/images/tutorial_2.png'
import tutorial3 from '../../assets/images/tutorial_3.png'
import tutorial4 from '../../assets/images/tutorial_4.png'
import backArrow from '../../assets/images/ico_arrowLeft-blue.svg'
// import update from '../../assets/files/update.pfx'
import { Button } from '../../components'
import './styles.scss'

const FixNetWorkTutorial = () => {
  const child = require('child_process').exec
  const history = useHistory()

  return (
    <div className="tutorial_fix_network">
      <Button.Shadow
        className="button__back"
        color="gray"
        onClick={() => history.push('/login')}
        content={<img src={backArrow} alt="bageSection" />}
      />
      <div>
        <h1 className="fw-bold text-center">Lỗi đăng nhập FutureLang trên máy tính</h1>
        <p>
          Trong quá trình sử dụng apps FutureLang trên windows 7 bạn bị lỗi đăng nhập như sau:
          NETWORK ERROR.
        </p>
        <p>Thì đây là phần do lỗi chính chỉ trên win 7</p>
        <p> Quý khách vui lòng làm theo những hướng dẫn sau để sửa lỗi này nhé :</p>
      </div>

      <div className="my-4">
        <h1 className="fw-bold text-center">Cài đặt chứng chỉ uy tín để vào học</h1>
        {/* <ReactPlayer
          className="mx-auto"
          url="https://www.youtube.com/watch?v=3vH5B4Ge9nk"
          config={{
            youtube: {
              playerVars: { showinfo: 1 },
            },
          }}
        /> */}
        <h2 className="mt-3 fw-bold">Bước 1: Tải file chứng chỉ</h2>
        <p>Download file Certificate chứng chỉ an toàn khi truy cập website.</p>
        <div className="download_file-wrapper">
          <a
            href="https://5501513-s3user.storebox.vn/download/update.pfx"
            target="_blank"
            rel="noopener noreferrer"
            className="download_file-web"
          >
            TẢI FILE TỪ TRÌNH DUYỆT
          </a>
          {/* HOẶC
          <div className="fw-bold download_file-local">
            <Link to="/update.pfx" target="_blank" download>
              MỞ FILE TRỰC TIẾP
            </Link>
          </div> */}
        </div>

        <h2 className="mt-3 fw-bold">Bước 2: Tiến hành cài đặt</h2>
        <p>
          Sau khi tải file về bạn tiến hành cài đặt
          {' '}
          <b>tên file “update.pfx”</b>
          {' '}
          như sau:
        </p>
        <Image className="mb-3" src={tutorial1} alt="update.pfx" />
        <p>
          Bạn nhấn chuột trái và mở lên để tiến Hành Cài đặt. (Chỉ Ấn Next Và chọn Yes nhiều lần là
          thành công)
        </p>
        <p>Tiếp theo chọn Next.</p>
        <Image className="mb-3" src={tutorial2} alt="update.pfx" />
        <p>
          Nếu Xuất hiện thông báo nhập password. Ta nhập
          {' '}
          <span style={{ color: 'red', fontWeight: 'bold' }}>123</span>
          .
        </p>
        <Image className="mb-3" src={tutorial3} alt="update.pfx" />
        <p>
          Tiếp đến nhấn
          {' '}
          <b>
            YES =
            {'>'}
            {' '}
            YES (khoảng 10 lần) =
            {'>'}
            {' '}
            Finish.
          </b>
          {' '}
          Nhấn
          {' '}
          <b>OK</b>
          {' '}
          là xong.
        </p>
        <Image className="mb-3" src={tutorial4} alt="update.pfx" />
        <p>Vậy là Xong. Bây giờ quay lại và đăng nhập để học bình thường.</p>
      </div>
      <div className="btn__back__bottom">
        <Button.Solid
          className="back_btn"
          onClick={() => history.push('/login')}
          content={(
            <div className="flex justify-content-center align-items-center fw-bold">
              Quay về màn hình đăng nhập
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default FixNetWorkTutorial
