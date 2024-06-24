import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Button, Input } from '../../../components'

type Props = {
  setCurrentView: (
    view: 'email' | 'password' | 'forgotPassword' | 'register' | 'newPassword'
  ) => void
  onFinish: (values: FormValues) => void
  loading: boolean
}

type FormValues = {
  password: string
  rePassword: string
  otp: string
}

const NewPasswordSection: React.FC<Props> = ({ setCurrentView, onFinish, loading }) => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormValues>()

  const onsubmit = (values: FormValues) => {
    onFinish(values)
  }

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <Controller
        name="otp"
        control={control}
        defaultValue=""
        rules={{ required: 'Mã xác nhận không được trống' }}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            value={value}
            onChange={onChange}
            className="my-3"
            placeholder="Mã xác nhận"
            isError={Object.keys(errors).includes('otp')}
          />
        )}
      />
      <ErrorMessage
        name="otp"
        errors={errors}
        render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
      />
      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{
          required: 'Mật khẩu không được trống',
          maxLength: { value: 30, message: 'Mật khẩu phải ít hơn 30 ký tự' },
          minLength: { value: 6, message: 'Mật khẩu phải dài hơn 6 ký tự' },
        }}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            value={value}
            onChange={onChange}
            className="my-3"
            type="password"
            placeholder="Mật khẩu mới"
            isError={Object.keys(errors).includes('password')}
          />
        )}
      />
      <ErrorMessage
        name="password"
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
            if (value === getValues('password')) {
              return
            }
            return 'Mật khẩu không trùng khớp'
          },
        }}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            value={value}
            onChange={onChange}
            className="my-3"
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
      <div className="w-100 d-flex justify-content-end">
        <Button.Shadow className="login__button my-3" content="Cập nhật" type="submit" />
      </div>
      <div className="divider__horizontal mb-3" />
      <h3 className="login__subtitle mb-3">
        Bạn đã có tài khoản?
        {' '}
        <span className="login__link mb-0" onClick={() => setCurrentView('email')}>
          Đăng nhập
        </span>
      </h3>
    </form>
  )
}

export default NewPasswordSection
