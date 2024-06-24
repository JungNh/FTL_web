import * as React from 'react'
import _ from 'lodash'
import './styles.scss'
import { useState } from 'react'

import PopupContainer from '../../../../components/PopupContainer'
import Button from '../../../../components/Button'

import warning from '../../../../assets/images/warning.png'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { apiCore } from '../../../../lib-core'
import Swal from 'sweetalert2'
import { actionUserMe, actionUserMeCore } from '../../../../store/login/actions'
import { openError } from '../../../../utils/common'
import moment from 'moment'
import {
  actionGetDataDistricts,
  actionGetDataLevels,
  actionGetDataProvinces,
  actionGetDataSchools
} from '../../../../store/home/actions'
import { Input } from '../../../../components'
import { ErrorMessage } from '@hookform/error-message'
import ReactDatePicker from 'react-datepicker'
import { sub } from 'date-fns'
import Select from 'react-select'
import { BsGenderAmbiguous } from 'react-icons/bs'
import { FaMapMarkedAlt, FaMapMarkerAlt, FaSchool } from 'react-icons/fa'
import { IoSchoolSharp } from 'react-icons/io5'
import InputText from '../../../../components/Input/InputText'
import { contestRegistration } from '../../../../store/arena/actions'
import { ContestType } from '../../../../utils/enums'
import { RootState } from '../../../../store'

type Props = {
  open?: boolean
  questions?: Question[]
  onClose?: any
  onSubmit?: any
  handleLoginCourse?: any
  setShowModal?: any
  userInfo?: any
  formUser?: any
  isVisible?: boolean
  setPopupSubmit?: any
  setFormUser?: any
  setPopUpdateInfo?: any
  setDisplayPopupNoti?: any
  ischeckTypeCode?: boolean
  code?: string
  statusBtn?: string
  handleUpcoming?: any
  dataItem?: any
}

type FormValues = {
  fullname: string
  dob: string
  provinceId: any
  schoolLevel: any
  districtId: any
  schoolId: any
  sex: any
  // class: any
}

let dataSchool: any[] = []
let idProvince: any[] = []
let idDistrict: any
let idSchoolLevel: any
let dataClass: any
const customStyles = {
  control: (styles: any) => ({ ...styles, backgroundColor: '#EEEEEE', border: 'none' })
}

