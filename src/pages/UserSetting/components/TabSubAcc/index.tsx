import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import { Image, Dropdown, Badge } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { format } from 'date-fns'
import _ from 'lodash'
import imageCompression from 'browser-image-compression'
import { Button } from '../../../../components'
import avata from '../../../../assets/images/avata.jpg'
import ico_dots from '../../../../assets/images/ico_dots.svg'
import ico_upload from '../../../../assets/images/ico_upload-gray.svg'
import {
  actionGetAccounts,
  actionSwitchAcc,
  actionUpdateSubAcc,
  actionUploadImage,
} from '../../../../store/settings/actions'
import ModalCreateAcc from './ModalCreateAcc'
import { actionUserMe, hideLoading, showLoading } from '../../../../store/login/actions'
import ModalUpdate from './ModalUpdate'

type Props = {
  goToMyAccTab: () => void
}

const TabSubAcc: React.FC<Props> = ({ goToMyAccTab }) => {
  const [isVisibleEdit, setIsVisibleEdit] = useState(false)
  const [isVisibleAdd, setIsVisibleAdd] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [editAccIndex, setEditAccIndex] = useState<number | null>(null)
  const dispatch = useDispatch()

  const subAccInfo: any = useMemo(() => {
    const subAcc = localStorage.getItem('subAccount')
    if (subAcc) {
      return { isSubAcc: true, data: JSON.parse(subAcc) }
    }
    return { isSubAcc: false }
  }, [])

  const getAccount = useCallback(async () => {
    const response: any = await dispatch(actionGetAccounts())

    if (response?.status === 200 && response?.data) {
      setAccounts(response?.data)
    }
  }, [dispatch])

  useEffect(() => {
    getAccount()
  }, [getAccount])

  const openCreateAccModal = () => {
    if (accounts?.length >= 2) {
      Swal.fire('Đã tồn tại 2 tài khoản phụ', '', 'warning')
    } else {
      setIsVisibleAdd(true)
    }
  }

  const changeAccount = async (accInfo: any) => {
    dispatch(showLoading())
    if (accInfo?.id !== 0) {
      localStorage.setItem('subAccount', JSON.stringify(accInfo))
    } else {
      localStorage.removeItem('subAccount')
    }
    const response: any = await dispatch(actionSwitchAcc({ accountId: accInfo?.id }))
    if (response?.data) {
      localStorage.setItem('token', response?.data?.token)
      await dispatch(actionUserMe())
      await getAccount()
    }
    goToMyAccTab()
    dispatch(hideLoading())
  }

  const updateUserAvata = async (url: string, userInfo: any) => {
    dispatch(showLoading())
    const dataAcc: any = await dispatch(
      actionUpdateSubAcc({
        accountId: userInfo?.id,
        data: {
          ...(userInfo || {}),
          avatar: url,
        },
      })
    )
    if (!_.isEmpty(dataAcc) && dataAcc?.status === 200) {
      const response: any = await dispatch(actionUserMe())
      if (response?.status === 200 && response?.data) {
        Swal.fire('Cập nhật thành công', '', 'success')
        await getAccount()
      }
    }
    dispatch(hideLoading())
  }

  const uploadAvata = async (file: File, accountInfo: any) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
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
          confirmButtonText: 'Lưu',
        })
          .then(async (results) => {
            if (results.isConfirmed) {
              await updateUserAvata(response?.data?.url || '', accountInfo)
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

  return (
    <div className="tab_sub_acc">
      <p className="h4 fw-bold">Tài khoản phụ</p>

      <div className="tab__wrap">
        {/* List sub account */}
        {accounts.map((item: any, index: number) => (
          <div className="account__wrap mb-3" key={item?.id}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <div className="avata_holder">
                  <Image src={item?.avatar || avata} className="avata_image" roundedCircle />
                  {!subAccInfo.isSubAcc && (
                    <label htmlFor={`avata-${item?.id}`}>
                      <Image src={ico_upload} className="avata_holder--upload" rounded />
                    </label>
                  )}
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    name={`avata-${item?.id}`}
                    id={`avata-${item?.id}`}
                    onChange={(e: any) => uploadAvata(e?.target?.files?.[0], item)}
                  />
                </div>
                <p className="mb-0 fw-bold small mx-3">{item?.fullname}</p>
                <p className="mb-0 tag__text me-3">{`#${item?.userId}`}</p>
                {item?.id !== 0 && (
                  <Badge pill style={{ background: '#0d6efd' }}>
                    Tài khoản phụ
                  </Badge>
                )}
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  style={{ background: 'transparent', border: 'none' }}
                  variant="light"
                  id={`dropdown-basic-${index}`}
                  className="btn__dropdown"
                >
                  <img className="cursor-pointer" src={ico_dots} alt="dots" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onSelect={() => changeAccount(item)}>
                    Đổi sang tài khoản này
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="info__container">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <p className="small mb-0 fw-bold">Tên hiển thị</p>
                  <p className="small mb-0 me-3">{`${item?.fullname} #${item?.userId}`}</p>
                </div>
                {!subAccInfo.isSubAcc && (
                  <div>
                    <Button.Solid
                      content="Sửa"
                      className="btn--edit"
                      onClick={() => {
                        setEditAccIndex(index)
                        setIsVisibleEdit(true)
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="small mb-0 fw-bold">Ngày sinh</p>
                  <p className="small mb-0">
                    {format(new Date(item?.dob || ''), "'Ngày' dd 'tháng' MM 'năm' yyyy")}
                  </p>
                </div>
                {!subAccInfo.isSubAcc && (
                  <div>
                    <Button.Solid
                      content="Sửa"
                      className="btn--edit"
                      onClick={() => {
                        setEditAccIndex(index)
                        setIsVisibleEdit(true)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <Button.Solid
          type="button"
          className="button__subAcc mt-3 mb-4"
          onClick={() => {
            openCreateAccModal()
          }}
          content={(
            <>
              <p className="mb-0 fw-bold">Thêm</p>
              <small>Tài khoản phụ</small>
            </>
          )}
        />
      </div>

      <ModalCreateAcc
        isShow={isVisibleAdd}
        closeModal={() => {
          setIsVisibleAdd(false)
          getAccount()
        }}
      />
      <ModalUpdate
        userInfo={editAccIndex !== null ? accounts[editAccIndex] : {}}
        isVisible={isVisibleEdit}
        onClose={() => {
          setIsVisibleEdit(false)
          setEditAccIndex(null)
          getAccount()
        }}
      />
    </div>
  )
}

export default TabSubAcc
