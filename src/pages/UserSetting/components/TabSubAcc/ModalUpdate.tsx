import React, { FC, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal } from 'react-bootstrap'
import _ from 'lodash'
import { ErrorMessage } from '@hookform/error-message'
import { useDispatch } from 'react-redux'
import DatePicker from 'react-datepicker'
import { format, sub } from 'date-fns'
import { Button, Input } from '../../../../components'
import { actionUpdateSubAcc } from '../../../../store/settings/actions'
import { actionUserMe } from '../../../../store/login/actions'

type Props = {
  isVisible: boolean
  onClose: () => void
  userInfo: any
}

type FormValues = {
  fullname: string
  dob: Date
}

const ModalUpdate: FC<Props> = ({ isVisible, onClose, userInfo }) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    clearErrors
  } = useForm<FormValues>({})
  const dispatch = useDispatch()
  useEffect(() => {
    if (!_.isEmpty(userInfo)) {
      setValue('fullname', userInfo?.fullname)
      setValue('dob', new Date(userInfo?.dob || ''))
      clearErrors()
    }
  }, [clearErrors, setValue, userInfo])
  console.log('ModalUpdate')

  const onsubmit = async (values: FormValues) => {
    const dataAcct: any = await dispatch(
      actionUpdateSubAcc({
        accountId: userInfo?.id,
        data: {
          ...(userInfo || {}),
          fullname: values?.fullname || '',
          dob: format(values?.dob || '', 'yyyy-MM-dd')
        }
      })
    )
    if (!_.isEmpty(dataAcct) && dataAcct?.status === 200) {
      const response: any = await dispatch(actionUserMe())
      if (response?.status === 200 && response?.data) {
        onClose()
      }
    }
  }

  return (
    <Modal show={isVisible} onHide={() => onClose()} dialogClassName="modal__user" centered>
      <Modal.Body>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="mb-3">
            <p className="small mb-0 fw-bold">Tên hiển thị</p>

            <Controller
              name="fullname"
              control={control}
              defaultValue=""
              rules={{ required: 'Tên hiển thị không được trống' }}
              render={({ field: { value, onChange } }) => (
                <Input.Text
                  inputKey="fullname"
                  value={value}
                  onChange={onChange}
                  placeholder="Tên hiển thị"
                  isError={Object.keys(errors).includes('fullname')}
                  autoFocus
                />
              )}
            />
            <ErrorMessage
              name="fullname"
              errors={errors}
              render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
            />
          </div>
          <div className="mb-3">
            <p className="small mb-0 fw-bold">Ngày sinh</p>
            <Controller
              name="dob"
              control={control}
              rules={{ required: 'Ngày sinh không được trống' }}
              render={({ field: { value, onChange } }) => (
                <DatePicker
                  className="custome_datepicker"
                  selected={value}
                  onChange={() => onChange}
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
          </div>
          <div className="d-flex align-items-center">
            <Button.Solid
              className="btn__cancel me-3"
              content="Hủy bỏ"
              style={{ width: '7rem' }}
              onClick={() => onClose()}
            />
            <Button.Solid
              className="btn__save"
              content="Lưu"
              style={{ color: 'white', width: '7rem' }}
              htmlType="submit"
            />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ModalUpdate
