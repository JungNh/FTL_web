import { ErrorMessage } from '@hookform/error-message'
import { sub } from 'date-fns'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import { BsGenderAmbiguous } from 'react-icons/bs'
import { FaMapMarkedAlt, FaMapMarkerAlt, FaSchool } from 'react-icons/fa'
import { IoSchoolSharp } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import Swal from 'sweetalert2'
import { Button, Input } from '../../../../components'
import { apiCore } from '../../../../lib-core'
import {
  actionGetDataDistricts,
  actionGetDataLevels,
  actionGetDataProvinces,
  actionGetDataSchools
} from '../../../../store/home/actions'
import { actionUserMe } from '../../../../store/login/actions'
import { openError } from '../../../../utils/common'

type Props = {
  isVisible: boolean
  onClose: () => void
  userInfo: any
  setPopupSubmit?: any
  setFormUser?: any
}

type FormValues = {
  fullname: string
  dob: string
  provinceId: any
  schoolLevel: any
  districtId: any
  schoolId: any
  sex: any
}

let dataSchool: any[] = []
let idProvince: any
let idDistrict: any
let idSchoolLevel: any

const customStyles = {
  control: (styles: any) => ({ ...styles, backgroundColor: '#EEEEEE', border: 'none' })
}

const ModalUpdate: React.FC<Props> = ({
  isVisible,
  onClose,
  userInfo,
  setPopupSubmit,
  setFormUser
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
  const watchDistrict = watch('districtId')
  const watchSchoolLevel = watch('schoolLevel')
  const watchDataSchool = watch(['provinceId', 'districtId', 'schoolLevel'])

  const {
    provinces: optionsProvince,
    levels,
    districts,
    schools
  } = useSelector((state: any) => state.home)

  const onSubmit = async (values: FormValues) => {
    const req = {
      ...values,
      provinceId: values.provinceId.value,
      districtId: values.districtId.value,
      schoolLevel: values.schoolLevel.value,
      schoolId: values?.schoolId?.value || 0,
      sex: values.sex.value
    }
    try {
      const response = await apiCore.put(`/user/update`, req)
      if (!_.isEmpty(response?.data)) {
        Swal.fire({
          title: 'Cập nhật thành công',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false
        }).then(async () => {
          try {
            const response: any = await dispatch(actionUserMe())
            if (response?.status === 200 && response?.data) {
              onClose()
            }
            if (setPopupSubmit) {
              setPopupSubmit(true)
              setFormUser(false)
            }
          } catch (error) {
            if (error instanceof Error) openError(error.message)
          }
        })
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

  useEffect(() => {
    try {
      if (!_.isEmpty(userInfo)) {
        setValue('fullname', userInfo?.fullname)
        setValue('dob', moment(new Date(userInfo?.dob)).format('YYYY-MM-DD'))
        setValue('provinceId', { value: userInfo?.province.id, label: userInfo?.province.name })
        setValue('schoolLevel', {
          value: userInfo?.school_level?.id,
          label: userInfo?.school_level?.name
        })
        setValue('districtId', { value: userInfo?.district.id, label: userInfo?.district.name })
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

  useEffect(() => {
    if (optionsProvince.length === 0) dispatch(actionGetDataProvinces())
    if (levels.length === 0) dispatch(actionGetDataLevels())
  }, [])

  useEffect(() => {
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
  }, [watchDataSchool])

  useEffect(() => {
    if (!_.isEmpty(watchProvince) && watchProvince.value !== idProvince) {
      resetField('districtId', {
        defaultValue: ''
      })
      resetField('schoolId', {
        defaultValue: ''
      })
      idProvince = watchProvince.value
    }
    if (!_.isEmpty(watchDistrict) && watchDistrict.value !== idDistrict) {
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
  }, [watchProvince, watchDistrict, watchSchoolLevel, resetField])
  return (
    <Modal show={isVisible} onHide={() => onClose()} dialogClassName="modal__user" centered>
      <Modal.Body>
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
              render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
            />
          </div>
          <div className="mb-3">
            <p className="small mb-0 fw-bold">Ngày sinh</p>
            <Controller
              name="dob"
              control={control}
              rules={{ required: 'Bạn vui lòng chọn Ngày sinh!' }}
              render={({ field: { value, onChange } }) => {
                const newValue = value ? new Date(value) : undefined
                return (
                  <DatePicker
                    className="custome_datepicker"
                    selected={newValue}
                    onChange={(date: Date) => {
                      const newValue = date
                        ? moment(new Date(date)).format('YYYY-MM-DD')
                        : undefined
                      onChange(newValue || '')
                    }}
                    dateFormat="dd/MM/yyyy"
                    maxDate={
                      new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }))
                    }
                    minDate={sub(new Date(), { years: 100 })}
                    wrapperClassName="custome_datepicker-wrapper"
                    showMonthDropdown
                    showYearDropdown
                    scrollableYearDropdown
                    dropdownMode="select"
                  />
                )
              }}
            />
            <ErrorMessage
              name="dob"
              errors={errors}
              render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
            />
          </div>
          <div className="mb-3">
            <p className="small mb-0 fw-bold">Giới tính</p>
            <Controller
              name="sex"
              control={control}
              rules={{ required: 'Bạn vui lòng chọn Giới tính!' }}
              render={({ field: { value, onChange } }: any) => {
                return (
                  <Select
                    value={value}
                    onChange={onChange}
                    options={[
                      {
                        value: 'M',
                        label: 'Nam'
                      },
                      {
                        value: 'F',
                        label: 'Nữ'
                      },
                      {
                        value: 'O',
                        label: 'Khác'
                      }
                    ]}
                    styles={customStyles}
                    placeholder={
                      <div className="flex align-items-center px-1">
                        <BsGenderAmbiguous className="fs-20 mr-3" />
                        <span>Giới tính</span>
                      </div>
                    }
                  />
                )
              }}
            />
            <ErrorMessage
              name="sex"
              errors={errors}
              render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
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
              render={(data: { message: string }) => <p className="errorField">{data?.message}</p>}
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
                    onChange={onChange}
                    options={districts}
                    styles={customStyles}
                    placeholder={
                      <div className="flex align-items-center px-1">
                        <FaMapMarkerAlt className="fs-20 mr-3" />
                        <span>Quận/Huyện</span>
                      </div>
                    }
                  />
                )
              }}
            />
            <ErrorMessage
              name="districtId"
              errors={errors}
              render={(data: { message: string }) => (
                <p className="errorField fs-16 absolute">{data?.message}</p>
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
                <p className="errorField fs-16 absolute">{data?.message}</p>
              )}
            />
          </div>
          {watchSchoolLevel?.label && watchSchoolLevel.label !== 'Sinh viên/Người đi làm' && (
            <div className="mb-3">
              <p className="small mb-0 fw-bold">Trường</p>
              <Controller
                name="schoolId"
                control={control}
                rules={{ required: 'Bạn vui lòng chọn Trường!' }}
                render={({ field: { value, onChange } }: any) => {
                  return (
                    <Select
                      value={value}
                      onChange={onChange}
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
          <div className="d-flex align-items-center">
            <Button.Solid
              className="btn__cancel me-3"
              content="Hủy bỏ"
              style={{ width: '7rem' }}
              htmlType="button"
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
