import { ErrorMessage } from '@hookform/error-message'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { IoClose } from 'react-icons/io5'
import affiliateImg from '../../../assets/images/affiliate.png'
import { Button, Input } from '../../../components'
import { apiCore } from '../../../lib-core'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { actionSetAffiliate } from '../../../store/home/actions'
import { actionUserMe } from '../../../store/login/actions'
import { useHistory } from 'react-router'
const GetMessageError = (type: string) => {
  if (type === 'CARD_CODE_INVALID') return 'Mã thẻ không hợp lệ'
  if (type === 'CARD_CODE_IS_LOCKED') return 'Mã thẻ đã bị khóa'
  if (type === 'CARD_CODE_OUT_OF_DATE') return 'Mã thẻ đã hết hạn'
  if (type === 'CARD_CODE_OUT_OF_USE') return 'Mã thẻ đã hết lượt sử dụng'
  if (type === 'CARD_CODE_ALREADY_USED') return 'Mã thẻ đã được sử dụng'
  if (type === 'CARD_CODE_DOES_NOT_EXIST') return 'Mã thẻ không tồn tại'
  if (type === 'CARD_DOES_NOT_EXIST_OR_DELETED') return 'Thẻ không tồn tại hoặc đã bị xóa'
  if (type === 'YOU_ACTIVATED_TEST_CARD') {
    return 'Bạn đã kích hoạt thẻ thử! Vui lòng chọn mã thẻ khác!'
  }
  return ''
}

interface CardTitleProps {
  dataCardTitle: any
}

const CardTitle = ({ dataCardTitle }: CardTitleProps) => {
  if (dataCardTitle.type === 'notfound') {
    return (
      <div className="card-title">
        <span className="title header">Bạn có mã giới thiệu?</span>
        <span className="title .mt20">Vui lòng nhập mã giới thiệu vào ô dưới đây</span>
      </div>
    )
  }
  if (dataCardTitle.type === 'active') {
    return (
      <div className="card-title">
        <span className="title header">{dataCardTitle.message}</span>
      </div>
    )
  }
  return (
    <div className="card-title">
      <span className="title error header">{dataCardTitle.message}</span>
    </div>
  )
}

interface Props {
  dataCardCode?: any
  handleClose?: () => void
  reLoadData?: any
  courseId?: number
}

interface FormValues {
  affiliate: string
}

const Affiliate = ({ dataCardCode, handleClose, reLoadData, courseId }: Props) => {
  const history = useHistory()
  const [dataCardTitle, setDataCardTitle] = useState({
    type: 'notfound',
    message: ''
  })
  const [progressSubmit, setProgressSubmit] = useState<boolean>(false)
  const { isShowAffi } = useSelector((state: RootState) => state.home)
  const userInfo = useSelector((state: RootState) => state.login.userInfo)
  const dispatch = useDispatch()

  const handleTick = async () => {
    try {
      const response = await apiCore.post(`/user/tick-affiliate`)
    } catch (error) {
      console.log('error', error)
    }
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormValues>()

  const handleSendAfiiliate = async (values: any) => {
    try {
      const response = await apiCore.post('/user/affiliate', values)
      if (response.data.code == 1) {
        const message =response.data.message
        const type = 'active'
        dispatch(actionUserMe())
        setDataCardTitle({
          type,
          message
        })
      } else {
        console.log('error', response)
        const message = 'Mã giới thiệu không hợp lệ.'
        const type = 'error'
        setDataCardTitle({
          type,
          message
        })
      }
    } catch (error: any) {
      console.log('error', error)
      const message = error.message
      const type = 'error'
      setDataCardTitle({
        type,
        message
      })
    }
  }

  const onsubmit = async (values: FormValues) => {
    setProgressSubmit(true)
    if (dataCardTitle.type == 'active') {
      dispatch(actionSetAffiliate(false))
      history.push({
        pathname: '/user-setting',
        state: { tabPanel: 'card-active' }
      })
    } else {
      await handleSendAfiiliate(values)
      setProgressSubmit(false)
    }
  }

  return (
    <Modal show={isShowAffi} onHide={handleClose} centered backdrop="static" keyboard={false}>
      <Modal.Body className="relative">
        <div className="text-right">
          <div className="bg-affiliate">
            <img className="affiliate" src={affiliateImg} alt="affiliate" width={80} height={80} />
            <IoClose
              onClick={() => {
                dispatch(actionSetAffiliate(false))
                handleTick()
              }}
              className="icon-close"
            />
          </div>
        </div>
        <CardTitle dataCardTitle={dataCardTitle} />
        <form onSubmit={handleSubmit(onsubmit)}>
          {dataCardTitle.type !== 'active' && (
            <div className="mb-4 relative">
              <Controller
                name="affiliate"
                control={control}
                rules={{
                  required: 'Mã  giới thiệu không được trống'
                }}
                render={({ field }) => (
                  <Input.Text
                    {...field}
                    inputKey="affiliate"
                    isError={Object.keys(errors).includes('affiliate')}
                    autoFocus
                  />
                )}
              />
              <ErrorMessage
                name="affiliate"
                errors={errors}
                render={(data: { message: string }) => (
                  <p className="errorField absolute fs-16">{data?.message}</p>
                )}
              />
            </div>
          )}
          <div className="flex align-items-center justify-content-center">
            <Button.Solid
              className={`card-button ${progressSubmit ? 'disabled' : ''}`}
              content="Xác nhận"
              htmlType="submit"
            />
          </div>
        </form>
        {dataCardTitle.type !== 'active' && (
          <div className="text" style={{ textAlign: 'center', marginTop: 10 }}>
            Không có mã giới thiệu?{' '}
            <span
              className="text underline"
              onClick={() => {
                dispatch(actionSetAffiliate(false))
                handleTick()
              }}
            >
              Bỏ qua
            </span>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default React.memo(Affiliate)
