import * as React from 'react'
import { useState } from 'react'
import { ProgressBar } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { format } from 'date-fns'
import Swal from 'sweetalert2'
import { Button } from '../../components'

import backArrow from '../../assets/images/ico_arrowLeft-blue.svg'
import ico_success from '../../assets/images/ico_success-yellow.svg'

import AgeSection from './components/Age'
import LanguageSection from './components/Language'
import LearnPurposeSection from './components/LearnPurpose'
import TargetDailySection from './components/TargetDaily'
import { actionCreateProfile } from '../../store/login/actions'
import Level from './components/Level'

type Props = unknown

type UserProfile = {
  language: string
  dob: number
  reason: string[]
  target: string
  scope: string
  scheduleLearning: string
}
type Views = 'ageSection' | 'language' | 'learnPurpose' | 'targetDaily' | 'level'

const Direction: React.FC<Props> = () => {
  const [currenView, setCurrentView] = useState<Views>('ageSection')
  const [userProfiles, setUserProfiles] = useState<UserProfile>({
    language: 'en',
    dob: 0,
    reason: [],
    target: '',
    scope: 'basic',
    scheduleLearning: '',
  })
  const [hoursActive, setHoursActive] = useState('08')
  const [minutesActive, setMinutesActive] = useState('00')
  const [dayPartActive, setDayPartActive] = useState<'am' | 'pm'>('am')

  const history = useHistory()
  const dispatch = useDispatch()

  const convertViewToPercent = () => {
    switch (currenView) {
      case 'ageSection':
        return 0
      case 'language':
        return 25
      case 'learnPurpose':
        return 50
      case 'targetDaily':
        return 75
      case 'level':
        return 100
      default:
        return 0
    }
  }

  const submitProfile = async () => {
    const response: any = await dispatch(
      actionCreateProfile({
        language: userProfiles.language,
        dob: format(new Date(userProfiles.dob, 1, 1), 'yyyy-MM-dd'),
        reason: userProfiles.reason.join(','),
        target: userProfiles.target,
        scope: userProfiles.scope,
        scheduleLearning: `${hoursActive} - ${minutesActive} - ${dayPartActive}` || '',
      })
    )
    if (response?.data && response?.status === 200) {
      history.push('/home')
    } else {
      Swal.fire('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  const changeView = (action: 'prev' | 'next') => {
    if (action === 'next') {
      switch (currenView) {
        case 'ageSection':
          setCurrentView('language')
          break
        case 'language':
          setCurrentView('learnPurpose')
          break
        case 'learnPurpose':
          if (userProfiles.reason.length > 0) {
            setCurrentView('targetDaily')
          } else {
            Swal.fire('Vui chọn mục đích học')
          }
          break
        case 'targetDaily':
          if (userProfiles.scope !== '') {
            setCurrentView('level')
          } else {
            Swal.fire('Vui chọn mục tiêu ngày')
          }
          break
        case 'level':
          submitProfile()
          break
        default:
          break
      }
    } else {
      switch (currenView) {
        case 'language':
          setCurrentView('ageSection')
          break
        case 'learnPurpose':
          setCurrentView('language')
          break
        case 'targetDaily':
          setCurrentView('learnPurpose')
          break
        case 'level':
          setCurrentView('targetDaily')
          break
        default:
          break
      }
    }
  }

  return (
    <div className="direction__page">
      <Button.Shadow
        className="button__back"
        color="gray"
        disabled={currenView === 'ageSection'}
        onClick={() => changeView('prev')}
        content={
          <img src={currenView === 'ageSection' ? backArrow : backArrow} alt="bageSection" />
        }
      />
      {/* Step */}
      {currenView === 'ageSection' && (
        <AgeSection
          active={userProfiles.dob}
          setActive={(dob: number) => setUserProfiles({ ...userProfiles, dob })}
        />
      )}
      {currenView === 'language' && (
        <LanguageSection
          active={userProfiles.language}
          setActive={(language: string) => setUserProfiles({ ...userProfiles, language })}
        />
      )}
      {currenView === 'learnPurpose' && (
        <LearnPurposeSection
          active={userProfiles.reason}
          setActive={(reason: string[]) => setUserProfiles({ ...userProfiles, reason })}
        />
      )}
      {currenView === 'targetDaily' && (
        <TargetDailySection
          active={userProfiles.target}
          setActive={(target: string) => setUserProfiles({ ...userProfiles, target })}
          hoursActive={hoursActive}
          setHoursActive={(data: string) => setHoursActive(data)}
          minutesActive={minutesActive}
          setMinutesActive={(data: string) => setMinutesActive(data)}
          dayPartActive={dayPartActive}
          setDayPartActive={(data: 'am' | 'pm') => setDayPartActive(data)}
        />
      )}
      {currenView === 'level' && (
        <Level
          active={userProfiles.scope}
          setActive={(scope: string) => setUserProfiles({ ...userProfiles, scope })}
        />
      )}

      {/* ProgressBar */}
      <div className="progress__container">
        <ProgressBar className="progess__line" variant="success" now={convertViewToPercent()} />
        <Button.Solid
          className="continue__btn"
          onClick={() => changeView('next')}
          content={(
            <div className="flex justify-content-center align-items-center fw-bold">
              <img src={ico_success} alt="success_ico" className="me-2 py-1" />
              TIẾP TỤC
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default Direction
