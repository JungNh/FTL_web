import React, {
  FC, useEffect, useMemo, useState, useCallback, useContext,
} from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import Switch from 'react-switch'
import { RiSwordFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import InputText from '../../../components/Input/InputText'
import { PageType } from '../types'
import {
  actionCreateRoom,
  actionGetContest,
  actionGetGradeOnline,
  actionSaveCurrentRoom,
} from '../../../store/roomOnline/actions'
import { RootState } from '../../../store'
import { hideLoading, showLoading } from '../../../store/login/actions'
import { SocketContext, SocketContextProps } from '../../../hooks/useWebSockets'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import ButtonShadow from '../../../components/Button/components/ButtonShadow'

type Props = {
  changePage: (page: PageType) => void
}

type FormValues = {
  grade: { label: string; value: number } | null
  contest: { label: string; value: number; period?: { id: number } } | null
  memberQuantity: { label: string; value: number } | null
  isPvp: boolean
  password?: string
}

type ContestType = {
  createdBy: number
  description: string | null
  duration: number
  id: number
  name: string
  period: {
    gradeId: number
    id: number
    name: string
    sequenceNo: number
  }
  periodId: number
  status: string
}

const CreateRoom: FC<Props> = ({ changePage }) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      grade: null,
      contest: null,
      memberQuantity: null,
      isPvp: false,
      password: undefined,
    },
  })

  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.login.userInfo)
  const [gradesOp, setGradesOp] = useState<{ label: string; value: number }[]>([])
  const [contestsOp, setContestsOp] = useState<(ContestType & { label: string; value: number })[]>(
    [])
  const [isPrivate, setIsPrivate] = useState(false)

  const { state } = useContext(SocketContext) as SocketContextProps

  useEffect(() => {
    const getGrade = async () => {
      const response: any = await dispatch(
        actionGetGradeOnline({
          limit: 1000,
          offset: 0,
          order: 'ASC',
        })
      )
      if (response.data) {
        setGradesOp(response.data?.map((item: any) => ({ label: item?.name, value: item?.id })))
      }
    }
    getGrade()
  }, [dispatch])

  const getContest = useCallback(
    async (gradeId: number) => {
      setValue('contest', null)
      const response: any = await dispatch(
        actionGetContest({
          gradeId,
          limit: 1000,
          offset: 0,
          order: 'ASC',
        })
      )
      if (response.data) {
        setContestsOp(
          response.data?.map((item: any) => ({ ...item, label: item?.name, value: item?.id }))
        )
      }
    },
    [dispatch, setValue]
  )

  const onsubmit = async (values: FormValues) => {
    dispatch(showLoading())
    const response: any = await dispatch(
      actionCreateRoom({
        contestId: values.contest?.value || 0,
        description: 'no description',
        expertise: 'no expertise',
        gradeId: values.grade?.value || 0,
        isPrivate: values?.isPvp || false,
        memberCount: values.memberQuantity?.value || 0,
        password: values.password || undefined,
        name: userInfo?.fullname || 'Không có tên',
        periodId: values?.contest?.period?.id || 1,
      })
    )
    if (response) {
      // join room
      const dateEmit = {
        code: response.code,
        password: values.password || null,
      }
      // console.log('%c[emit] join-exam', 'background: yellow', dateEmit)
      state.socket?.emit('join-exam', dateEmit, (results: any) => {
        dispatch(hideLoading())
        // console.log('%c[emit] join-exam results', 'background: yellow', results)
        if (results.success) {
          Swal.fire('Vào phòng thành công')
          dispatch(actionSaveCurrentRoom({ info: response, member: null }))
          changePage('waiting')
        } else {
          Swal.fire('Lỗi', results?.message || 'Vào phòng thành công', 'error')
        }
      })
    }
  }

  const optionMember = useMemo(
    () => [
      { label: '2 thành viên', value: 2 },
      { label: '3 thành viên', value: 3 },
      { label: '4 thành viên', value: 4 },
      { label: '5 thành viên', value: 5 },
      { label: '6 thành viên', value: 6 },
      { label: '7 thành viên', value: 7 },
      { label: '8 thành viên', value: 8 },
      { label: '9 thành viên', value: 9 },
      { label: '10 thành viên', value: 10 },
    ],
    []
  )

  return (
    <div className="createRoom__page">
      <h1 className="room__online--title my-3">TẠO PHÒNG THI</h1>
      <ButtonShadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => {
          changePage('list')
        }}
      />
      <div>
        <form onSubmit={handleSubmit(onsubmit)}>
          <Row>
            <Col xs="12">
              <p className="m-0 mt-3">
                <b>Bước 1:</b>
                {' '}
                Chọn lớp
              </p>
              <Controller
                name="grade"
                control={control}
                rules={{ required: 'Lớp không được trống' }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    className="select__class"
                    onChange={(selected: any) => {
                      getContest(selected.value)
                      onChange(selected)
                    }}
                    value={value}
                    options={gradesOp}
                    placeholder="Chọn lớp"
                    name="color"
                    classNamePrefix="select"
                  />
                )}
              />
              <ErrorMessage
                name="grade"
                errors={errors}
                render={(data: { message: string }) => (
                  <p className="errorField">{data?.message}</p>
                )}
              />
            </Col>
            <Col xs="12">
              <p className="m-0 mt-3">
                <b>Bước 2:</b>
                {' '}
                Chọn đề
              </p>
              <Controller
                name="contest"
                control={control}
                rules={{ required: 'Đề không được trống' }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    className="select__class"
                    onChange={onChange}
                    value={value}
                    options={contestsOp}
                    placeholder="Chọn đề mà bạn muốn thi đấu"
                    name="color"
                    classNamePrefix="select"
                  />
                )}
              />
              <ErrorMessage
                name="contest"
                errors={errors}
                render={(data: { message: string }) => (
                  <p className="errorField">{data?.message}</p>
                )}
              />
            </Col>
            <Col xs="12">
              <div className="mb-3">
                <p className="m-0 mt-3">
                  <b>Bước 3:</b>
                  {' '}
                  Tạo phòng
                </p>
                <p className="mb-0">Số lượng thành viên</p>
                <Controller
                  name="memberQuantity"
                  control={control}
                  rules={{ required: 'Số lượng thành viên không được trống' }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      className="select__class"
                      onChange={onChange}
                      value={value}
                      options={optionMember}
                      placeholder="10 thành viên"
                      name="color"
                      classNamePrefix="select"
                    />
                  )}
                />
                <ErrorMessage
                  name="memberQuantity"
                  errors={errors}
                  render={(data: { message: string }) => (
                    <p className="errorField">{data?.message}</p>
                  )}
                />
                <Controller
                  name="isPvp"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <label className="my-3 d-flex align-items-center">
                      <Switch
                        // height={16}
                        // width={40}
                        checkedIcon={<RiSwordFill style={{ color: 'white', margin: '0 0.5rem' }} />}
                        uncheckedIcon={false}
                        onChange={(checked: any) => {
                          setIsPrivate(checked)
                          onChange(checked)
                        }}
                        checked={value}
                        className="me-3"
                      />
                      <span>Thi đấu riêng</span>
                    </label>
                  )}
                />
                {isPrivate ? (
                  <>
                    {/* <p>Mã phòng: 026</p> */}
                    <p>Mật khẩu</p>
                    <Controller
                      name="password"
                      rules={{
                        required: 'Mật khẩu không được để trống',
                        pattern: {
                          value: /^[0-9]/,
                          message: 'Mật khẩu chỉ nhập số',
                        },
                        minLength: {
                          value: 6,
                          message: 'Mật khẩu bao gồm 6 chữ số',
                        },
                      }}
                      control={control}
                      defaultValue=""
                      render={({ field: { value, onChange } }) => (
                        <InputText
                          type="password"
                          className="search__room"
                          value={value}
                          onChange={onChange}
                          placeholder="Mật khẩu bao gồm 6 chữ số"
                          maxLength={6}
                          checkPassRoom
                        />
                      )}
                    />
                    <ErrorMessage
                      name="password"
                      errors={errors}
                      render={(data: { message: string }) => (
                        <p className="errorField">{data?.message}</p>
                      )}
                    />
                  </>
                ) : (
                  <p className="note__pvp">
                    *Phòng thi đấu riêng là phòng thi đấu chỉ những ai được chủ phòng mời, mới được
                    tham gia thi đấu
                  </p>
                )}
              </div>
            </Col>
            <Col xs="6">
              <Button
                className="pvp__btn--cancel"
                variant="outline-dark"
                onClick={() => {
                  changePage('list')
                }}
              >
                Hủy
              </Button>
            </Col>
            <Col xs="6">
              <Button className="pvp__btn--create" variant="primary" type="submit">
                Tạo phòng
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    </div>
  )
}

export default CreateRoom
