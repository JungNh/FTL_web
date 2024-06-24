import * as React from 'react'
import { Spinner } from 'react-bootstrap'
import './styles.scss'

import GiftItem from './components/GiftItem'
import PopupContact from './components/PopupContact'
import ContainerWithBack from '../../components/ContainerWithBack'
import { Context, Provider } from './components/LazyLoadingProvider'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { getGifts } from '../../store/gifts/actions'

const Index: React.FC = () => {
  // =================================================== LAYZY ===================================================
  const { data: gifts, isLoading, error, isEnded, loadDataChunk } = React.useContext(Context)
  const [element, setElement] = React.useState<HTMLDivElement | null>(null)
  const observer = React.useRef<IntersectionObserver | null>(null)
  const loader = React.useRef(loadDataChunk)

  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getGifts())
  }, [])

  React.useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && loader.current) loader.current()
      },
      { threshold: 1 }
    )
  }, [])

  React.useEffect(() => {
    loader.current = loadDataChunk
  }, [loadDataChunk])

  React.useEffect(() => {
    loader.current = loadDataChunk
  }, [loadDataChunk])

  React.useEffect(() => {
    if (element) {
      observer.current?.observe(element)
    }
    return () => {
      if (element) {
        observer.current?.unobserve(element)
      }
    }
  }, [element])
  // =================================================== HOOKS ===================================================
  const [open, setOpen] = React.useState(false)

  return (
    <ContainerWithBack background="#f5f5f5" to="/arena">
      <div className="gifts__component">
        <h1>Quà của bạn</h1>
        <div className="gifts__wrapper">
          {gifts?.map((item: any) => (
            <GiftItem item={item} onClick={() => setOpen(true)} />
          ))}
          {isLoading && <Spinner animation="grow" className="loading__icon" />}
          {!isLoading && !error && !isEnded && <div ref={setElement} />}
        </div>
      </div>
      <PopupContact open={open} onClose={() => setOpen(false)} />
    </ContainerWithBack>
  )
}

const Gifts: React.FC = () => {
  return (
    <Provider>
      <Index />
    </Provider>
  )
}

export default Gifts
