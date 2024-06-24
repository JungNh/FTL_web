import { ErrorMessage } from '@hookform/error-message'
import React, { FC, useState } from 'react'
import { Form, Modal, Image } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import DatePicker from 'react-datepicker'
import Swal from 'sweetalert2'
import { format, sub } from 'date-fns'
import { Button, Input } from '../../../../components'
import avataPlaceholder from '../../../../assets/images/avata.jpg'
import ico_upload from '../../../../assets/images/ico_upload-gray.svg'
import { actionCreateAccounts, actionUploadImage } from '../../../../store/settings/actions'
import { hideLoading, showLoading } from '../../../../store/login/actions'

type Props = {
  isShow: boolean
  closeModal: () => void
}

type FormValues = {
  fullname: string
  dob: Date
  sex: string
}

const ModalCreateAcc: FC<Props> = ({ isShow, closeModal }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormValues>()
  const [avata, setAvata] = useState<string | null>(null)
  const dispatch = useDispatch()
  const onCloseModal = () => {
    setAvata(null)
    reset()
    clearErrors()
    closeModal()
  }
  console.log('ModalCreateAcc')
  const onsubmit = async (values: FormValues) => {
    if (!avata) {
      Swal.fire('Tài khoản chưa có ảnh', '', 'warning')
      return
    }
    dispatch(showLoading())
    const response: any = await dispatch(
      actionCreateAccounts({
        avatar: avata || '',
        fullname: values.fullname,
        sex: values.sex,
        dob: format(values?.dob || '', 'yyyy-MM-dd'),
      })
    )
    if (response?.status === 200) {
      Swal.fire('Tạo tài khoản thành công', '', 'success')
      onCloseModal()
    }
    dispatch(hideLoading())
  }

  const uploadFile = async (files: any) => {
    if (files[0]) {
      dispatch(showLoading())
      const response: any = await dispatch(actionUploadImage(files[0]))
      if (response?.data?.url) {
        setAvata(response?.data?.url)
      }
      dispatch(hideLoading())
    }
  }

  return (
    <Modal
      // size="lg"
      className="modal_create_acc"
      show={isShow}
      onHide={() => onCloseModal()}
      centered
    >
      <Modal.Header>
        <div className="modal__header--title">Thêm tài khoản</div>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center mb-5">
          <Image src={avata || avataPlaceholder} className="avatar__image" roundedCircle />
          <label htmlFor="avata_input">
            <Image src={ico_upload} className="avata_holder--upload" rounded />
          </label>
          <input
            id="avata_input"
            type="file"
            onChange={(event: any) => uploadFile(event?.target?.files)}
            className="input__avata"
          />
        </div>

        <form onSubmit={handleSubmit(onsubmit)}>
          <p className="form__label">Họ và tên</p>
          <Controller
            name="fullname"
            control={control}
            defaultValue=""
            rules={{ required: 'Họ và tên không được trống' }}
            render={({ field: { value, onChange } }) => (
              <Input.Text
                value={value}
                onChange={onChange}
                className="my-3"
                placeholder="Họ và tên"
                isError={Object.keys(errors).includes('otp')}
              />
            )}
          />
          <ErrorMessage
            name="fullname"
            errors={errors}
            render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
          />

          <p className="form__label">Ngày sinh</p>
          <Controller
            name="dob"
            control={control}
            rules={{ required: 'Ngày sinh không được trống' }}
            render={({ field: { value, onChange } }) => (
              <DatePicker
                className="custome_datepicker"
                selected={value}
                onChange={()=>onChange}
                dateFormat="dd/MM/yyyy"
                maxDate={sub(new Date(), { days: 1 })}
                wrapperClassName="custome_datepicker-wrapper"
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dropdownMode="select"
              />
            )}
          />
          <ErrorMessage
            name="dob"
            errors={errors}
            render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
          />

          <div>
            <p className="form__label my-3">Giới tính</p>
            <Controller
              name="sex"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange } }) => (
                <Form.Check
                  inline
                  checked={value === 'M'}
                  onChange={() => onChange('M')}
                  label="Nam"
                  name="sex"
                  type="radio"
                  id="inline-radio-1"
                />
              )}
            />
            <Controller
              name="sex"
              control={control}
              defaultValue=""
              render={({ field: { value, onChange } }) => (
                <Form.Check
                  inline
                  checked={value === 'F'}
                  onChange={() => onChange('F')}
                  label="Nữ"
                  name="sex"
                  type="radio"
                  id="inline-radio-2"
                />
              )}
            />
          </div>

          {/* <ErrorMessage
            name="sex"
            errors={errors}
            render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
          /> */}
          <div className="w-100 d-flex justify-content-end">
            <Button.Shadow className="login__button my-3" content="Tạo tài khoản" type="submit" />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ModalCreateAcc
