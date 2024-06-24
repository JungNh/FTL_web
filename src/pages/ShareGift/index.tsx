import React, { useState } from 'react'
import './styles.scss'
import { useLocation } from 'react-router'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import { FacebookIcon, TwitterIcon } from 'react-share'

const ShareGift = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchImg: any = searchParams.get('image')
  const currentDomain = window.location.origin
  const currentPath = currentDomain + location.pathname + location.search
  console.log('currentPath', currentPath,'asfs',searchImg)

  const oaId = '2432689861922447199'

  const handleShareZaloOA = () => {
    const zaloOAScheme = `zalo://forward?appid=${oaId}&link=${encodeURIComponent('https://codepen.io/tanduong/pen/QJyore')}`;
    window.location.href = zaloOAScheme;
  };

  return (
    <div
      style={{
        flex: 1,
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div>Chúc mừng bạn</div>
      <div>{searchParams.get('name')}</div>
      <div>đã trúng:</div>
      <div>{searchParams.get('gift')}</div>
      <img src={searchImg} alt="icon" />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div onClick={() => handleShareZaloOA()}>zalo share</div>
        {/* <div className="zalo-share-button" data-href="" data-oaid="2432689861922447199" data-layout="1" data-color="blue" data-customize="false">Share zalo</div> */}
        <FacebookShareButton url={currentPath} className="Demo__some-network__share-button">
          <FacebookIcon size={32} round /> Facebook share
        </FacebookShareButton>
      </div>
    </div>
  )
}

export default ShareGift
