import React, { useCallback, useState } from 'react'
import { Button } from '../../components'
import './styles.scss'
import ContainerWithBack from '../../components/ContainerWithBack'
import TextInputContainer from './components/TextInputContainer'
import { FaUser } from 'react-icons/fa'
import { FiCheckCircle } from 'react-icons/fi'
import { FaPhoneVolume } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { FaKey } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { apiCore } from '../../lib-core'
import { useHistory } from 'react-router'

type Form = {
  fullname?: string | undefined
  email?: string | undefined
  phone?: string | undefined
  password?: string | undefined
}

enum TYPE_FIELDS {
  fullname = 'fullname',
  email = 'email',
  phone = 'phone',
  password = 'password'
}

type InputField = {
  title: string
  placeholder: string
  icon: JSX.Element
  field: TYPE_FIELDS
  required: boolean
  background?: string
  ispassword?: boolean
  disable?: boolean
}

const UpdateProfileVitaPage = () => {
  const userInfoCore = useSelector((state: RootState) => state.login.userInfoCore)
  const [form, setForm] = useState<Form>({
    email: userInfoCore.email,
    fullname: userInfoCore.fullname,
    phone: userInfoCore.telephone
  })
  const history = useHistory()

  const onChangeText = useCallback((value: string, keyname: TYPE_FIELDS) => {
    setForm((prevForm) => ({
      ...prevForm,
      [keyname]: value
    }))
  }, [])
  console.log(userInfoCore, 'userInfoCore')

  const inputFields: InputField[] = [
    {
      title: 'Họ và tên của bạn',
      placeholder: 'Nhập họ và tên',
      icon: <FaUser />,
      field: TYPE_FIELDS.fullname,
      required: true,
      disable: form && form?.fullname ? true : false
    },
    {
      title: 'Số điện thoại của bạn',
      placeholder: 'Nhập số điện thoại của bạn',
      icon: <FaPhoneVolume />,
      field: TYPE_FIELDS.phone,
      required: true,
      background: '#EEFAFF',
      disable: form && form?.phone ? true : false
    },
    {
      title: 'Email của bạn',
      placeholder: 'Nhập email của bạn',
      icon: <MdEmail />,
      field: TYPE_FIELDS.email,
      required: true,
      background: '#EEFAFF',
      disable: form && form?.email ? true : false
    },
    {
      title: 'Nhập mật khẩu mới',
      placeholder: 'Nhập mật khẩu mới',
      icon: <FaKey />,
      field: TYPE_FIELDS.password,
      required: true,
      background: '#EEFAFF',
      ispassword: true,
      disable: false
    }
  ]

  const handleSubmit = async () => {
    const body = {
      password: form.password,
      fullname: form.fullname,
      phone: form.phone,
      email: form.email
    }
    history.push({
      pathname: '/update-profile',
      state: {
        formCAS: body
      }
    })
  }

  return (
    <ContainerWithBack>
      <div className="container-update_profile">
        <div className="contestrule__component">
          <div className="header">
            <h2 className="content-title">Cập nhật thông tin tài khoản FutureLang</h2>
          </div>
        </div>
        <div className="content-form">
          {inputFields.map((input) => (
            <TextInputContainer
              key={input.field}
              title={input.title}
              placeholder={input.placeholder}
              iconLeftElement={input.icon}
              value={form[input.field]}
              onChangeText={(value: { target: { value: string } }) =>
                onChangeText(value.target.value, input.field)
              }
              required={input.required}
              background={input.disable ? '#E9E9E9' : input.background}
              ispassword={input.ispassword}
              disable={input.disable}
            />
          ))}
        </div>
        <div className="navbar__components">
          <Button.Solid
            className="navbar__btn button_action"
            onClick={handleSubmit}
            content={
              <div className="flex justify-content-center align-items-center fw-bold">
                <FiCheckCircle className="me-2 fs-24 icon_button" />
                TIẾP TỤC
              </div>
            }
          />
        </div>
      </div>
    </ContainerWithBack>
  )
}

export default React.memo(UpdateProfileVitaPage)
