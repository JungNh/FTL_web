import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useEffect } from 'react'
import { Button, Input } from '../../../components'

type Props = {
  setCurrentView: (
    view: 'email' | 'password' | 'forgotPassword' | 'register' | 'newPassword'
  ) => void
  onFinish: (values?: string) => void
  initEmail: string
  loading: boolean
}

type FormValues = {
  emailOrPhone: string
}

const ForgotPassSection: React.FC<Props> = ({ setCurrentView, onFinish, loading, initEmail }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm<FormValues>()

  const onsubmit = (values: FormValues) => {
    onFinish(values.emailOrPhone.trim())
  }

  useEffect(() => {
    if (initEmail) {
      setValue('emailOrPhone', initEmail)
    }
  }, [initEmail, setValue])

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <h3 className="label__form mb-3">Vui lòng nhập Email để lấy lại mật khẩu</h3>
      <Controller
        name="emailOrPhone"
        control={control}
        defaultValue=""
        rules={{ required: 'Email không được trống' }}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            value={value}
            onChange={onChange}
            placeholder="Nhâp Email"
            isError={Object.keys(errors).includes('emailOrPhone')}
          />
        )}
      />
      <ErrorMessage
        name="emailOrPhone"
        errors={errors}
        render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
      />
      <div className="w-100 d-flex justify-content-end">
        <Button.Shadow
          className="login__button my-3"
          content="Gửi mã xác nhận"
          type="submit"
          loading={loading}
        />
      </div>
      <div className="divider__horizontal mb-3" />
      <h3 className="text-center login__subtitle mb-3">
        Bạn đã có tài khoản?{' '}
        <span className="login__link mb-0" onClick={() => setCurrentView('email')}>
          Đăng nhập
        </span>
      </h3>
    </form>
  )
}

export default ForgotPassSection
