import React, {
  FC, useEffect, useMemo, useState,
} from 'react'
import AudioPlayer from 'react-h5-audio-player'
import {
  Button, Image, Modal, Row, Col,
} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import Switch from 'react-switch'
import { BsImage } from 'react-icons/bs'
import { MdAudiotrack } from 'react-icons/md'
import axios from 'axios'
import { RiDeleteBin2Fill } from 'react-icons/ri'
import { Input } from '../../components'
import { actionUploadAudio, actionUploadImage } from '../../store/settings/actions'

type Props = {
  currentView: any
  onCloseModal: (resetTable: boolean) => void
  apiUrl: string
}

type ResourceType = { name: string; url: string }

const ModalAddEdit: FC<Props> = ({ apiUrl, currentView, onCloseModal }) => {
  const [gameName, setGameName] = useState('')
  const [fileName, setFileName] = useState('')
  const [filePreUpload, setFilePreUpload] = useState<File>()
  const [fileType, setFileType] = useState<'img' | 'audio'>('img')

  const [listImage, setListImage] = useState<ResourceType[]>([])
  const [listSound, setListSound] = useState<ResourceType[]>([])
  const dispatch = useDispatch()

  const isAdd = useMemo(() => currentView?.id === undefined, [currentView?.id])

  useEffect(() => {
    const getDetail = async () => {
      const response = await axios.get(`${apiUrl}/${currentView?.id}`)
      if (response?.status === 200) {
        setGameName(response?.data?.name)
        setListImage(response?.data?.image)
        setListSound(response?.data?.audio)
      }
    }
    if (!isAdd) {
      getDetail()
    }
  }, [apiUrl, currentView?.id, isAdd])

  const addFile = async () => {
    if (!fileName) Swal.fire('Tên file không được trống', '', 'error')
    if (!filePreUpload) Swal.fire('File không được trống', '', 'error')
    if (!fileName || !filePreUpload) return

    if (fileType === 'img') {
      const responseFile: any = await dispatch(actionUploadImage(filePreUpload))
      if (responseFile?.data) {
        const newResource: ResourceType = { name: fileName, url: responseFile?.data?.url }
        setListImage((data: ResourceType[]) => {
          const newData: ResourceType[] = data.slice()
          newData.push(newResource)
          return newData
        })
        setFileName('')
      } else {
        Swal.fire('Có lỗi khi tải file lên')
      }
    }
    if (fileType === 'audio') {
      const responseFile: any = await dispatch(actionUploadAudio(filePreUpload))
      if (responseFile?.data) {
        const newResource: ResourceType = { name: fileName, url: responseFile?.data?.url }
        setListSound((data: ResourceType[]) => {
          const newData: ResourceType[] = data.slice()
          newData.push(newResource)
          return newData
        })
        setFileName('')
      } else {
        Swal.fire('Có lỗi khi tải file lên')
      }
    }
  }

  const onFinish = async () => {
    if (!gameName) {
      Swal.fire('Tên Game không được trống')
      return
    }
    const dataRequest = {
      name: gameName,
      image: listImage,
      audio: listSound,
    }

    let response: any
    if (isAdd) {
      response = await axios.post(`${apiUrl}`, dataRequest)
    } else {
      response = await axios.patch(`${apiUrl}/${currentView?.id}`, dataRequest)
    }

    if (response?.status?.toString()?.startsWith('2')) {
      Swal.fire(isAdd ? 'Tạo thành công' : 'Chỉnh sửa thành công', '', 'success')
      onCloseModal(true)
    } else {
      Swal.fire(isAdd ? 'Tạo thất bại' : 'Chỉnh sửa thất bại', '', 'error')
    }
  }

  const removeItem = (data: any, type: 'image' | 'audio') => {
    if (type === 'image') {
      const newList = listImage.filter((i) => i.name !== data.name)
      setListImage(newList)
    }
    if (type === 'audio') {
      const newList = listSound.filter((i) => i.name !== data.name)
      setListSound(newList)
    }
  }

  return (
    <Modal
      className="modal__add__edit__test"
      backdrop="static"
      size="lg"
      keyboard={false}
      centered
      show={currentView !== null}
      onHide={() => onCloseModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{isAdd ? 'Thêm mới dữ liệu game' : 'Chỉnh sửa dữ liệu game'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input.Text placeholder="Tên Game" value={gameName} onChange={setGameName} />
        <div className="d-flex justify-content-between align-items-center my-3">
          <Switch
            width={50}
            checkedIcon={<MdAudiotrack color="white" />}
            uncheckedIcon={<BsImage color="white" />}
            onChange={(checked: any) => {
              setFileType(checked ? 'audio' : 'img')
            }}
            checked={fileType === 'audio'}
            className="me-3"
          />
          <div className="flex-1 px-3">
            <Input.Text
              className="mb-2"
              placeholder="File name"
              value={fileName}
              onChange={setFileName}
            />
            <input
              type="file"
              id="preFile"
              onChange={(e: any) => setFilePreUpload(e.target.files[0])}
            />
          </div>
          <Button onClick={addFile}>Thêm file</Button>
        </div>
        <div className="list__files my-3">
          {Boolean(listImage?.length) && (
            <section className="list__image">
              <h3>List Ảnh</h3>
              <Row>
                {listImage?.map((image: ResourceType) => (
                  <Col xs={6} key={image?.name}>
                    <div className="d-flex align-items-center">
                      <Image className="img__item" src={image?.url} />
                      <small className="ms-3">
                        :
                        {' '}
                        {image?.name}
                      </small>
                      <div
                        className="delete-icon ms-auto"
                        onClick={() => removeItem(image, 'image')}
                      >
                        <RiDeleteBin2Fill color="white" />
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>
          )}
          {Boolean(listSound?.length) && (
            <section className="list__audio">
              <h3>List Sound</h3>
              <Row>
                {listSound?.map((audio: ResourceType, index: number) => (
                  <Col xs={6} key={audio?.name}>
                    <div className="d-flex align-items-center">
                      <span className={`audio__name--${index % 3}`}>{audio?.name}</span>
                      <div
                        className="delete-icon ms-auto"
                        onClick={() => removeItem(audio, 'audio')}
                      >
                        <RiDeleteBin2Fill color="white" />
                      </div>
                    </div>
                    <AudioPlayer
                      src={audio?.url}
                      layout="horizontal"
                      showJumpControls={false}
                      customVolumeControls={[]}
                      customAdditionalControls={[]}
                    />
                  </Col>
                ))}
              </Row>
            </section>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onFinish()}>Lưu</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalAddEdit
