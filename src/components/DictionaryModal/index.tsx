import * as React from 'react'
import { useState } from 'react'
import { Modal, Image } from 'react-bootstrap'
import Button from '../Button'
import ico_sound from '../../assets/images/ico_sound-gray.svg'
import TabSentence from './components/TabSentence'
import TabEngViet from './components/TabEngViet'
import TabGrammar from './components/TabGrammar'
import TabSynonymous from './components/TabSynonymous'
import TabEngEng from './components/TabEngEng'
import TabSpecialized from './components/TabSpecialized'

type Props = {
  isShow: boolean
  closeModal: () => void
}

type Active = 'sentence' | 'engViet' | 'grammar' | 'synonymous' | 'specialized' | 'engEng'

const DictionaryModal: React.FC<Props> = ({ isShow, closeModal }) => {
  const [active, setActive] = useState<Active>('sentence')
  return (
    <div>
      <Modal
        size="lg"
        className="dictionary__modal"
        show={isShow}
        onHide={() => closeModal()}
        dialogClassName="modal__text"
        centered
      >
        <Modal.Header closeButton>
          <div className="modal__header--title">
            Ý nghĩa của{' '}
            <b>
              <i>breach</i>
            </b>{' '}
            trong tiếng Anh
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center">
            <p className="h2 fw-bold">breach</p>
            <p className="mb-0 mx-3">[bri:t∫]</p>
            <Image className="cursor-pointer" src={ico_sound} />
          </div>

          {/* BUTTON LIST  */}
          <div className="d-flex flex-wrap nav__container mb-4">
            <Button.Shadow
              color={active === 'sentence' ? 'blue' : 'gray'}
              onClick={() => setActive('sentence')}
              className="btn__options me-2"
              content="TRA CÂU"
            />
            <Button.Shadow
              color={active === 'engViet' ? 'blue' : 'gray'}
              onClick={() => setActive('engViet')}
              className="btn__options me-2"
              content="ANH - VIỆT"
            />
            <Button.Shadow
              color={active === 'grammar' ? 'blue' : 'gray'}
              onClick={() => setActive('grammar')}
              className="btn__options me-2"
              content="NGỮ PHÁP"
            />
            <Button.Shadow
              color={active === 'synonymous' ? 'blue' : 'gray'}
              onClick={() => setActive('synonymous')}
              className="btn__options me-2"
              content="ĐỒNG NGHĨA"
            />
            <Button.Shadow
              color={active === 'specialized' ? 'blue' : 'gray'}
              onClick={() => setActive('specialized')}
              className="btn__options me-2"
              content="CHUYÊN NGÀNH"
            />
            <Button.Shadow
              color={active === 'engEng' ? 'blue' : 'gray'}
              onClick={() => setActive('engEng')}
              className="btn__options me-2"
              content="ANH - ANH"
            />
          </div>

          {/* TAB LIST */}
          <div>
            {active === 'sentence' && <TabSentence />}
            {active === 'engViet' && <TabEngViet />}
            {active === 'grammar' && <TabGrammar />}
            {active === 'synonymous' && <TabSynonymous />}
            {active === 'specialized' && <TabSpecialized />}
            {active === 'engEng' && <TabEngEng />}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DictionaryModal
