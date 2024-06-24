import { ErrorMessage } from '@hookform/error-message'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import _ from 'lodash'
import Swal from 'sweetalert2'
import { Button } from '../../../components'
import Input from '../../../components/Input'
import { actionRegisterAccount } from '../../../store/login/actions'

type Props = {
  setCurrentView: (view: 'email' | 'password' | 'register') => void
}

type FormType = {
  fullname: string
  email: string
  telephone: string
  password: string
  rePassword: string
}

const RegisterSection: React.FC<Props> = ({ setCurrentView }) => {
  const {
    handleSubmit,
    getValues,
    formState: { errors },
    control,
  } = useForm<FormType>()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const onFormSubmit = async (values: FormType) => {
    setLoading(true)
    const data: any = await dispatch(
      actionRegisterAccount({
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.password,
        fullname: values.fullname,
        telephone: values.telephone,
      })
    )
    setLoading(false)
    if (data?.code === 1) {
      Swal.fire('Đăng ký thành công', '', 'success')
        .then(() => {
          setCurrentView('email')
          return ''
        })
        .catch(() => '')
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Controller
        name="fullname"
        defaultValue=""
        rules={{ required: 'Họ và tên không được trống' }}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            value={value}
            onChange={onChange}
            className="mt-3"
            placeholder="Họ và tên"
            isError={Object.keys(errors).includes('fullname')}
          />
        )}
      />
      <ErrorMessage
        name="fullname"
        errors={errors}
        render={({ message }) => <p className="errorField">{message}</p>}
      />
      <Controller
        name="email"
        defaultValue=""
        rules={{ required: 'Email không được trống' }}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            value={value}
            onChange={onChange}
            // type="email"
            className="mt-3"
            placeholder="Nhập email"
            isError={Object.keys(errors).includes('email')}
          />
        )}
      />
      <ErrorMessage
        name="email"
        errors={errors}
        render={({ message }) => <p className="errorField">{message}</p>}
      />

      <Controller
        name="telephone"
        defaultValue=""
        rules={{
          required: 'Số điện thoại không được trống',
          validate: (value) => {
            // const regexString = new RegExp(/(84|0[1-9])+([0-9]{8,10})\b/)
            const regexString = new RegExp(/^[+]?[0-9]*$/)
            if (regexString.test(value) || !value) {
              return
            }
            return 'Số điện thoại chưa đúng định dạng'
          },
        }}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            value={value}
            onChange={onChange}
            maxLength={12}
            className="mt-3"
            placeholder="Nhập số điện thoại"
            isError={Object.keys(errors).includes('telephone')}
          />
        )}
      />
      <ErrorMessage
        name="telephone"
        errors={errors}
        render={({ message }) => <p className="errorField">{message}</p>}
      />

      <Controller
        control={control}
        name="password"
        defaultValue=""
        rules={{
          required: 'Mật khẩu không được trống',
          maxLength: {
            value: 30,
            message: 'Mật khẩu phải có ít nhất 6 ký tự và không quá 30 ký tự',
          },
          minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự và không quá 30 ký tự' },
        }}
        render={({ field: { value, onChange } }) => (
          <Input.Text
            value={value}
            onChange={onChange}
            className="mt-3"
            placeholder="Nhập mật khẩu"
            type="password"
            isError={Object.keys(errors).includes('password')}
          />
        )}
      />
      <ErrorMessage
        name="password"
        errors={errors}
        render={({ message }) => <p className="errorField">{message}</p>}
      />
      <Controller
        control={control}
        name="rePassword"
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
            className="mt-3"
            placeholder="Nhập lại mật khẩu"
            type="password"
            isError={Object.keys(errors).includes('rePassword')}
          />
        )}
      />
      <ErrorMessage
        name="rePassword"
        errors={errors}
        render={({ message }) => <p className="errorField">{message}</p>}
      />
      <div className="d-flex justify-content-end">
        <Button.Shadow
          className="login__button mt-3"
          content="Đăng ký"
          type="submit"
          loading={loading}
        />
      </div>
      <div className="rule__text--container text-center my-3">
        Bằng việc đăng ký bạn đã đồng ý với các&nbsp;
        <span className="rule__text mb-0" onClick={() => setCurrentView('email')}>
          điều khoản
        </span>
        &nbsp;và&nbsp;
        <span className="rule__text mb-0" onClick={() => setCurrentView('email')}>
          chính sách bảo mật thông tin
        </span>
      </div>

      <div className="divider__horizontal mb-3" />
      <h3 className="text-center login__subtitle mb-3">
        Bạn đã có tài khoản?
        {' '}
        <span className="login__link mb-0" onClick={() => setCurrentView('email')}>
          Đăng nhập
        </span>
      </h3>
    </form>
  )
}

export default RegisterSection
