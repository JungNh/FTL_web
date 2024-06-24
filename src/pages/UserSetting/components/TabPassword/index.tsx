import { ErrorMessage } from '@hookform/error-message'
import _ from 'lodash'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Button, Input } from '../../../../components'
import { actionChangePassword } from '../../../../store/settings/actions'
import { openSuccess, openError } from '../../../../utils/common'
import { borderRadius } from 'polished'

type Props = Record<string, unknown>
type FormValues = {
  oldPassword: string
  newPassword: string
  rePassword: string
}
const TabInfo: React.FC<Props> = () => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors }
  } = useForm<FormValues>()
  const dispatch = useDispatch()

  const validate = (input: string) => {
    if (/^\s/.test(input)) input = ''
  }

  const onsubmit = async (values: FormValues) => {
    if (values?.newPassword == values?.oldPassword) {
      openError('Mật khẩu hiện tại và mật khẩu mới trùng nhau')
    } else {
      const resultData: any = await dispatch(
        actionChangePassword({
          newPassword: values?.newPassword,
          oldPassword: values?.oldPassword
        })
      )
      if (!_.isEmpty(resultData) && resultData?.status === 200) {
        openSuccess('Bạn đã đổi mật khẩu thành công')
      } else {
        openError('Đổi mật khẩu thất bại')
      }
    }
  }

  return (
    <div className="tab__password">
      <p className="h4 fw-bold" style={{ textAlign: 'center' }}>
        Đổi mật khẩu
      </p>
      <div className="tab__wrap">
        <form onSubmit={handleSubmit(onsubmit)}>
          <Controller
            name="oldPassword"
            control={control}
            defaultValue=""
            rules={{ required: 'Mật khẩu cũ không được trống' }}
            render={({ field: { value, onChange } }) => (
              <Input.Text
                value={value}
                onChange={onChange}
                type="password"
                className="my-3 custom__input"
                placeholder="Mật khẩu cũ"
                isError={Object.keys(errors).includes('oldPassword')}
              />
            )}
          />
          <ErrorMessage
            name="oldPassword"
            errors={errors}
            render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
          />
          <Controller
            name="newPassword"
            control={control}
            defaultValue=""
            rules={{
              required: 'Mật khẩu không được trống',
              maxLength: { value: 30, message: 'Mật khẩu phải ít hơn 30 ký tự' },
              minLength: { value: 6, message: 'Mật khẩu phải dài hơn 6 ký tự' }
            }}
            render={({ field: { value, onChange } }) => (
              <Input.Text
                value={value}
                onChange={onChange}
                className="my-3 custom__input"
                type="password"
                placeholder="Mật khẩu mới"
                isError={Object.keys(errors).includes('newPassword')}
              />
            )}
          />
          <ErrorMessage
            name="newPassword"
            errors={errors}
            render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
          />
          <Controller
            name="rePassword"
            control={control}
            defaultValue=""
            rules={{
              required: 'Mật khẩu không được trống',
              validate: (value) => {
                if (value === getValues('newPassword')) {
                  return
                }
                return 'Mật khẩu không trùng khớp'
              }
            }}
            render={({ field: { value, onChange } }) => (
              <Input.Text
                value={value}
                onChange={onChange}
                className="my-3 custom__input"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                isError={Object.keys(errors).includes('rePassword')}
              />
            )}
          />
          <ErrorMessage
            name="rePassword"
            errors={errors}
            render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
          />
          <div className="w-100">
            <Button.Shadow
              className="login__button my-3"
              style={{ borderRadius: 15 }}
              content="Cập nhật"
              type="submit"
              onClick={() => {}}
              // loading={loading}
              block
            />
          </div>
        </form>
      </div>
    </div>
  )
}
export default TabInfo
