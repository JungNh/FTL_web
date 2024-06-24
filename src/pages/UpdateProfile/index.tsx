import React, { useCallback, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router'
import { Button } from '../../components'
import { RootState } from '../../store'
import FormStep2 from './components/AddressAndSchool'
import FormStep1 from './components/DoBAndGender'
import './styles.scss'

const UpdateProfile = () => {
  const [step, setStep] = useState(1)
  const [dataSubmit, setDataSubmit] = useState({})
  const updateProfile = useSelector((state: RootState) => state.home.must_update)
  const location = useLocation()
  const formCAS: any = location.state || {}
  const showPopupVitan = useSelector((state: RootState) => state.home.show_popup_vitan)

  const handleSwitchStep = useCallback((step: number) => {
    setStep(step)
  }, [])

  const handleUpdateDataSubmit = useCallback((data: any) => {
    let newData = { ...dataSubmit, ...data }
    setDataSubmit(newData)
  }, [])

  if (updateProfile || showPopupVitan)
    return (
      <div className="container-update_profile container">
        {step === 2 && (
          <div className="button_back_container">
            <Button.Solid
              className={`button_back`}
              onClick={() => handleSwitchStep(1)}
              htmlType={'button'}
              content={<IoArrowBack className="fs-24 icon_button" />}
            />
          </div>
        )}
        {step === 1 && (
          <FormStep1
            dataSubmit={dataSubmit}
            handleUpdateDataSubmit={handleUpdateDataSubmit}
            handleSwitchStep={handleSwitchStep}
          />
        )}
        {step === 2 && <FormStep2 dataSubmit={dataSubmit} dataCAS={formCAS?.formCAS} />}
      </div>
    )
  else return <Redirect to="/home" />
}

export default React.memo(UpdateProfile)
