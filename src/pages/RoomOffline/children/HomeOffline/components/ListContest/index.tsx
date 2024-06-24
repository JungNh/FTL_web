/* eslint-disable react/display-name */
import Table from 'rc-table'
import React, {
  FC, useEffect, useState, useCallback,
} from 'react'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import { Input } from '../../../../../../components'
import {
  actionGetContestById,
  actionGetContestOffline,
  actionGetPeriods,
  saveDetailContest,
} from '../../../../../../store/roomOffline/actions'

type Props = {
  data: any
  changePage: (page: string) => void
}

const ListContest: FC<Props> = ({ data, changePage }) => {
  const [dataTable, setDataTable] = useState([])
  const [periods, setPeriods] = useState<any[]>([])
  const [searchStatus, setSearchStatus] = useState<'' | 'done' | 'doing' | 'not_doing'>('')
  const [searchPeriod, setSearchPeriod] = useState<number | null>(null)
  const dispatch = useDispatch()
  const getContest = useCallback(
    async (
      gradeId: number,
      periodId: number | null,
      status: '' | 'done' | 'doing' | 'not_doing'
    ) => {
      const response: any = await dispatch(
        actionGetContestOffline({
          limit: 1000,
          offset: 0,
          order: 'ASC',
          gradeId,
          periodId,
          status,
        })
      )
      if (response?.data) {
        setDataTable(response?.data)
      }
    },
    [dispatch]
  )

  const getPeriodsOps = useCallback(
    async (gradeId: number) => {
      const response: any = await dispatch(actionGetPeriods({ gradeId }))

      if (response?.data) {
        const responsePeriods = response?.data?.map((item: any) => ({
          ...item,
          label: item?.name,
          value: item?.id,
        }))
        setPeriods([{ label: 'Tất cả đề thi', value: '' }, ...responsePeriods])
      }
    },
    [dispatch]
  )

  useEffect(() => {
    if (data) {
      getPeriodsOps(data)
    }
  }, [data, getPeriodsOps])

  useEffect(() => {
    getContest(data, searchPeriod, searchStatus)
  }, [data, getContest, searchPeriod, searchStatus])

  const chosseContest = async (info: any) => {
    const response: any = await dispatch(actionGetContestById({ id: info?.id }))
    if (response?.data) {
      await dispatch(saveDetailContest(response?.data))
      changePage('examing')
    }
  }

  const columns: any = [
    {
      title: 'Số',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Đề thi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Lớp',
      dataIndex: ['period', 'name'],
      key: 'class',
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'expertise',
      key: 'expertise',
    },
    {
      title: 'Số câu',
      dataIndex: 'questionCount',
      key: 'questionCount',
    },
    {
      title: 'Điểm',
      dataIndex: 'correctQuestionTotal',
      key: 'correctQuestionTotal',
      render: (value: number, record: any) => {
        const text = Math.round((value / (record?.questionCount || 1)) * 100) / 10
        if (record?.type === 'not_doing') return 'Chưa làm'
        if (record?.type === 'doing') return 'Đang làm'
        if (value >= 8) {
          return (
            <span style={{ color: 'green' }}>
              {text}
              /10 điểm
            </span>
          )
        }
        return (
          <span style={{ color: 'red' }}>
            {text}
            /10 điểm
          </span>
        )
      },
    },
  ]

  const statusOps = [
    { label: 'Tất cả trạng thái', value: '' },
    { label: 'Chưa làm', value: 'not_doing' },
    { label: 'Đang làm', value: 'doing' },
    { label: 'Điểm', value: 'done' },
  ]

  return (
    <div className="list__contest">
      <div className="list__contest--filter">
        <Select
          className="select_contest"
          defaultValue={{ label: 'Tất cả đề thi', value: '' }}
          value={periods?.find((item) => item.value === searchPeriod)}
          onChange={(op: any) => setSearchPeriod(op?.value)}
          options={periods}
          name="color"
          classNamePrefix="select"
        />
        <Select
          className="select_contest"
          defaultValue={{ label: 'Tất cả trạng thái', value: '' }}
          value={statusOps?.find((item) => item.value === searchStatus)}
          onChange={(op: any) => setSearchStatus(op?.value)}
          options={statusOps}
          name="color"
          classNamePrefix="select"
        />
      </div>
      <Table
        scroll={{ y: 490 }}
        rowKey="id"
        className="table_offline"
        data={dataTable}
        columns={columns}
        onRow={(rowData: any) => ({
          onClick: () => chosseContest(rowData),
        })}
        emptyText={(
          <div className="empty__placeholder" style={{ border: 'none' }}>
            Không có dữ liệu
          </div>
        )}
      />
    </div>
  )
}

export default ListContest