const PopupFormUser: React.FC<Props> = ({
  open,
  onClose,
  userInfo,
  handleLoginCourse,
  setFormUser,
  formUser,
  isVisible,
  statusBtn,
  handleUpcoming,
  setPopupSubmit,
  ischeckTypeCode,
  code = '',
  dataItem
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    clearErrors,
    watch,
    resetField
  } = useForm<FormValues>()
  const dispatch = useDispatch()

  const watchProvince = watch('provinceId')
  // const watchClass = watch('class')
  const watchDistrict = watch('districtId')
  const watchSchoolLevel = watch('schoolLevel')
  const watchDataSchool = watch(['provinceId', 'districtId', 'schoolLevel'])
  const [loading, setLoading] = useState<boolean>(false)
  const { tab_option } = useSelector((state: RootState) => state.arena)
  const [selected, setSelected] = useState<any>('')
  const {
    provinces: optionsProvince,
    levels,
    districts: DistrictsParams,
    schools
  } = useSelector((state: any) => state.home)

  const [selectedOption, setSelectedOption] = useState<any>(null)

  // React.useEffect(() => {
  //   setSelectedOption({ value: 58646, label: '---- Trường khác ----' })
  // }, [])
  // console.log(ischeckTypeCode, 'ischeckTypeCode')

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    onClose()
    const req = {
      ...values,
      provinceId: values.provinceId.value,
      districtId: values.districtId.value,
      schoolLevel: values.schoolLevel.value,
      schoolId: values.schoolId?.value || 0,
      sex: values.sex.value,
      service: 'arena'
      // class: values?.class || ''
    }

    try {
      const response = await apiCore.put(`/user/update`, req)
      setLoading(false)
      if (response?.data) {
        // setDisplayPopupNoti(false)
        onClose()
        Swal.fire({
          title: 'Cập nhật thành công',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false
        }).then(async () => {
          try {
            onClose()
            const res: any = await dispatch(actionUserMe())
            dispatch(actionUserMeCore())
            if (res?.status === 200 && res?.data) {
              // onClose()
              if (code === '') {
                if (tab_option == ContestType.HAPPENNING) {
                  handleLoginCourse()
                } else if (tab_option == ContestType.UPCOMING) {
                  handleUpcoming()
                }
              } else if (ischeckTypeCode) {
                onClose()
                // setFormUser(false)
                // setPopupSubmit(true)
              } else {
                onClose()

                // setFormUser(false)
                // setPopupSubmit(true)
              }
            }
          } catch (error) {
            if (error instanceof Error) openError(error.message)
          }
        })
      }
    } catch (error) {
      setLoading(false)
      onClose()
      if (error instanceof Error) openError(error.message)
    }
  }

  React.useEffect(() => {
    try {
      if (!_.isEmpty(userInfo)) {
        setValue('fullname', userInfo?.fullname)
        setValue('dob', moment(new Date(userInfo?.dob)).format('YYYY-MM-DD'))
        setValue('provinceId', { value: userInfo?.province?.id, label: userInfo?.province?.name })
        setValue('schoolLevel', {
          value: userInfo?.school_level?.id,
          label: userInfo?.school_level?.name
        })
        // setValue('class', userInfo?.class)
        setValue('districtId', { value: userInfo?.district?.id, label: userInfo?.district?.name })
        setValue(
          'schoolId',
          (userInfo?.school?.id && {
            value: userInfo?.school?.id,
            label: userInfo?.school?.name
          }) ||
            undefined
        )
        setValue('sex', {
          value: userInfo?.sex,
          label: userInfo?.sex === 'M' ? 'Nam' : userInfo?.sex === 'F' ? 'Nữ' : 'Khác'
        })
        clearErrors()
      }
    } catch (error) {
      console.error(error)
    }
  }, [userInfo])

  React.useEffect(() => {
    if (optionsProvince.length === 0) dispatch(actionGetDataProvinces())
    if (levels.length === 0) dispatch(actionGetDataLevels())
  }, [])

  React.useEffect(() => {
    if (isVisible) {
      let flag =
        dataSchool.length === watchDataSchool.length &&
        watchDataSchool.every((item, index) => item?.value === dataSchool[index]?.value)
      if (!flag) {
        if (watchDataSchool.every((item) => item !== undefined))
          if (watchDataSchool[2].label !== 'Sinh viên/Người đi làm')
            dispatch(
              actionGetDataSchools({
                province_id: watchDataSchool[0].value,
                district_id: watchDataSchool[1].value,
                school_level: watchDataSchool[2].value
              })
            )
          else setValue('schoolId', { value: 0, label: '' })
        dataSchool = watchDataSchool
      }
    }
  }, [])

  React.useEffect(() => {
    if (!_.isEmpty(watchProvince) && watchProvince?.value !== idProvince) {
      resetField('districtId', {
        defaultValue: ''
      })
      resetField('schoolId', {
        defaultValue: ''
      })
      idProvince = watchProvince?.value
    }

    if (!_.isEmpty(watchDistrict) && watchDistrict?.value !== idDistrict) {
      resetField('schoolId', {
        defaultValue: ''
      })
      idDistrict = watchDistrict.value
    }
    if (!_.isEmpty(watchSchoolLevel) && watchSchoolLevel.value !== idSchoolLevel) {
      resetField('schoolId', {
        defaultValue: ''
      })
      idSchoolLevel = watchSchoolLevel.value
    }
    // if (!_.isEmpty(watchClass)) {
    //   dataClass = watchClass
    // }
  }, [watchProvince, watchDistrict, watchSchoolLevel, resetField])

  // TODO: Handle trường hợp nhập code
  const [valueCode, setValueCode] = useState<string>('')
  const [reqInput, setReqInput] = useState<boolean>(false)
  const [change, setChange] = useState<boolean>(false)
  React.useEffect(() => {
    if (valueCode !== '') {
      setReqInput(false)
    }
  }, [valueCode])

  React.useEffect(() => {
    if (watchProvince?.value > 0) {
      dispatch(actionGetDataDistricts({ province_id: watchProvince?.value }))
    }
  }, [])

  React.useEffect(() => {
    if (watchProvince?.value) {
      dispatch(actionGetDataDistricts({ province_id: watchProvince.value }))
    }
    if (watchDistrict?.value && watchDataSchool) {
      dispatch(
        actionGetDataSchools({
          province_id: watchDataSchool[0].value,
          district_id: watchDistrict?.value,
          school_level: watchDataSchool[2].value
        })
      )
    }
  }, [watchProvince, watchDistrict])

  return open ? (
    <PopupContainer withClose={false}>
      <div className="formSubmit">
        <>
          <div onClick={onClose}>
            <div className="popupcontainer__close">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.2034 2.67773L2.52545 13.3557"
                  stroke="#444444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.52545 2.67773L13.2034 13.3557"
                  stroke="#444444"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="header">Sửa thông tin</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <p className="small mb-0 fw-bold">Tên hiển thị</p>

              <Controller
                name="fullname"
                control={control}
                defaultValue=""
                rules={{ required: 'Bạn vui lòng điền Họ tên!' }}
                render={({ field: { value, onChange } }) => (
                  <Input.Text
                    inputKey="fullname"
                    value={value}
                    onChange={onChange}
                    placeholder="Họ tên "
                    isError={Object.keys(errors).includes('fullname')}
                  />
                )}
              />
              <ErrorMessage
                name="fullname"
                errors={errors}
                render={(data: { message: string }) => (
                  <p className="errorField">{data?.message}</p>
                )}
              />
            </div>

            <div className="mb-3">
              <p className="small mb-0 fw-bold">Tỉnh/ Thành phố</p>
              <Controller
                name="provinceId"
                control={control}
                rules={{ required: 'Bạn vui lòng chọn Tỉnh/ Thành phố!' }}
                render={({ field: { value, onChange } }: any) => {
                  return (
                    <Select
                      value={value}
                      onChange={(object: any) => {
                        if (object.value && value?.value !== object.value)
                          dispatch(actionGetDataDistricts({ province_id: object.value }))
                        resetField('schoolId', {
                          defaultValue: ''
                        })
                        setSelectedOption({ value: -1, label: '' })
                        onChange(object)
                      }}
                      options={optionsProvince}
                      styles={customStyles}
                      placeholder={
                        <div className="flex align-items-center px-1">
                          <FaMapMarkedAlt className="fs-20 mr-3" />
                          <span>Tỉnh/Thành phố</span>
                        </div>
                      }
                    />
                  )
                }}
              />
              <ErrorMessage
                name="provinceId"
                errors={errors}
                render={(data: { message: string }) => (
                  <p className="errorField">{data?.message}</p>
                )}
              />
            </div>
            <div className="mb-3">
              <p className="small mb-0 fw-bold">Cấp</p>
              <Controller
                name="schoolLevel"
                control={control}
                rules={{ required: 'Bạn vui lòng chọn Cấp học!' }}
                render={({ field }) => {
                  setSelected(field.value)
                  return (
                    <Select
                      {...field}
                      options={levels}
                      styles={customStyles}
                      placeholder={
                        <div className="flex align-items-center px-1">
                          <IoSchoolSharp className="fs-20 mr-3" />
                          <span>Cấp</span>
                        </div>
                      }
                    />
                  )
                }}
              />
              <ErrorMessage
                name="schoolLevel"
                errors={errors}
                render={(data: { message: string }) => (
                  <p className="errorField fs-16">{data?.message}</p>
                )}
              />
            </div>
            <div className="mb-3">
              <p className="small mb-0 fw-bold">Quận/Huyện</p>
              <Controller
                name="districtId"
                control={control}
                rules={{ required: 'Bạn vui lòng chọn Quận/Huyện!' }}
                render={({ field: { value, onChange } }: any) => {
                  return (
                    <Select
                      value={value}
                      options={DistrictsParams}
                      styles={customStyles}
                      placeholder={
                        <div className="flex align-items-center px-1">
                          <FaMapMarkerAlt className="fs-20 mr-3" />
                          <span>Quận/Huyện</span>
                        </div>
                      }
                      onChange={(object: any) => {
                        console.log(object, 'object')

                        if (object.value && value?.value !== object.value)
                          dispatch(
                            actionGetDataSchools({
                              province_id: watchDataSchool[0].value,
                              district_id: object.value,
                              school_level: watchDataSchool[2].value
                            })
                          )
                        onChange(object)
                      }}
                    />
                  )
                }}
              />
              <ErrorMessage
                name="districtId"
                errors={errors}
                render={(data: { message: string }) => (
                  <p className="errorField fs-16">{data?.message}</p>
                )}
              />
            </div>
            {selected?.value === '99' || selected?.label === 'Sinh viên/Người đi làm' ? null : (
              <div className="mb-3">
                <p className="small mb-0 fw-bold">Trường</p>
                <Controller
                  name="schoolId"
                  control={control}
                  // rules={{ required: 'Bạn vui lòng chọn Trường!' }}
                  render={({ field: { value, onChange } }: any) => {
                    console.log(value, 'value')

                    return (
                      <Select
                        value={value}
                        // onChange={setSelectedOption}
                        onChange={(object: any) => {
                          onChange(object)
                        }}
                        // options={[{ value: 58646, label: '---- Trường khác ----' }].concat(schools)}
                        options={schools}
                        styles={customStyles}
                        placeholder={
                          <div className="flex align-items-center px-1">
                            <FaSchool className="fs-20 mr-3" />
                            <span>Trường</span>
                          </div>
                        }
                      />
                    )
                  }}
                />
                <ErrorMessage
                  name="schoolId"
                  errors={errors}
                  render={(data: { message: string }) => (
                    <p className="errorField fs-16 absolute">{data?.message}</p>
                  )}
                />
              </div>
            )}

            <Button.Solid
              className="btn__save footer_btn"
              content={loading ? 'Loading ...' : 'Lưu'}
              style={{ color: 'white', width: '7rem' }}
              htmlType="submit"
              // onClick={() => setDisplayPopupNoti(false)}
              disabled={loading}
            />
          </form>
        </>
      </div>
    </PopupContainer>
  ) : null
}

export default PopupFormUser
