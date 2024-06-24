import { ErrorMessage } from '@hookform/error-message'
import _ from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { FaMapMarkedAlt, FaMapMarkerAlt, FaSchool } from 'react-icons/fa'
import { FiCheckCircle } from 'react-icons/fi'
import { IoSchoolSharp } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import Swal from 'sweetalert2'
import { Button } from '../../../../components'
import { apiCore } from '../../../../lib-core'
import {
  actionCheckUserHasSchool,
  actionGetDataDistricts,
  actionGetDataLevels,
  actionGetDataProvinces,
  actionGetDataSchools
} from '../../../../store/home/actions'
import { openError } from '../../../../utils/common'
import './styles.scss'

interface Props {
  dataSubmit: object
  dataCAS: object
}

interface FormValues {
  provinceId: any
  schoolLevel: any
  districtId: any
  schoolId: any
}

let dataSchool: any[] = []
let idProvince: any
let idDistrict: any
let idSchoolLevel: any

const customStyles = {
  control: (styles: any) => ({ ...styles, backgroundColor: '#EEEEEE', border: 'none' })
}

const FormStep2 = ({ dataSubmit, dataCAS }: Props) => {
  const {
    provinces: optionsProvince,
    levels,
    districts,
    schools
  } = useSelector((state: any) => state.home)

  const dispatch = useDispatch()
  console.log(dataCAS, 'dataCAS===>>>>')

  const submit: any = useRef()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    resetField
  } = useForm<FormValues>()

  const watchProvince = watch('provinceId')
  const watchDistrict = watch('districtId')
  const watchSchoolLevel = watch('schoolLevel')
  const watchDataSchool = watch(['provinceId', 'districtId', 'schoolLevel'])

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const newValue = {
      ...dataSubmit,
      ...dataCAS,
      provinceId: values.provinceId.value,
      districtId: values.districtId.value,
      schoolLevel: values.schoolLevel.value,
      schoolId: values?.schoolId?.value || 0
    }
    try {
      const response = await apiCore.put(`/user/update`, newValue)
      if (!_.isEmpty(response?.data)) {
        Swal.fire({
          title: 'Cập nhật thành công',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false
        }).then(() => {
          dispatch(actionCheckUserHasSchool())
        })
      }
    } catch (error) {
      if (error instanceof Error) openError(error.message)
    }
  }

  const handleActiveSubmit = () => {
    submit.current.click()
  }

  useEffect(() => {
    if (optionsProvince.length === 0) dispatch(actionGetDataProvinces())
    if (levels.length === 0) dispatch(actionGetDataLevels())
  }, [])

  useEffect(() => {
    const flag =
      dataSchool.length === watchDataSchool.length &&
      watchDataSchool.every((item, index) => item?.value === dataSchool[index]?.value)
    if (!flag) {
      if (watchDataSchool.every((item) => item !== undefined && item !== null && item !== ''))
        if (watchDataSchool[2].label !== 'Sinh viên/Người đi làm')
          dispatch(
            actionGetDataSchools({
              province_id: watchDataSchool[0].value,
              district_id: watchDataSchool[1].value,
              school_level: watchDataSchool[2].value
            })
          )
      dataSchool = watchDataSchool
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
    <React.Fragment>
      <div className="step-2_container">
        <span className="step-2_title">Cập nhật</span>
        <span className="step-2_des">Địa chỉ học tập/làm việc của bạn</span>
        <form onSubmit={handleSubmit(onSubmit)} className="step-2_form">
          <div className="relative mb-30px">
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
                    placeholder={
                      <div className="flex align-items-center px-1">
                        <FaMapMarkedAlt className="fs-20 mr-3" />
                        <span>Tỉnh/Thành phố</span>
                      </div>
                    }
                    styles={customStyles}
                  />
                )
              }}
            />
            <ErrorMessage
              name="provinceId"
              errors={errors}
              render={(data: { message: string }) => (
                <p className="errorField fs-16 absolute">{data?.message}</p>
              )}
            />
          </div>
          {watchProvince && (
            <div className="relative mb-30px">
              <Controller
                name="districtId"
                control={control}
                rules={{ required: 'Bạn vui lòng chọn Quận/Huyện!' }}
                render={({ field: { value, onChange } }: any) => {
                  console.log('value', value)
                  return (
                    <Select
                      value={value}
                      onChange={onChange}
                      options={districts}
                      placeholder={
                        <div className="flex align-items-center px-1">
                          <FaMapMarkerAlt className="fs-20 mr-3" />
                          <span>Quận/Huyện</span>
                        </div>
                      }
                      styles={customStyles}
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
          )}
          {watchDistrict && (
            <div className="relative mb-30px">
              <Controller
                name="schoolLevel"
                control={control}
                rules={{ required: 'Bạn vui lòng chọn Cấp học!' }}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      options={levels}
                      placeholder={
                        <div className="flex align-items-center px-1">
                          <IoSchoolSharp className="fs-20 mr-3" />
                          <span>Cấp</span>
                        </div>
                      }
                      styles={customStyles}
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
          )}
          {watchSchoolLevel?.label && watchSchoolLevel.label !== 'Sinh viên/Người đi làm' && (
            <div className="relative mb-30px">
              <Controller
                name="schoolId"
                control={control}
                rules={{ required: 'Bạn vui lòng chọn Trường!' }}
                render={({ field: { value, onChange } }: any) => {
                  return (
                    <Select
                      key="schoolId"
                      value={value}
                      onChange={onChange}
                      options={schools}
                      placeholder={
                        <div className="flex align-items-center px-1">
                          <FaSchool className="fs-20 mr-3" />
                          <span>Trường</span>
                        </div>
                      }
                      styles={customStyles}
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
          <button ref={submit} hidden type="submit" />
        </form>
      </div>
      <div className="navbar__components">
        <Button.Solid
          className="navbar__btn button_action"
          onClick={handleActiveSubmit}
          content={
            <div className="flex justify-content-center align-items-center fw-bold">
              <FiCheckCircle className="me-2 fs-24 icon_button" />
              Cập nhật
            </div>
          }
        />
      </div>
    </React.Fragment>
  )
}

export default React.memo(FormStep2)
