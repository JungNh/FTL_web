import { ErrorMessage } from '@hookform/error-message'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import avata from '../../../assets/images/avatar.png'
import { Button, Input } from '../../../components'

type Props = {
  loginAccount: any
  onFinish: (values: FormValues) => void
  loginOtherAcc: () => void
  setCurrentView: (
    view: 'email' | 'password' | 'forgotPassword' | 'register' | 'newPassword'
  ) => void
  loading: boolean
}

type FormValues = {
  password: string
}

const PaswordSection: React.FC<Props> = ({
  setCurrentView,
  loginAccount,
  onFinish,
  loginOtherAcc,
  loading,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>()

  const onFormSubmit = (values: FormValues) => {
    onFinish(values)
  }

  const forgotPass = () => {
    setCurrentView('forgotPassword')
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="user__group mb-3">
          <div className="avata__holder">
            <img className="avata__image" src={loginAccount?.avatar || avata} alt="avata__image" />
          </div>
          <p className="user__name mb-0">{loginAccount?.email}</p>
        </div>
        <h3 className="label__form mb-3">Mật khẩu</h3>
        <Controller
          control={control}
          name="password"
          defaultValue=""
          rules={{ required: 'Mật khẩu không được trống ' }}
          render={({ field: { value, onChange } }) => (
            <Input.Text
              inputKey="password"
              value={value}
              onChange={onChange}
              placeholder="Nhập mật khẩu"
              type="password"
              isError={Object.keys(errors || {}).includes('password')}
              autoFocus
            />
          )}
        />
        <ErrorMessage
          name="password"
          errors={errors}
          render={(data: { message?: string }) => <p className="errorField">{data?.message}</p>}
        />
        <div className="d-flex justify-content-end">
          <Button.Shadow
            className="login__button my-3"
            content="Đăng nhập"
            type="submit"
            loading={loading}
          />
        </div>

        <div className="divider__horizontal mb-3" />
        <p className="login__link mb-3" onClick={() => forgotPass()}>
          Quên mật khẩu
        </p>
        <p className="login__link mb-3" onClick={() => loginOtherAcc()}>
          Đăng nhập bằng tài khoản khác
        </p>
      </form>
    </div>
  )
}

export default PaswordSection
