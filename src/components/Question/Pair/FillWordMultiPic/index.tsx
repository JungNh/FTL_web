import {
  Row, Col, Modal, Image,
} from 'react-bootstrap'
import React, { useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import Button from '../../../Button'
import NavbarTest from '../../../NavbarTest'
import ResultAns from '../../ResultAns'
import backArrow from '../../../../assets/images/ico_arrowLeft-blue.svg'
import ico_Tshirt from '../../../../assets/images/ico_Tshirt.svg'

type Props = {
  lession?: any
  onNextLession: (results?: boolean) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const FillWord: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
  backCourse,
}) => {
  const [feedBackResult, setFeedBackResult] = useState<boolean | null>(null)
  const [userAns, setUserAns] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [currentEdit, setCurrentEdit] = useState<number | null>(null)
  // const history = useHistory()
  const onCheck = () => {
    const finalAns = []
    for (const key in userAns) {
      if (Object.prototype.hasOwnProperty.call(userAns, key)) {
        const element = userAns[key]
        finalAns.push(element)
      }
    }
    if (finalAns.join('/') === lession?.correctAns) {
      setFeedBackResult(true)
    } else {
      setFeedBackResult(false)
    }
  }

  const onHint = () => {
    Swal.fire({
      title: 'Gợi ý',
      text: 'Bạn có chắc chắn muốn xem gợi ý',
      confirmButtonText: 'Tôi muốn xem',
      showCancelButton: true,
      cancelButtonText: 'Không, tôi có thể làm được',
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          Swal.fire('Gợi ý !', lession?.hint, 'info')
        }
        return ''
      })
      .catch((error) => console.error(error))
  }
  const onSkip = () => {
    Swal.fire({
      title: 'Bạn muốn bỏ qua bài tập này',
      text: 'Bài tập này sẽ không được tính điểm',
      confirmButtonText: 'Bỏ qua',
      showCancelButton: true,
      cancelButtonText: 'Ở lại',
      icon: 'warning',
    })
      .then((results: { isConfirmed: boolean }) => {
        if (results.isConfirmed) {
          onNextLession(false)
        }
        return ''
      })
      .catch((error) => console.error(error))
  }

  const onClickSpan = (index: number) => {
    setShowModal(true)
    setCurrentEdit(index)
  }
  const convertQuestion = useMemo(() => {
    const questionConvert = (lession?.questionText || '')
      .replaceAll('____', '/---/____/---/')
      .split('/---/')
    return questionConvert.map((item: string, index: number) => {
      if (item === '____') {
        return (
          <span
            key={index}
            className="span__with__text cursor-pointer"
            style={{
              color: userAns[index] ? 'black' : 'transparent',
            }}
            onClick={() => {
              onClickSpan(index)
            }}
          >
            {userAns[index] || '........'}
          </span>
        )
      }
      return <span key={index}>{item}</span>
    })
  }, [lession?.questionText, userAns])

  const onChangeAns = (ans: string) => {
    const newAns = [...userAns]
    if (currentEdit !== null) {
      newAns[currentEdit] = ans
      setUserAns(newAns)
      setCurrentEdit(null)
      setShowModal(false)
    }
  }

  return (
    <div className="lession__fillWordMultiPic pb-5">
      <p className="subTitle__lession">Điền vào chỗ trống</p>
      <Button.Shadow
        className="button__back"
        color="gray"
        content={<img src={backArrow} alt="back" />}
        onClick={() => backCourse()}
      />

      <div className="question__holder">{convertQuestion}</div>

      <NavbarTest
        currentTest={(currentTestIndex || 0) + 1}
        totalTest={totalTest}
        onCheck={onCheck}
        onHint={onHint}
        onSkip={onSkip}
      />

      <ResultAns
        onContinue={() => setFeedBackResult(null)}
        show={feedBackResult !== null}
        correct={!!feedBackResult}
        questionId={lession?.id || 0}
      />

      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>
          <Row>
            {lession?.answers?.map((item: string, index: number) => (
              <Col key={index} xs={3} className="mb-3" onClick={() => onChangeAns(item)}>
                <div className="card__question">
                  <Image src={ico_Tshirt} />
                  <p className="fw-bold image__text">{item}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default FillWord
