import * as React from 'react'
import { Image } from 'react-bootstrap'
import './styles.scss'

import fubo_blink from "../../../../assets/images/fubo_blink.svg"

type Props = {
  open: boolean,
  onClose: any,
}

const PopupShare: React.FC<Props> = ({ open, onClose }) => {
  const [blink, setBlink] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(document.URL);
    setBlink(true);
    setTimeout(() => setBlink(false), 3000)
  }
  return open ? (
    <div className="popupshare__component">
      <div className="popupshare__wrapper">
        <Image className="popupshare__wrapper-fubo" src={fubo_blink} />
        <div className="popupshare__wrapper-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.2034 2.67773L2.52545 13.3557" stroke="#444444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.52545 2.67773L13.2034 13.3557" stroke="#444444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div className="content">
          <h1>Mời bạn bè</h1>
          <div className="content__copy" onClick={copy}>
            <p>{document.URL}</p>
            <span>{!blink ? "SAO CHÉP LINK" : "ĐÃ SAO CHÉP"}</span>
          </div>
          <h4>Hoặc chia sẻ trên.....</h4>
          <div className="content__media">
            <a target="_blank" href="">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34 17C34 7.61115 26.3888 0 17 0C7.61115 0 0 7.61115 0 17C0 25.4851 6.21662 32.5181 14.3438 33.7935V21.9141H10.0273V17H14.3438V13.2547C14.3438 8.99406 16.8818 6.64062 20.7649 6.64062C22.6243 6.64062 24.5703 6.97266 24.5703 6.97266V11.1562H22.4267C20.315 11.1562 19.6562 12.4668 19.6562 13.8125V17H24.3711L23.6174 21.9141H19.6562V33.7935C27.7834 32.5181 34 25.4851 34 17Z" fill="#1877F2" />
                <path d="M23.6174 21.9141L24.3711 17H19.6562V13.8125C19.6562 12.4681 20.315 11.1562 22.4267 11.1562H24.5703V6.97266C24.5703 6.97266 22.6249 6.64062 20.7649 6.64062C16.8818 6.64062 14.3438 8.99406 14.3438 13.2547V17H10.0273V21.9141H14.3438V33.7935C16.1039 34.0688 17.8961 34.0688 19.6562 33.7935V21.9141H23.6174Z" fill="white" />
              </svg>
              <p>Facebook</p>
            </a>
            <a target="_blank">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 34C26.3888 34 34 26.3888 34 17C34 7.61116 26.3888 0 17 0C7.61116 0 0 7.61116 0 17C0 26.3888 7.61116 34 17 34Z" fill="url(#paint0_linear_113_11280)" />
                <path fillRule="evenodd" clipRule="evenodd" d="M7.69519 16.8209C12.651 14.6617 15.9557 13.2383 17.6092 12.5505C22.3303 10.5869 23.3113 10.2458 23.9507 10.2345C24.0913 10.232 24.4058 10.2669 24.6094 10.4321C24.7814 10.5717 24.8288 10.7602 24.8514 10.8925C24.874 11.0248 24.9022 11.3262 24.8798 11.5618C24.624 14.2499 23.517 20.7732 22.9538 23.7839C22.7155 25.0578 22.2463 25.485 21.792 25.5268C20.8048 25.6176 20.0551 24.8744 19.099 24.2476C17.6027 23.2668 16.7575 22.6562 15.3051 21.6992C13.6267 20.5931 14.7148 19.9852 15.6713 18.9917C15.9216 18.7317 20.2713 14.7753 20.3555 14.4164C20.3661 14.3715 20.3758 14.2042 20.2764 14.1158C20.177 14.0275 20.0303 14.0577 19.9245 14.0817C19.7744 14.1158 17.3842 15.6956 12.7538 18.8213C12.0753 19.2872 11.4608 19.5141 10.9102 19.5023C10.3032 19.4891 9.13558 19.1591 8.26759 18.8769C7.20296 18.5308 6.35682 18.3479 6.4305 17.7601C6.46888 17.454 6.89044 17.1409 7.69519 16.8209Z" fill="white" />
                <defs>
                  <linearGradient id="paint0_linear_113_11280" x1="17" y1="0" x2="17" y2="33.7478" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#2AABEE" />
                    <stop offset="1" stop-color="#229ED9" />
                  </linearGradient>
                </defs>
              </svg>
              <p>Telegram</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default PopupShare
