import { sub } from 'date-fns'
import React, { memo, useMemo, useRef, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import './styles.scss'
import { AiTwotoneCalendar } from 'react-icons/ai'
import { Button } from '../../../../components'
import { FiCheckCircle } from 'react-icons/fi'
import { BsGenderAmbiguous } from 'react-icons/bs'
import { ErrorMessage } from '@hookform/error-message'
import moment from 'moment'
import BoyActive from '../../../../assets/images/gender-boy-active.svg'
import GirlActive from '../../../../assets/images/gender-girl-active.svg'
import BoyInactive from '../../../../assets/images/gender-boy-inactive.svg'
import GirlInactive from '../../../../assets/images/gender-girl-inactive.svg'
import { Alert } from 'react-bootstrap'
import { MdDateRange } from 'react-icons/md'
import DateInput from '../DateInput'
import Select from 'react-select'

interface FormValues {
  dob: string
  sex: string
  day: string
  month: any
  year: string
}

interface Props {
  dataSubmit: any
  handleUpdateDataSubmit: (data: any) => void
  handleSwitchStep: (step: number) => void
}

const customStyles = {
  control: (styles: any) => ({ ...styles, backgroundColor: '#EEEEEE', border: 'none', height: 50 })
}

const dataMonth = [
  { value: 1, label: ' Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: ' Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: ' Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: ' Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: ' Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: ' Tháng 11' },
  { value: 12, label: 'Tháng 12' }
]

const FormStep1 = ({ dataSubmit, handleUpdateDataSubmit, handleSwitchStep }: Props) => {
  const submit: any = useRef()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      dob: dataSubmit?.dob,
      sex: dataSubmit?.sex,
      day: dataSubmit?.day,
      month: dataSubmit?.month,
      year: dataSubmit?.year
    }
  })

  const [isValidBOB, setIsValidBOB] = useState<number>(0)
  const [isValidSex, setIsValidSex] = useState<boolean>(false)
  var currentDate = new Date()
  var currentYear = currentDate.getFullYear()

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    let birthday = `${values?.year}-${values?.month?.value}-${values?.day}`
    var date = moment(birthday, 'YYYY-MM-DD')
    var dateInput = moment(birthday).format('YYYY-MM-DD')
    console.log('ValuesSubmit', { ...values, dob: dateInput }, birthday, date.isValid())
    if (!values.day) {
      setIsValidBOB(1)
    } else if (!values.month) {
      setIsValidBOB(2)
    } else if (
      Number(values?.year) > currentYear ||
      Number(values?.year) < currentYear - 100 ||
      !values.year
    ) {
      setIsValidBOB(3)
    } else if (!date.isValid()) {
      setIsValidBOB(1)
    } else if (!values?.sex) {
      setIsValidSex(true)
      setIsValidBOB(0)
    } else {
      handleUpdateDataSubmit({ ...values, dob: dateInput })
      handleSwitchStep(2)
      setIsValidBOB(0)
      setIsValidSex(false)
    }
  }

  const handleActiveSubmit = () => {
    submit.current.click()
  }

  const CustomInputDoB = useMemo(
    () =>
      React.forwardRef(({ value, onClick }: any, ref: any) => (
        <button type="button" className="step-1_custom_input_dob" onClick={onClick} ref={ref}>
          <AiTwotoneCalendar className="fs-20" />
          {value || 'Ngày sinh'}
        </button>
      )),
    []
  )

  return (
    <React.Fragment>
      <div className="step-1_container">
        <span className="step-1_title">Cập nhật</span>
        <span className="step-1_des">Ngày sinh và giới tính của bạn</span>
        <form onSubmit={handleSubmit(onSubmit)} className="step_1_form">
          <div className="dob_input_bg">
            <Controller
              name="day"
              defaultValue=""
              control={control}
              render={({ field: { value, onChange } }) => (
                <DateInput
                  value={value}
                  onChange={(value) => {
                    let handleNum = value.replace(/[^0-9,.]+/g, '')
                    if (handleNum.length > 2) return
                    if (isValidBOB == 1 && value) setIsValidBOB(0)
                    onChange(handleNum)
                  }}
                  placeholder="Ngày"
                />
              )}
            />
            <Controller
              name="month"
              control={control}
              render={({ field: { value, onChange } }: any) => {
                console.log('VALUE_MONTH', value)
                return (
                  <Select
                    value={value}
                    onChange={(value) => {
                      if (isValidBOB == 2 && value) setIsValidBOB(0)
                      onChange(value)
                    }}
                    options={dataMonth}
                    placeholder={
                      <div className="flex align-items-center px-1">
                        <span style={{ color: '#bdbdbd ' }}>Tháng</span>
                      </div>
                    }
                    styles={customStyles}
                    className="select_dob"
                  />
                )
              }}
            />
            <Controller
              name="year"
              defaultValue=""
              control={control}
              render={({ field: { value, onChange } }) => (
                <DateInput
                  value={value}
                  placeholder="Năm"
                  onChange={(value) => {
                    let handleNum = value.replace(/[^0-9,.]+/g, '')
                    if (handleNum.length > 4) return
                    if (isValidBOB == 3 && value) setIsValidBOB(0)
                    onChange(handleNum)
                  }}
                />
              )}
            />
          </div>
          <div className="require_dob_bg">
            <p className="require_dob" style={{ color: isValidBOB == 1 ? 'red' : 'transparent' }}>
              Vui lòng điền đúng thông tin ngày sinh
            </p>
            <p className="require_dob" style={{ color: isValidBOB == 2 ? 'red' : 'transparent' }}>
              Vui lòng điền đúng thông tin tháng sinh
            </p>
            <p className="require_dob" style={{ color: isValidBOB == 3 ? 'red' : 'transparent' }}>
              Vui lòng điền đúng thông tin năm sinh (từ {currentYear - 100} đến {currentYear} )
            </p>
          </div>
          <div className="relative_dob">
            <Controller
              name="sex"
              control={control}
              // rules={{ required: 'Giới tính không được trống' }}
              render={({ field: { value, onChange } }) => {
                return (
                  <button type="button" className="step-1_custom_input_sex">
                    <div>
                      <BsGenderAmbiguous className="fs-24 mr-2" />
                      Giới tính
                    </div>
                    <div
                      className={`step-1_custom_input_other 
                      ${value === 'O' && 'step-1_custom_input_other__active'} `}
                      onClick={() => {
                        onChange('O')
                        setIsValidSex(false)
                      }}
                    >
                      Khác
                    </div>
                  </button>
                )
              }}
            />
            <div style={{ width: '80%' }}>
              <p className="require_dob" style={{ color: isValidSex ? 'red' : 'transparent' }}>
                Vui lòng điền thông tin giới tính
              </p>
            </div>
          </div>
          <div className="mt-10 flex justify-content-center gap-60">
            <Controller
              name="sex"
              control={control}
              // rules={{ required: 'Giới tính không được trống' }}
              render={({ field: { value, onChange } }) => {
                return (
                  <button
                    type="button"
                    className="step-1_custom_card_sex p-0"
                    onClick={() => {
                      onChange('M')
                      setIsValidSex(false)
                    }}
                  >
                    <img src={(value === 'M' && BoyActive) || BoyInactive} alt="boy-inactive" />
                  </button>
                )
              }}
            />
            <Controller
              name="sex"
              control={control}
              // rules={{ required: 'Giới tính không được trống' }}
              render={({ field: { value, onChange } }) => {
                return (
                  <button
                    type="button"
                    className="step-1_custom_card_sex p-0"
                    onClick={() => {
                      onChange('F')
                      setIsValidSex(false)
                    }}
                  >
                    <img src={(value === 'F' && GirlActive) || GirlInactive} alt="boy-inactive" />
                  </button>
                )
              }}
            />
          </div>
          <button ref={submit} hidden={true} type="submit" />
        </form>
      </div>
      <div className="navbar__components">
        <Button.Solid
          className="navbar__btn button_action"
          onClick={handleActiveSubmit}
          content={
            <div className="flex justify-content-center align-items-center fw-bold">
              <FiCheckCircle className="me-2 fs-24 icon_button" />
              TIẾP TỤC
            </div>
          }
        />
      </div>
    </React.Fragment>
  )
}

export default memo(FormStep1)
