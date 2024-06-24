import * as React from 'react'
import { useHistory } from 'react-router'
import { Col, Row } from 'react-bootstrap'
import { Button } from '../../../components'
import backArrow from '../../../assets/images/ico_arrowLeft-blue.svg'
import DefaultNav from '../../../components/Navbar'
import AssistiveTouch from '../../../components/AssistiveTouch'

type Props = Record<string, unknown>

const Courses: React.FC<Props> = () => {
  const history = useHistory()

  return (
    <div className="noCourses__page--detail">
      <Button.Shadow
        className="button__back"
        color="gray"
        onClick={() => history.push('/home')}
        content={<img src={backArrow} alt="bageSection" />}
      />

      <div className="container">
        <Row>
          <Col xl={12}>
            <div className="d-flex flex-column align-items-center">
              <h1
                className="fw-bold text-center mb-5"
                style={{ width: '40rem', marginTop: '10rem' }}
              >
                Bạn đang không học khóa học nào.
              </h1>
              <Button.Solid
                style={{ width: '20rem' }}
                content="Quay lại trang chủ"
                onClick={() => history.push('/home')}
              />
            </div>
          </Col>
        </Row>
      </div>
      <AssistiveTouch />

      <DefaultNav
        activePanel="study"
        changePanel={(panel: string) => console.log('change panel to ', panel)}
      />
    </div>
  )
}

export default Courses
