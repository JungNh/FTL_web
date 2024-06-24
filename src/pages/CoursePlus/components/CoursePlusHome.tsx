import React, { useRef, useState, useCallback, useEffect } from 'react'
import AliceCarousel from 'react-alice-carousel'
import { Card } from 'react-bootstrap'
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { RootState } from '../../../store'
import { convertUrl } from '../../../utils/common'
import CardCode from '../../Homepage/CardCode'
import CourseTabs from './CourseTabs'
import _ from 'lodash'
import '../style.scss'

interface Props
{
   dataPlus: any
   handleGetDataPlus: (language: string, index: number) => void
   handleGetCourse: (id: number) => void
}

const CoursePlusHome = ({ dataPlus, handleGetDataPlus, handleGetCourse }: Props) =>
{
   const [rightBtnDisabled, setRightBtnDisabled] = useState<boolean>(true)

   // const [carouselButtonDisabled, setCarouselButtonDisabled] = useState({
   //    right: true,
   //    left: true
   // })
   const [dataCardCode, setDataCardCode] = useState({
      isOpen: false,
      status: 'active'
   })
   const listPurchased = useSelector((state: RootState) => state.study.listPurcharse)
   const listdata = listPurchased?.data?.length ? listPurchased?.data : [-1]
   // const [listPurchars, setListPurchars] = useState()

   const carousel = useRef<AliceCarousel>(null)

   const history = useHistory()

   const handleOpen = () =>
   {
      setDataCardCode({
         isOpen: true,
         status: 'active'
      })
   }

   const handleClose = useCallback(() =>
   {
      setDataCardCode({
         isOpen: false,
         status: 'active'
      })
   }, [])

   // useEffect(() =>
   // {
   //    setCarouselButtonDisabled({
   //       right: dataPlus?.data?.length > 4 ? false : true,
   //       left: true
   //    })
   // }, [dataPlus])

   useEffect(() =>
   {
      if (dataPlus?.data.length > 4)
      {
         setRightBtnDisabled(false)
      }
   }, [dataPlus])

   // console.log("DATA PLUS: ", dataPlus.data);
   // console.log("TEST daPlus.data: ", dataPlus?.data.length);
   
   
   return (
      <Card className="plus-container">
         <Card.Header className="plus-header">
            <span className="plus-title">CÁC KHÓA HỌC PLUS</span>
            <span className="plus-link" onClick={() => history.push('/courses-plus')}>
               Tất cả
            </span>
         </Card.Header>
         <Card.Body className="plus-body">
            <CourseTabs active={dataPlus.active} handleGetDataPlus={handleGetDataPlus} />
            <div className="plus-cards">
               <AliceCarousel
                  mouseTracking
                  autoWidth
                  // onSlideChanged={(e: any) =>
                  // {
                  //    setCarouselButtonDisabled({
                  //       right: e?.item >= dataPlus?.data?.length - 4 ? true : false,
                  //       left: e?.item === 0 ? true : false
                  //    })
                  // }}
                  onSlideChanged={(e: any) =>
                  {
                     console.log("111: ", e?.item)
                     console.log("222: ",dataPlus?.data.length);
                     
                     if (e?.item >= dataPlus?.data.length-4)
                     {  
                        setRightBtnDisabled(true)
                     }
                     else
                     {
                        setRightBtnDisabled(false)
                     }
                  }}
                  ref={carousel}
                  disableDotsControls
                  // disableButtonsControls
                  activeIndex={0}
                  
                  renderPrevButton={({ isDisabled }: any) => (
                     <FaChevronCircleLeft className={`plus-btn__left ${isDisabled ? 'disabled' : ''}`} />
                  )}
                  renderNextButton={() => (
                     <FaChevronCircleRight
                        className={`plus-btn__right ${rightBtnDisabled ? 'disabled' : ''}`}
                     />
                  )}
               >
                  {_.sortBy(dataPlus?.data, 'sequenceNo').map((item: any) => (
                     <div
                        key={item.id}
                        className={`item__course--wrapper plus-card ${item?.models === 'contest' ? 'content__item' : ''
                           }`}
                     >
                        <div className="item__course" onClick={() => handleGetCourse(item?.id)}>
                           <div className="relative">
                              <img
                                 className="image__course card-image"
                                 src={convertUrl(item.imageUrl, 'image') || ''}
                                 alt=""
                              />
                           </div>
                        </div>
                        <div className="card-title" onClick={() => handleGetCourse(item?.id)}>
                           {item.name}
                        </div>
                        <div className={`card-old-price ${listdata.includes(item.id) && 'plus-purchased'}`}>
                           đ {item.oldPrice?.toLocaleString('en-US')}
                        </div>

                        {/* ================================== */}
                        <div
                           className="card-new-price"
                           onClick={
                              listdata.includes(item.id) ? () => handleGetCourse(item?.id) : handleOpen
                           }
                        // onClick={() => console.log('item.isPurchased', item.isPurchased, item.id)}
                        >
                           {listdata.includes(item.id) ? (
                              <span>Vào học</span>
                           ) : (
                              <>
                                 <span className="mr-1">đ</span>
                                 <span>{item.newPrice?.toLocaleString('en-US')}</span>
                              </>
                           )}
                           <span>
                              <MdKeyboardArrowRight className="card-new-price-icon" />
                           </span>
                        </div>
                        {/* ================================== */}
                     </div>
                  ))}
               </AliceCarousel>
               {/* <FaChevronCircleLeft
            onClick={() => carousel.current?.slidePrev(-1)}
            className={`plus-btn__left ${carouselButtonDisabled.left && 'disabled'}`}
          />
          <FaChevronCircleRight
            onClick={() => carousel.current?.slideNext(1)}
            className={`plus-btn__right ${carouselButtonDisabled.right && 'disabled'}`}
          /> */}
            </div>
         </Card.Body>
         <CardCode
            dataCardCode={dataCardCode}
            handleClose={handleClose}
            reLoadData={() => console.log('CoursePlusHome')}
         />
      </Card>
   )
}

export default React.memo(CoursePlusHome)
