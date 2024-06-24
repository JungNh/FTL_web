import React, { FC, useState } from 'react'
import { Button, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import icoWarning from '../../../assets/images/ico__warning.svg'
import { actionReportQuestion } from '../../../store/study/actions'

type Props = {
  questionId: number
  show: boolean
  handleClose: () => void
}

const ModalReport: FC<Props> = ({ show, handleClose, questionId }) => {
  const [errorReport, setErrorReport] = useState<string[]>([])
  const [otherError, setOtherError] = useState<string>('')
  const errorList = [
    'Câu hỏi chưa rõ ràng',
    'Đáp án chưa đúng',
    'Câu hỏi không liên quan tới chủ đề',
    'Lỗi giao diện',
    'Âm thanh hoặc hình ảnh sai',
    'Xảy ra lỗi khác'
  ]
  const [disabled, setDisabled] = useState(false)

  //check validate mô tả chi tiết (phải trên 2 kí tự)
  const validateField = (input: any) => {
    if (input?.length !== 0) {
      return input?.trim()?.length > 2
    } else {
      return false
    }
  }

  const onCheck = (string: string) => {
    const isRemove = errorReport?.includes(string)
    if (isRemove) {
      const newList: string[] = errorReport.filter((item: string) => item !== string)
      setErrorReport(newList)
      if (string === 'Xảy ra lỗi khác') setOtherError('')
    } else {
      setErrorReport([...errorReport, string])
    }
  }
  const dispatch = useDispatch()
  const onSubmit = async () => {
    setDisabled(true)
    if (errorReport.length === 0) {
      Swal.fire('Vui lòng chọn loại phản hồi', '', 'warning')
      setDisabled(false)
      return
    }
    if (!validateField(otherError)) {
      Swal.fire('Vui lòng điền mô tả lỗi chi tiết (ít nhất trên 2 kí tự)', '', 'warning')
      setDisabled(false)
      return
    }

    const input = errorReport.reduce((mess: string, item: string) => {
      // if (item === 'Xảy ra lỗi khác') {
      //   mess += `Mô tả: ${otherError}; `
      // } else {
      mess += `${item}; `
      // }
      return mess
    }, '')

    const content: any = input + `Mô tả: ${otherError}; `

    const response: any = await dispatch(
      actionReportQuestion({
        content,
        questionId
      })
    )
    if (response) {
      Swal.fire('Cảm ơn bạn đã báo lỗi, chúng tôi sẽ xử lý trong thời gian ngắn nhất.')
      setDisabled(false)
      setErrorReport([])
      setOtherError('')
      handleClose()
    }
  }

  return (
    <Modal
      dialogClassName="modal__report__dialog"
      show={show}
      onHide={() => {
        setErrorReport([])
        setOtherError('')
        handleClose()
      }}
    >
      <Modal.Body>
        <Row>
          <Col xs={9}>
            <h4 className="fw-bold my-3">Phản hồi</h4>
          </Col>
          <Col xs={3}>
            <div className="d-flex justify-content-center">
              <img src={icoWarning} alt="ico__warning" />
            </div>
          </Col>
          <h5 className="fw-bold my-3">Loại phản hồi*</h5>
          {errorList.map((item: string) => (
            <React.Fragment key={item}>
              <Col xs={9}>{item}</Col>
              <Col xs={3}>
                <div className="d-flex justify-content-center">
                  <Form.Check
                    checked={errorReport.includes(item)}
                    onChange={() => onCheck(item)}
                    type="checkbox"
                    id={item}
                    className="report__checkbox"
                  />
                </div>
              </Col>
            </React.Fragment>
          ))}
        </Row>
        <h5 className="fw-bold my-3">Mô tả chi tiết*</h5>
        {/* <input
          className="input__other"
          placeholder="vd: Có lỗi chính tả.............."
          value={otherError}
          multiple
          onChange={(e: any) => setOtherError(e.target.value)}
        /> */}
        <FormControl
          // className={`input__textarea__component ${className} ${isError ? 'has__error' : ''}`}
          placeholder={'Vui lòng mô tả lỗi bạn gặp phải để chúng tôi có thể khắc phục'}
          value={otherError}
          maxLength={1000}
          // type={type}
          as="textarea"
          onChange={(e: any) => setOtherError(e.target.value)}
          rows={3}
        />
        <div className="d-flex justify-content-end pe-5">
          <Button className="btn__error__report" variant="light" onClick={handleClose}>
            <b>HỦY</b>
          </Button>
          <Button
            className="btn__error__report"
            variant="light"
            onClick={onSubmit}
            disabled={disabled}
          >
            <b>GỬI</b>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalReport
