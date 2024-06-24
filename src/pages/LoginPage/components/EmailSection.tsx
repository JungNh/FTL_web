import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Button, Input } from '../../../components'

type Props = {
  setCurrentView: (
    view: 'email' | 'password' | 'forgotPassword' | 'register' | 'newPassword'
  ) => void
  onFinish: (values?: string) => void
  loading: boolean
}

type FormValues = {
  emailOrPhone: string
}

const EmailSection: React.FC<Props> = ({ setCurrentView, onFinish, loading }) => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormValues>()
  const onsubmit = (values: FormValues) => {
    onFinish(values.emailOrPhone.trim())
  }

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <h3 className="login__subtitle mb-3">
        Chưa có tài khoản?{' '}
        <span className="login__link mb-0" onClick={() => setCurrentView('register')}>
          Tạo tài khoản
        </span>
      </h3>
      <h3 className="label__form mb-3">Email hoặc số điện thoại</h3>
      <Controller
        name="emailOrPhone"
        control={control}
        defaultValue=""
        rules={{ required: 'Email hoặc số điện thoại không được trống' }}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            inputKey="emailOrPhone"
            value={value}
            onChange={onChange}
            placeholder="Số điện thoại hoặc Email"
            isError={Object.keys(errors).includes('emailOrPhone')}
            autoFocus
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
          content="Tiếp tục"
          type="submit"
          loading={loading}
        />
      </div>

      <div className="divider__horizontal mb-3" />

      <p className="version__no">
        Phiên bản: 240624 {sessionStorage.getItem('IS_DEV') === 'true' && '(DEV)'}
      </p>
    </form>
  )
}

export default EmailSection
