import React, { useRef, useState, useEffect } from 'react'
import AliceCarousel from 'react-alice-carousel'
import { Image } from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input } from '../../../../components'
import ico_next from '../../../../assets/images/ico_next-black.svg'
import ico_prev from '../../../../assets/images/ico_prev-black.svg'
import ico_logo from '../../../../assets/images/ico_logo-white.svg'

import { actionActiveCardCourse } from '../../../../store/settings/actions'
import { openError, openSuccess } from '../../../../utils/common'
import { actionUserMe } from '../../../../store/login/actions'

type Props = Record<string, unknown>

const TabCardActive: React.FC<Props> = () => {
  const [cardCourse, setCardCourse] = useState<string>('')
  const [listActiveCard, setListActiveCard] = useState<any[]>([])
  const [listExpireDate, setListExpireDate] = useState<any[]>([])
  const [check, setCheck] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const userInfo = useSelector((state: any) => state.login.userInfo)

  useEffect(() => {
    const today = moment(new Date())
    const listActive: any[] = userInfo?.studentcardcodes?.filter((item: any) => {
      return (
        moment(moment(item?.expiredAt).format('DD/MM/YYYY'), 'DD/MM/YYYY').diff(today, 'days') >= 0
      )
    })
    const listExpire: any[] = userInfo?.studentcardcodes?.filter(
      (item: any) =>
        moment(moment(item?.expiredAt).format('DD/MM/YYYY'), 'DD/MM/YYYY').diff(today, 'days') < 0
    )

    console.log('listActive',listActive)
    setListActiveCard(listActive)
    setListExpireDate(listExpire)
  }, [userInfo, check])

  const carouselRef = useRef<AliceCarousel>(null)
  const dispatch = useDispatch()

  const activeMyCourse = async () => {
    try {
      if (!cardCourse?.trim()) {
        openError('Vui lòng nhập mã thẻ!')
        return
      }
      setLoading(true)

      const dataResult: any = await dispatch(
        actionActiveCardCourse({
          cardCode: cardCourse?.trim()
        })
      )

      if (!_.isEmpty(dataResult)) {
        setCardCourse('')
        console.log(dataResult, 'dataResult')
        if (dataResult?.affiliate == 'CHECK_MAIL_TO_ACTIVE') {
          openSuccess('Kích hoạt thẻ thành công. Vui lòng check mail để xác nhận mã thẻ.')
        } else {
          openSuccess('Kích hoạt thẻ thành công.')
        }
        const resultMe: any = await dispatch(actionUserMe())

        if (!_.isEmpty(resultMe) && !_.isEmpty(resultMe?.data)) {
          setListActiveCard(resultMe?.data?.studentcardcodes)
          setCheck(check + 1)
        }
      }
      setTimeout(() => setLoading(false), 2000)
    } catch (error) {
      console.log(error, 'errorr ')
    }
  }

  const renderType = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'Khóa học VIP'
      default:
        return ''
    }
  }

  const activeCardConverted = listActiveCard?.map((item: any, index: number) => (
    <div className="pr-4 card__wrapper" key={index}>
      <div className="card__item">
        <div className="card__item__top d-flex justify-content-between align-items-center">
          <div className="card__item--name">
            <p className="mb-1">Tài khoản: {userInfo?.email || ''}</p>
            <p className="mb-1">
              Ngày kích hoạt: {item?.createdAt ? moment(item?.createdAt).format('DD/MM/YYYY') : ''}
            </p>
            <p className="mb-1">Mã thẻ: {item?.cardCode?.code}</p>
          </div>
          <div className="card__item--time">
            <p className="mb-1">Ngày hết hạn</p>
            <p className="mb-1">
              {item?.expiredAt ? moment(item?.expiredAt).format('DD/MM/YYYY') : ''}
            </p>
          </div>
        </div>
        <div
          className={`
            card__item__bottom d-flex justify-content-between align-items-center
            ${index % 2 ? 'blue' : 'gold'}
          `}
        >
          <div>
            <h3 className="fw-bold mb-4">{item?.cardCode?.card?.displayName}</h3>
            <p className="fw-bold">{renderType(item?.cardCode?.card?.type)}</p>
          </div>
          <div className="d-flex align-items-end flex-column">
            <Image className="mb-4" src={ico_logo} />
            <p className="fw-bold">FutureLang</p>
          </div>
        </div>
      </div>
    </div>
  ))

  return (
    <div className="tab_card_active">
      <p className="h4 fw-bold my-3 title">Kích hoạt thẻ</p>
      <div className="tab__wrap custommer_active" style={{ marginBottom: 20 }}>
        <Input.Text
          value={cardCourse}
          placeholder="FLG0-00AA-BBBC"
          className="input__active__card"
          onChange={(e: any) => setCardCourse(e)}
          maxLength={14}
        />
        <Button.Shadow
          className="btn__small ms-3 btn_active"
          content="KÍCH HOẠT"
          onClick={() => activeMyCourse()}
          loading={loading}
        />
      </div>
      <div className="mb-5">
        Nếu bạn chưa có mã thẻ hoặc gặp vấn đề khi kích hoạt vui lòng liên hệ. Hotline: 1900252586
      </div>
      {activeCardConverted?.length ? (
        <>
          <div className="tab__wrap d-flex justify-content-between align-items-center">
            <p className="h4 fw-bold title">Thẻ đã kích hoạt</p>
            {/* <span className="btn__group--carouse d-flex">
              <Button.Shadow
                color="gray"
                className="btn__prev"
                content={<Image src={ico_prev} alt="prev" />}
                onClick={() => {
                  if (carouselRef.current !== null) {
                    carouselRef.current?.slidePrev('')
                  }
                }}
              />
              <Button.Shadow
                color="gray"
                className="btn__next"
                content={<Image src={ico_next} alt="next" />}
                onClick={() => {
                  if (carouselRef.current !== null) {
                    carouselRef.current?.slideNext('')
                  }
                }}
              />
            </span> */}
          </div>

          <AliceCarousel
            ref={carouselRef}
            autoWidth
            touchTracking
            mouseTracking
            items={activeCardConverted}
            disableDotsControls
            disableButtonsControls
          />
        </>
      ) : (
        ''
      )}

      {listExpireDate?.length ? (
        <div className="tab__wrap">
          <p className="h4 fw-bold my-3 title">Các thẻ đã hết hạn</p>
          <div className="d-flex flex-wrap">
            {listExpireDate?.map((item: any, index: number) => (
              <div key={index} className="item__outDate me-2">
                {item?.cardCode?.code}
              </div>
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default TabCardActive
