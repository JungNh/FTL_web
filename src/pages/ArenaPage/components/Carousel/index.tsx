import React, { FC, useRef, useEffect, useState } from 'react'
import AliceCarousel from 'react-alice-carousel'
import ReactHtmlParser from 'react-html-parser'
import { useHistory } from 'react-router'
import { Modal, Image } from 'react-bootstrap'
import { format } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { actionGetAllHomeSlide, actionGetAllSlider } from '../../../../store/home/actions'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import './styles.scss'
import { convertUrl, openInNewTab } from '../../../../utils/common'
import { RootState } from '../../../../store'

type Props = Record<string, unknown>
type SliderType = {
  imageUrl?: string
  model?: string
  sequenceNo?: number
  sourceId?: number
  title?: string
}

export type ItemSlidShow = {
  id?: string
  service?: string
  title?: string
  sequenceNo?: number
  imageUrl?: string
  device?: number
  status?: number
  description?: string
  timeStart?: string
  timeEnd?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}
// https://thecoffeehouse.com/
const Carousel: FC<Props> = () => {
  const carousel = useRef<AliceCarousel>(null)
  const [isViewPost, setIsViewPost] = useState<boolean>(false)
  const [dataPost, setDataPost] = useState<ItemSlidShow>()
  const dispatch = useDispatch()
  const { slideShow } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    dispatch(actionGetAllHomeSlide({ sevice: 'sevice' }))
  }, [dispatch])

  // async function clickfunc(url: string) {
  //   var xhttp = new XMLHttpRequest()

  //   xhttp.open('GET', url, true)
  //   xhttp.setRequestHeader('Access-Control-Allow-Headers', '*')
  //   xhttp.setRequestHeader('Content-type', 'application/ecmascript')
  //   xhttp.setRequestHeader('Access-Control-Allow-Origin', '*')
  //   xhttp.onreadystatechange = function () {
  //     console.log(xhttp.status, 'xhttp.status')

  //     if (xhttp.status == 200) {
  //       openInNewTab(url)
  //     } else {
  //       alert('Khong ton tai đường link!')
  //     }
  //   }
  //   xhttp.send()
  // }

  const handleOnlickSlide = (item: ItemSlidShow) => {
    if (item.description?.includes('https://')) {
      let parser = new DOMParser()
      const doc = parser.parseFromString(item.description, 'text/html')
      const links: any = doc.getElementsByTagName('a')[0].getAttribute('href')
      openInNewTab(links)
    }

    // setDataPost(item)
    // setIsViewPost(true)
  }

  return (
    <div className="bannerHome">
      <AliceCarousel
        infinite
        autoPlay
        autoPlayInterval={3000}
        mouseTracking
        autoWidth
        onSlideChange={(e: any) => {}}
        ref={carousel}
        renderPrevButton={() => <FaChevronCircleLeft className={`ico__prev`} size={35} />}
        renderNextButton={() => <FaChevronCircleRight className={`ico__next`} size={35} />}
      >
        {slideShow?.map((item: ItemSlidShow, index: number) => (
          <div className="carousel__wrapper" key={index} onClick={() => handleOnlickSlide(item)}>
            <div
              className="item__baner"
              style={{ borderBottomRightRadius: 14, borderBottomLeftRadius: 14 }}
            >
              <img
                className="image__baner"
                key={index}
                src={item?.imageUrl}
                alt=""
                style={{ borderBottomRightRadius: 14, borderBottomLeftRadius: 14 }}
              />
            </div>
          </div>
        ))}
      </AliceCarousel>
      <Modal
        size="xl"
        show={isViewPost}
        onHide={() => {
          setIsViewPost(false)
          setDataPost({})
        }}
        style={{ overflow: 'auto' }}
      >
        <div className="p-3">
          <div className="d-flex justify-content-end mb-3">
            <small className="ms-auto">
              {dataPost?.createdAt
                ? format(new Date(dataPost?.createdAt), 'eeee, dd/MM/yyyy, HH:mm (z)', {
                    locale: viLocale
                  })
                : ''}
            </small>
          </div>
          <h1 className="fw-bold">{dataPost?.title}</h1>
          <Image width="100%" className="mb-3" src={convertUrl(dataPost?.imageUrl, 'image')} />
          <div className="html__container">{ReactHtmlParser(dataPost?.description)}</div>
          <div className="d-flex justify-content-end mb-3">
            <h4 className="fw-bold fst-italic">{dataPost?.createdBy}</h4>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Carousel
