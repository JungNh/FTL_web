import imageCompression from 'browser-image-compression'
import _ from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Col, Button as EButton, Image, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import avata from '../../../../assets/images/avata.jpg'
import ico_upload from '../../../../assets/images/ico_upload-gray.svg'
import { Button } from '../../../../components'
import { actionUserMeCore, hideLoading, showLoading } from '../../../../store/login/actions'
import { actionUpdateAccount, actionUploadImage } from '../../../../store/settings/actions'
import ModalUpdate from './ModalUpdate'
import { useHistory } from 'react-router'
import backArrow from '../../../../assets/images/left.png'
import ic_edit from '../../../../assets/images/ic_edit.png'

type Props = {
  goToSubAccTab: () => void
}

const TabMyAcc: React.FC<Props> = ({ goToSubAccTab }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [userInfo, setUserInfo] = useState<any>()
  const [isShowEmail, setIsShowEmail] = useState<boolean>(false)
  const [isShowPhone, setIsShowPhone] = useState<boolean>(false)
  const [showModal, setShowModal] = useState(false)

  const subAccInfo: any = useMemo(() => {
    const subAcc = localStorage.getItem('subAccount')
    if (subAcc) {
      return { isSubAcc: true, data: JSON.parse(subAcc) }
    }
    return { isSubAcc: false }
  }, [])

  const getProfile = useCallback(async () => {
    const response: any = await dispatch(actionUserMeCore())
    if (response?.status === 200 && response?.data) {
      setUserInfo(response.data)
    }
  }, [dispatch])

  const updateUserAvata = async (url: string) => {
    dispatch(showLoading())
    const dataAcc: any = await dispatch(
      actionUpdateAccount({
        ...(userInfo?.profile || {}),
        avatar: url
      })
    )
    if (!_.isEmpty(dataAcc) && dataAcc?.status === 200) {
      const response: any = await dispatch(actionUserMeCore())
      if (response?.status === 200 && response?.data) {
        Swal.fire('Cập nhật thành công', '', 'success')
        setUserInfo({ ...response?.data, profile: dataAcc?.data })
      }
    }
    dispatch(hideLoading())
  }

  useEffect(() => {
    getProfile()
  }, [])

  const uploadAvata = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {
      dispatch(showLoading())
      const compressedFile = await imageCompression(file, options)
      const response: any = await dispatch(actionUploadImage(compressedFile))
      dispatch(hideLoading())

      if (response?.data) {
        Swal.fire({
          title: 'Bạn sẽ đổi avatar này chứ',
          imageUrl: response?.data?.url || '',
          imageAlt: 'avatar',
          showCancelButton: true,
          cancelButtonText: 'Hủy',
          confirmButtonText: 'Lưu'
        })
          .then(async (results) => {
            if (results.isConfirmed) {
              await updateUserAvata(response?.data?.url || '')
            }
            return ''
          })
          .catch((err) => console.error(err))
      }
    } catch (error) {
      console.error(error)
      dispatch(hideLoading())
    }
  }

  const ItemInfo = ({ item }: any) => {
    return (
      <>
        <div style={{ height: 0.5, backgroundColor: '#c2c2c2', marginTop: 10, marginBottom: 10 }} />
        <Row>
          <Col sm={6}>{item.name}</Col>
          <Col sm={6}>{item.value}</Col>
        </Row>
      </>
    )
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="bg_content_progress" style={{ width: '100%', maxWidth: 900 }}>
          <div className="h4" style={{ marginTop: 20 }}>
            Hồ sơ chính
          </div>
          <div style={{ backgroundColor: '#f9f9f9', borderRadius: 10, margin: 10, padding: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="d-flex" style={{ alignItems: 'center', position: 'relative' }}>
                <Image
                  src={userInfo?.avatar || avata}
                  className="avata__image"
                  roundedCircle
                  style={{ width: 80, height: 80, objectFit: 'cover' }}
                />
                {!subAccInfo?.isSubAcc && (
                  <label htmlFor="avata">
                    <Image
                      src={ico_upload}
                      className="avata_holder--upload"
                      rounded
                      style={{
                        width: 20,
                        position: 'absolute',
                        bottom: -2,
                        left: 0
                      }}
                    />
                  </label>
                )}
                <input
                  style={{ display: 'none' }}
                  type="file"
                  name="avata"
                  id="avata"
                  onChange={(e: any) => uploadAvata(e?.target?.files?.[0])}
                />
                <p className="small ml-3" style={{ fontSize: 16, fontWeight: '600' }}>
                  {userInfo?.fullname}
                </p>
              </div>
              <div style={{ fontSize: 14, color: '#018CFF' }} onClick={() => setShowModal(true)}>
                Chỉnh sửa
                <img src={ic_edit} style={{ marginLeft: 10 }} />
              </div>
            </div>
            <ItemInfo item={{ name: 'Email', value: userInfo?.email }} />
            <ItemInfo item={{ name: 'Số điện thoại', value: userInfo?.telephone }} />
            <ItemInfo
              item={{
                name: 'Ngày sinh',
                value: moment(new Date(userInfo?.dob)).format('DD-MM-YYYY')
              }}
            />
            <ItemInfo item={{ name: 'Tỉnh / thành phố', value: userInfo?.province?.name }} />
            <ItemInfo item={{ name: 'Quận / huyện', value: userInfo?.district?.name }} />
            <ItemInfo item={{ name: 'Cấp', value: userInfo?.school_level?.name }} />
            <ItemInfo item={{ name: 'Trường', value: userInfo?.school?.name }} />
          </div>
        </div>
        <ModalUpdate
          userInfo={userInfo}
          isVisible={showModal}
          onClose={() => {
            setShowModal(false)
            getProfile()
          }}
        />
      </div>
    </>
  )
}

export default TabMyAcc
