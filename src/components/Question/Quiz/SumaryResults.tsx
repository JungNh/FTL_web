import React, { useEffect, useMemo, useState } from 'react'
import _ from 'lodash'
import Button from '../../Button'
import { SumaryModal } from '../..'

type Props = {
  goBack: (data: string) => void
  currentResult: any[]
  doingTime: { start: string | null; duration: number | null }
  highestScore: number
}

const SummaryResults: React.FC<Props> = ({
  goBack,
  currentResult,
  doingTime,
  highestScore
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const doingTimeResult = useMemo(() => doingTime.duration || 0, [doingTime.duration])

  useEffect(() => {
    setShowModal(true)
  }, [currentResult && doingTime])

  const info = useMemo(() => {
    const score = _.sumBy(currentResult, 'score') || 0
    const correct = currentResult?.filter((item: any) => item.result).length || 0
    const total = currentResult?.length || 1
    return { score, total, correct }
  }, [currentResult])

  const FooterCustom = () => (
    <div className="d-flex justify-content-center mx-auto" style={{ maxWidth: '30rem' }}>
      <Button.Solid
        // color="gray"
        className="my-3 mx-3 prev__button text-uppercase fw-bold"
        content="Luyện lại"
        onClick={() => goBack('repeat')}
      />
      <Button.Solid
        className="my-3 mx-3 text-uppercase fw-bold"
        content="Đáp án"
        onClick={() => goBack('answer')}
      />
    </div>
  )

  return (
    <SumaryModal
      showModal={showModal}
      closeButton={false}
      countAnser={`${info.correct} / ${info.total}`}
      unitScore={Math.round((100 / info.total) * info.correct)}
      setShowModal={setShowModal as any}
      durationTime={doingTimeResult}
      footerCustom={<FooterCustom />}
      highestScore={highestScore}
    />
  )
}

export default SummaryResults
