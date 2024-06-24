import * as React from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { Button } from '../../../../components'
import ico_korean from '../../../../assets/images/ico_korean.svg'
import ico_america from '../../../../assets/images/ico_anh-my.svg'
import ico_japan from '../../../../assets/images/ico_japan.svg'
import ico_chinese from '../../../../assets/images/ico_chinese.svg'

import lang_bigben from '../../../../assets/images/lang_bigben.svg'
import lang_liberty from '../../../../assets/images/lang_liberty.svg'
import lang_japanScreen from '../../../../assets/images/lang_japan.svg'
import lang_chinese from '../../../../assets/images/lang_chinese.svg'

type Props = {
  active: string
  setActive: (data: string) => void
}

const LanguageSection: React.FC<Props> = ({ active, setActive }) => {
  const switchImage = () => {
    switch (active) {
      case 'ko':
        return lang_bigben
      case 'en':
        return lang_liberty
      case 'ja':
        return lang_japanScreen
      case 'cn':
        return lang_chinese
      default:
        return ''
    }
  }
  return (
    <div className="language__section">
      <div>
        <p className="section--subTitle">Hãy chọn</p>
        <p className="section--title">Ngôn ngữ muốn học</p>
      </div>
      <div className="image__holder">
        <SwitchTransition>
          <CSSTransition
            type="out-in"
            key={active}
            addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
            classNames="fade"
          >
            <img
              draggable={false}
              className="image__language"
              src={switchImage()}
              alt="language_school"
            />
          </CSSTransition>
        </SwitchTransition>
      </div>
      <div className="options__group px-3 d-flex justify-content-center flex-wrap">
        <Button.Shadow
          color={active === 'ko' ? 'blue' : 'gray'}
          className="btn__options m-2"
          upperCase={false}
          disabled
          onClick={() => setActive('ko')}
          content={(
            <div className="image__flag">
              <img src={ico_korean} alt="anh-anh" />
              Hàn Quốc
            </div>
          )}
        />
        <Button.Shadow
          color={active === 'en' ? 'blue' : 'gray'}
          className="btn__options m-2"
          upperCase={false}
          onClick={() => setActive('en')}
          content={(
            <div className="image__flag">
              <img src={ico_america} alt="anh-mỹ" />
              Tiếng Anh
            </div>
          )}
        />
        <Button.Shadow
          color={active === 'ja' ? 'blue' : 'gray'}
          className="btn__options m-2"
          upperCase={false}
          disabled
          onClick={() => setActive('ja')}
          content={(
            <div className="image__flag">
              <img src={ico_japan} alt="nhật" />
              Nhật
            </div>
          )}
        />
        <Button.Shadow
          color={active === 'cn' ? 'blue' : 'gray'}
          className="btn__options m-2"
          upperCase={false}
          disabled
          onClick={() => setActive('cn')}
          content={(
            <div className="image__flag">
              <img src={ico_chinese} alt="trung quốc" />
              Trung Quốc
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default LanguageSection
