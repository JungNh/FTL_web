import React, { useState } from 'react'
import BrandName from '../../../../assets/images/tabAffiliate.png'
import { Button, Input } from '../../../../components'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import toast, { Toaster } from 'react-hot-toast'
import { apiCore } from '../../../../lib-core'
import { actionUserMe } from '../../../../store/login/actions'

type Props = Record<string, unknown>

const TabAffiliate: React.FC<Props> = () => {
  const [code, setCode] = useState('')
  const [dataCardTitle, setDataCardTitle] = useState({
    type: 'error',
    message: ''
  })
  const { userInfo } = useSelector((state: RootState) => state.login)
  const notify = () => toast.success('Đã sao chép mã giới thiệu thành công!')
  const copy = () => {
    navigator.clipboard.writeText(userInfo?.telephone)
    notify()
  }
  const dispatch = useDispatch()

  const handleSendAfiiliate = async (values: any) => {
    try {
      const response = await apiCore.post('/user/affiliate', { affiliate: values })
      console.log(response)
      if (response.data.code == 1) {
        const message = response.data.message
        const type = 'active'
        dispatch(actionUserMe())
        setDataCardTitle({
          type,
          message
        })
        setCode('')
      } else {
        const message = 'Mã giới thiệu không hợp lệ.'
        const type = 'error'
        setDataCardTitle({
          type,
          message
        })
        setCode('')
      }
    } catch (error: any) {
      const message = 'Mã giới thiệu không hợp lệ.'
      const type = 'error'
      setDataCardTitle({
        type,
        message
      })
      setCode('')
    }
  }

  return (
    <div className="tab__info">
      <div className="tab__wrap relative">
        <div className="d-flex flex-column">
          <div className="h3 fw-bold " style={{ textAlign: 'center', marginBottom: 50 }}>
            Giới thiệu bạn bè
          </div>
          <img src={BrandName} alt="FutureLang" />
          <span style={{ marginTop: 20, marginBottom: 10 }}>Mã giới thiệu của bạn</span>
          <div className="tab__wrap d-flex align-items-center" style={{ marginBottom: 20 }}>
            <div className="code-affiliate" style={{ boxShadow: '1px 2px 1px #6c757d' }}>
              <span>{userInfo?.telephone || ''}</span>
            </div>
            <Button.Shadow
              className="btn__small ms-3 btn-affiliate"
              content="Copy"
              onClick={() => copy()}
            />
            <Toaster position="top-right" reverseOrder={false} />
          </div>
          <span style={{ marginTop: 20, marginBottom: 10 }}>Nhập mã giới thiệu</span>
          <input
            maxLength={20}
            style={{
              backgroundColor: '#F9F9F9',
              borderColor: 'white',
              borderWidth: 0,
              paddingTop: 5,
              paddingBottom: 5,
              lineHeight: '30px'
            }}
            onChange={(e) => {
              setCode(e.target.value)
            }}
          />
          <div style={{ color: dataCardTitle.type == 'active' ? 'green' : 'red' }}>
            {dataCardTitle.message}
          </div>
          <div
            className="cursor"
            style={{
              backgroundColor: '#018CFF',
              color: 'white',
              textAlign: 'center',
              marginTop: 30,
              padding: 10,
              borderRadius: 10
            }}
            onClick={() => handleSendAfiiliate(code)}
          >
            Xác nhận
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabAffiliate
