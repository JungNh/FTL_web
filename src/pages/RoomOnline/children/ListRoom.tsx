import React, {
  FC, useContext, useEffect, useMemo, useCallback, useState,
} from 'react'
import Table from 'rc-table'
import Select from 'react-select'
import { Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom'
import ButtonSolid from '../../../components/Button/components/ButtonSolid'
import ButtonShadow from '../../../components/Button/components/ButtonShadow'
import InputText from '../../../components/Input/InputText'
import { PageType } from '../types'
import {
  actionGetExamination,
  actionGetGradeOnline,
  actionGetListRoom,
  actionSaveCurrentRoom,
  actionSaveListRoom,
} from '../../../store/roomOnline/actions'
import { RootState } from '../../../store'
import { SocketContext, SocketContextProps, SocketStatus } from '../../../hooks/useWebSockets'
import { numberTwoDigits } from '../../../utils/common'
import { RoomType } from '../../../store/roomOnline/types'
import { hideLoading, showLoading } from '../../../store/login/actions'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'

type Props = {
  changePage: (page: PageType) => void
}

const RoomOnline: FC<Props> = ({ changePage }) => {
  const dispatch = useDispatch()
  const [gradesOp, setGradesOp] = useState<{ label: string; value: number }[]>([])
  const [firstLoading, setFirstLoading] = useState(true)
  const [filterText, setFilterText] = useState<string>('')
  const [filterGrade, setFilterGarde] = useState<{ label: string; value: string | number } | null>(
    null
  )
  // const userInfo = useSelector((state: RootState) => state.login.userInfo)
  const history = useHistory()

  useEffect(() => {
    const getGrade = async () => {
      const response: any = await dispatch(
        actionGetGradeOnline({
          limit: 10,
          offset: 0,
          order: 'ASC',
        })
      )
      if (response?.data) {
        setGradesOp(response.data?.map((item: any) => ({ label: item?.name, value: item?.id })))
        if (firstLoading) setFirstLoading(false)
      }
    }
    getGrade()
  }, [dispatch, firstLoading])

  const columns = [
    {
      title: 'Số',
      dataIndex: 'code',
      key: 'code',
      width: 50,
    },
    {
      title: 'Chủ phòng',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'contest',
      key: 'contest',
      width: 150,
      render: (text: any) => text?.name,
    },
    {
      title: 'Lớp',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
      render: (text: any) => text?.name,
    },
    {
      title: 'Số người',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 100,
      render: (value: number, record: any) => {
        const isFull = value === record?.joinedMemberCount
        const numberMember = `${numberTwoDigits(record?.joinedMemberCount || 0)}/${numberTwoDigits(
          value
        )}`
        if (isFull) return <span style={{ color: 'red' }}>{numberMember}</span>
        return numberMember
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string, record: any) => {
        if (value === 'open' && record?.joinedMemberCount === record?.memberCount) { return <span style={{ color: 'red' }}>Đã đầy</span> }
        if (value === 'open') return <span style={{ color: 'green' }}>Đang chờ</span>
        if (value === 'doing') return <span style={{ color: 'red' }}>Đang thi</span>
        return value
      },
    },
  ]

  const listRoom = useSelector((state: RootState) => state.roomOnline.listRoom)

  useEffect(() => {
    let interval: any
    const getList = async () => {
      dispatch(
        actionGetListRoom({
          offset: 0,
          limit: 1000,
          order: 'ASC',
          gradeId: filterGrade?.value,
        })
      )
      interval = setInterval(() => {
        dispatch(
          actionGetListRoom({
            offset: 0,
            limit: 1000,
            order: 'ASC',
            gradeId: filterGrade?.value,
          })
        )
      }, 10000)
    }
    getList()
    return () => {
      clearInterval(interval)
    }
  }, [dispatch, filterGrade])

  const { state } = useContext(SocketContext) as SocketContextProps

  const joinRoom = useCallback(
    async (data: RoomType) => {
      if ((data?.joinedMemberCount || 0) >= data.memberCount) {
        Swal.fire('Phòng thi đã đầy', 'Vui lòng chọn phòng khác', 'error')
        return
      }
      if (data?.status === 'doing') {
        Swal.fire('Phòng đang thi', 'Vui lòng chọn phòng khác', 'error')
        return
      }

      if (data?.isPrivate /* && data.createdBy !== userInfo?.id */) {
        const { value: password } = await Swal.fire({
          title: 'Nhập mật khẩu phòng',
          input: 'password',
          inputLabel: 'Password',
          inputPlaceholder: 'Enter your password',
        })
        if (password) {
          dispatch(showLoading())
          // console.log('%c[emit] join-exam/listRoom', 'background: yellow', { code: data.code })
          state.socket?.emit(
            'join-exam',
            {
              code: data.code,
              password: password || null,
            },
            (results: any) => {
              dispatch(hideLoading())
              if (results.success) {
                Swal.fire('Vào phòng thành công')
                // console.log('%c[emit] join-exam/listRoom results', 'background: yellow', results)
                dispatch(actionSaveCurrentRoom({ info: data, member: null }))
                changePage('waiting')
              } else {
                Swal.fire('Lỗi', results?.message || 'Vào phòng không thành công', 'error')
              }
            }
          )
        }
      } else {
        dispatch(showLoading())
        // console.log('%c[emit] join-exam/listRoom', 'background: yellow', { code: data.code })
        state.socket?.emit('join-exam', { code: data.code, password: null }, (results: any) => {
          dispatch(hideLoading())
          if (results.success) {
            Swal.fire('Vào phòng thành công')
            // console.log('%c[emit] join-exam/listRoom results', 'background: yellow', results)
            dispatch(actionSaveCurrentRoom({ info: data, member: null }))
            changePage('waiting')
          } else {
            Swal.fire('Lỗi', results?.message || 'Vào phòng không thành công', 'error')
          }
        })
      }
    },
    [changePage, dispatch, state.socket]
  )

  const eventController = useCallback(
    (data: { cmd: string; data: any }) => {
      // console.log('%c socket event, ', 'background: green; color: white', data)
      if (data?.cmd === 'listing-exam') {
        const newListRoom = listRoom?.data ? { ...listRoom?.data } : { data: [] }
        const updatedIndex = newListRoom?.data?.findIndex(
          (item: any) => item?.id === data?.data?.exam?.id
        )
        if (updatedIndex >= 0 && newListRoom.data) {
          newListRoom.data[updatedIndex] = data?.data?.exam
        } else {
          newListRoom.data?.push(data?.data?.exam)
        }
        dispatch(actionSaveListRoom(newListRoom))
      }
      if (data?.cmd === 'invite-exam') {
        Swal.fire({
          title: `Có lời mời từ ${data?.data?.exam?.name} vào phòng thi số ${
            data?.data?.exam?.code || ''
          }`,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Đồng ý',
          denyButtonText: 'Không',
          icon: 'info',
        })
          .then((result) => {
            if (result.isConfirmed) {
              joinRoom({ ...(data?.data?.exam || {}), isPrivate: false })
            }
            return ''
          })
          .catch((error) => console.error(error))
      }
      if (data?.cmd === 'delete-exam') {
        dispatch(
          actionGetListRoom({
            offset: 1,
            limit: 1000,
            order: 'ASC',
          })
        )
      }
    },
    [dispatch, joinRoom, listRoom?.data]
  )

  useEffect(() => {
    if (state.status === SocketStatus.CONNECTED) {
      state.socket?.on('events', (data: any) => eventController(data))
      state.socket?.on('exception', (error: any) => {
        dispatch(hideLoading())
        // console.log('%cException', 'background: red', error)
        Swal.fire(error?.message || 'Có lỗi ko xác dịnh', '', 'error')
      })
    }
    return () => {
      state.socket?.off('events')
    }
  }, [dispatch, eventController, state.socket, state.status])

  const dataTable = useMemo(() => {
    const text = filterText?.toLowerCase()
    return (
      listRoom?.data?.filter((item: any) => (
          item?.code?.toString()?.toLowerCase().includes(text)
          || item?.name?.toString()?.toLowerCase().includes(text)
          || item?.grade?.name?.toString()?.toLowerCase().includes(text)
          || item?.contest?.name?.toString()?.toLowerCase().includes(text)
      )) || []
    )
  }, [filterText, listRoom?.data])

  return (
    <div className="listRoom__page">
      <h1 className="room__online--title my-3">PHÒNG THI ONLINE</h1>
      <ButtonShadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => history.push('home')}
      />

      <Row className="mb-3">
        <Col>
          <ButtonSolid
            className="create__room"
            content="TẠO PHÒNG"
            onClick={() => changePage('create')}
          />
        </Col>
        <Col>
          <Select
            className="select__class"
            onChange={setFilterGarde}
            value={filterGrade}
            options={gradesOp}
            placeholder="Chọn lớp"
            name="color"
            classNamePrefix="select"
          />
        </Col>
        <Col>
          <InputText
            className="search__room"
            value={filterText}
            onChange={(value: string) => setFilterText(value)}
            placeholder="Tìm kiếm"
          />
        </Col>
      </Row>

      <div>
        <Table
          scroll={{ y: 490 }}
          rowKey="code"
          className="table_future"
          data={dataTable}
          columns={columns}
          rowClassName="cursor-pointer"
          onRow={(rowData: any) => ({
            onClick: () => joinRoom(rowData),
          })}
          emptyText={(
            <div className="empty__placeholder" style={{ border: 'none' }}>
              {firstLoading ? 'Đang tải dữ liệu ...' : 'Không có dữ liệu'}
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default RoomOnline
