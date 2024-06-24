import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { apiCore } from '../../../../lib-core'
import { useHistory } from 'react-router-dom'
import { itemPopupSlider } from '../../../../store/popup/actions'
import { actionGetNews } from '../../../../store/settings/actions'
import { openInNewTab } from '../../../../utils/common'
import { SliderType } from '../../BannerHome'

interface PopupModalProps {
  showModal: boolean
  images: string
  handleClose: () => void
  description: string
  slideshow_popup_id: number
  data: any
  url: string
}

const PopupModal: React.FC<PopupModalProps> = ({
  showModal = false,
  images = '',
  description = '',
  handleClose,
  slideshow_popup_id,
  data,
  url = ''
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 })
  const { userInfo } = useSelector((state: RootState) => state.login)
  const history = useHistory()
  const dispatch = useDispatch()
  const [dataPosts, setDataPosts] = useState<string[]>([])
  console.log('dataPopup', data)

  useEffect(() => {
    const calculateModalSize = () => {
      if (modalRef.current) {
        const { width, height } = modalRef.current.getBoundingClientRect()
        setModalSize({ width, height })
      }
    }
    window.addEventListener('resize', calculateModalSize)
    calculateModalSize()

    return () => {
      window.removeEventListener('resize', calculateModalSize)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleClose])

  const getListNews = useCallback(
    async ({ offset, limit }: { offset: number; limit: number }) => {
      const response: any = await dispatch(
        actionGetNews({
          offset,
          limit,
          order: 'ASC'
        })
      )
      if (response?.data) {
        setDataPosts(response?.data?.data)
      }
    },
    [dispatch]
  )

  useEffect(() => {
    getListNews({ offset: 0, limit: 10 })
  }, [])

  const { width, height } = modalSize

  // if (!showPopup) {
  //   return null;
  // }

  useEffect(() => {
    viewPopupClick()
  }, [slideshow_popup_id])

  const viewPopupClick = async () => {
    const body = {
      type: 1,
      user_id: userInfo.id,
      slideshow_popup_id: slideshow_popup_id
    }
    await apiCore.post('/api/view-click', body)
  }

  const callViewClick = async () => {
    const body = {
      type: 2,
      user_id: userInfo.id,
      slideshow_popup_id: slideshow_popup_id
    }
    await apiCore.post('/api/view-click', body)
  }

  const handleClickPopupSlider = async () => {
    handleClose()

    if (data.post_id != null && Number(data.post_id) > 0) {
      const itemPost = dataPosts.find((item: any) => item.id == data.post_id)
      dispatch(itemPopupSlider(itemPost))
      callViewClick()
      history.push('/posts')
    } else if (url?.length > 0 && url.includes('https://')) {
      callViewClick()
      openInNewTab(url)
    }
  }

  return (
    <>
      {showModal && (
        <div
          ref={modalRef}
          style={{
            position: 'fixed',
            backgroundColor: 'white',
            top: 40,
            left: 200,
            right: 200,
            bottom: 30,
            zIndex: 9999,
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            borderRadius: 15
          }}
        >
          <div
            style={{
              width: '100%'
              // height: '100%'
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                right: -35,
                top: -35,
                marginLeft: width - 50,
                marginTop: 10,
                height: 30,
                width: 30,
                alignItems: 'center',
                borderRadius: 15,
                transition: 'background-color 0.3s ease',
                cursor: 'pointer',
                boxShadow:
                  'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
              }}
              onClick={handleClose}
            >
              <div
                style={{ textAlign: 'center', fontSize: 15, color: '#4c4c4c', fontWeight: 'bold' }}
              >
                X
              </div>
            </div>
            <div onClick={handleClickPopupSlider}>
              <div
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  height: height / 1.2,
                  width: width
                }}
              >
                <img
                  src={images}
                  alt="Hình ảnh Poup"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  }}
                />
              </div>
              <div>
                {description?.length > 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      width: width,
                      backgroundColor: '#E4F7FF',
                      paddingTop: 10,
                      paddingBottom: 10
                    }}
                  >
                    {description}
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 10,
                  paddingBottom: 10,
                  backgroundColor: '#0066ff',
                  borderRadius: 10
                }}
                onClick={handleClickPopupSlider}
              >
                <b style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>
                  {data.type_slider == 3 ? 'ĐÓNG' : 'XEM NGAY'}
                </b>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PopupModal
