import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Button, Card, Row, Col,
} from 'react-bootstrap'
import { BsImage } from 'react-icons/bs'
import { RiDeleteBin2Fill } from 'react-icons/ri'
import { MdAudiotrack } from 'react-icons/md'
import { useHistory } from 'react-router-dom'
import backArrow from '../../assets/images/ico_arrowLeft-blue.svg'
import ButtonShadow from '../../components/Button/components/ButtonShadow'
import ModalAddEdit from './ModalAddEdit'
import logo from '../../assets/icon.png'

const API_GAME_PRODUCT_URL = 'https://api.futurelang.vn/api/new-game'
const API_GAME_DEV_URL = 'https://future-api.2soft.top/api/new-game'

const GameResources = () => {
  const [listResouces, setListResouces] = useState<any[]>([])
  const [currentView, setCurrentView] = useState<any>(null)
  const history = useHistory()

  const isDev = sessionStorage.getItem('IS_DEV') === 'true'
  // const isDev = true
  const apiUrl = isDev ? API_GAME_DEV_URL : API_GAME_PRODUCT_URL

  const getList = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}`)
      if (response?.status === 200) {
        setListResouces(response?.data || [])
        // setListResouces([])
      }
    } catch (error) {
      console.error(error)
    }
  }, [apiUrl])

  useEffect(() => {
    getList()
  }, [getList])

  const delelteGame = async (data: any) => {
    try {
      const response = await axios.delete(`${apiUrl}/${data?.id}`)
      if (response?.status === 200) {
        getList()
      }
    } catch (err) {
      //
    }
  }

  return (
    <div className="game__resouces">
      <h1 className="game__resouces--title my-3 text-center">Quản lý tài liệu game</h1>
      <ButtonShadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => history.push('/home')}
      />
      <Button onClick={() => setCurrentView({})}>Thêm mới game</Button>
      <Row className="d-flex my-3">
        {listResouces.map((i) => {
          const gameNameUrl = i?.image?.find((item: any) => item?.name === 'game_name')?.url
            || i?.image?.[0]?.url
            || logo
          return (
            <Col key={i.id} xs={3} className="mb-2">
              <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src={gameNameUrl} className="card__game--img" />
                <Card.Body>
                  <Card.Title>{i?.name || 'Không tiêu đề'}</Card.Title>
                  <div className="d-flex justify-content-around mb-3">
                    <div className="item__number">
                      <BsImage color="white" />
                      &nbsp;
                      {i?.image?.length || 0}
                    </div>
                    <div className="item__number">
                      <MdAudiotrack color="white" />
                      &nbsp;
                      {i?.audio?.length || 0}
                    </div>
                    <div className="item__number" onClick={() => delelteGame(i)}>
                      <RiDeleteBin2Fill color="white" />
                    </div>
                  </div>
                  <Button variant="primary" onClick={() => setCurrentView(i)}>
                    Xem danh sách ảnh/âm thanh
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      {currentView !== null && (
        <ModalAddEdit
          apiUrl={apiUrl}
          currentView={currentView}
          onCloseModal={(resetTable: boolean) => {
            if (resetTable) getList()
            setCurrentView(null)
          }}
        />
      )}
    </div>
  )
}

export default GameResources
