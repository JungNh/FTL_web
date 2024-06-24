import { ErrorMessage } from '@hookform/error-message'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { AiOutlineClose } from 'react-icons/ai'
import { IoClose } from 'react-icons/io5'
import Swal from 'sweetalert2'
import RobotCardCode from '../../../assets/images/robot_card_code.svg'
import { Button, Input } from '../../../components'
import { apiCore } from '../../../lib-core'
import './style.scss'
import { useDispatch } from 'react-redux'
import { actionUserMe } from '../../../store/login/actions'
import { saveListPurchase } from '../../../store/study/actions'

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
        <span className="title">Bạn chưa kích hoạt mã thẻ nào.</span>
        <span className="title">Vui lòng nhập mã kích hoạt!</span>
      </div>
    )
  }
  if (dataCardTitle.type === 'expired') {
    return (
      <div className="card-title">
        <span className="title">Thẻ của bạn đã hết hạn.</span>
        <span className="title">Vui lòng nhập mã kích hoạt!</span>
      </div>
    )
  }
  if (dataCardTitle.type === 'active') {
    return (
      <div className="card-title">
        <span className="title"> </span>
        <span className="title">Nhập mã kích hoạt</span>
      </div>
    )
  }
  return (
    <div className="card-title">
      <span className="title error">{dataCardTitle.message}.</span>
      <span className="title">Vui lòng nhập lại mã!</span>
    </div>
  )
}

interface Props {
  dataCardCode: any
  handleClose: () => void
  reLoadData: any
  courseId?: number
}

interface FormValues {
  cardCode: string
}

const CardCode = ({ dataCardCode, handleClose, reLoadData, courseId }: Props) => {
  const [dataCardTitle, setDataCardTitle] = useState({
    type: 'notfound',
    message: ''
  })

  const dispatch = useDispatch()

  const getPurchase = async () => {
    const coursePurchased = await apiCore.post('/course/purchased')
    dispatch(saveListPurchase(coursePurchased.data))
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormValues>()

  const handleSubmitNewCard = async (values: any) => {
    try {
      const response = await apiCore.post('/studentcardcodes/active', values)
      if (!_.isEmpty(response?.data)) {
        handleClose()
        reset()
        Swal.fire({
          title: 'Kích hoạt thẻ thành công',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false
        })
        getPurchase()
        reLoadData(courseId ? courseId : 0)
      }
    } catch (error: any) {
      const message = GetMessageError(error?.message)
      const type = 'error'
      setDataCardTitle({
        type,
        message
      })
    }
  }

  const handleSubmitOldCard = async (values: any) => {
    try {
      const response = await apiCore.post('/studentcardcodes/old-active', values)
      if (!_.isEmpty(response?.data)) {
        handleClose()
        reset()
        getPurchase()
        await dispatch(actionUserMe())
        if (response.data?.affiliate == 'CHECK_MAIL_TO_ACTIVE') {
          Swal.fire({
            title: 'Kích hoạt thẻ thành công. Vui lòng check mail để xác nhận mã thẻ.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            allowOutsideClick: false
          })
        } else {
          Swal.fire({
            title: 'Kích hoạt thẻ thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            allowOutsideClick: false
          })
        }
        reLoadData(courseId ? courseId : 0)
      }
    } catch (error: any) {
      const message = GetMessageError(error?.message)
      const type = 'error'
      if (error?.message === 'CARD_CODE_DOES_NOT_EXIST') await handleSubmitNewCard(values)
      else {
        setDataCardTitle({
          type,
          message
        })
      }
    }
  }

  const onsubmit = async (values: FormValues) => {
    await handleSubmitOldCard(values)
  }

  useEffect(() => {
    if (dataCardCode?.status === 0) setDataCardTitle({ ...dataCardCode, type: 'notfound' })
    if (dataCardCode?.status === 1) setDataCardTitle({ ...dataCardCode, type: 'expired' })
    if (dataCardCode?.status === 'active') setDataCardTitle({ ...dataCardCode, type: 'active' })
  }, [dataCardCode])

  return (
    <Modal
      show={dataCardCode.isOpen}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body className="relative">
        <div className="mb-60px text-right">
          <img
            className="absolute robot"
            src={RobotCardCode}
            alt="robot"
            width={201}
            height={201}
          />
          <IoClose
            onClick={() => {
              handleClose()
              reset()
            }}
            className="icon-close"
          />
        </div>
        <CardTitle dataCardTitle={dataCardTitle} />
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="mb-4 relative">
            <Controller
              name="cardCode"
              control={control}
              rules={{
                required: 'Mã thẻ không được trống',
                maxLength: {
                  value: 14,
                  message: 'Mã thẻ không được quá 14 ký tự'
                },
                minLength: {
                  value: 6,
                  message: 'Mã thẻ không được ít hơn 6 ký tự'
                }
              }}
              render={({ field }) => (
                <Input.Text
                  {...field}
                  inputKey="cardCode"
                  placeholder="FLG-000-AAA"
                  isError={Object.keys(errors).includes('cardCode')}
                  autoFocus
                />
              )}
            />
            <ErrorMessage
              name="cardCode"
              errors={errors}
              render={(data: { message: string }) => (
                <p className="errorField absolute fs-16">{data?.message}</p>
              )}
            />
          </div>
          <div className="flex align-items-center justify-content-center">
            <Button.Solid className="card-button" content="Kích hoạt" htmlType="submit" />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default React.memo(CardCode)
