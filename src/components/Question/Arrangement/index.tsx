import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import ArrangWord from './ArrangWord'
import ArrangWithPic from './ArrangSentencePic'
import ArrangWithSound from './ArrangSentenceSound'
import NewArrangement from './NewArrangement'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import start_cheer from '../../../assets/images/start_cheer.png'

type Props = {
  lession?: {
    id?: number
    questionTitle?: string
    questionText?: string
    questionExplain?: string
    answers?: any[]
    audioUrl?: string
    metas?: any[]
    type?: string
  }
  onNextLession: () => void
  onSetResults: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const Arrangement: React.FC<Props> = ({
  lession,
  onNextLession,
  onSetResults,
  currentTestIndex,
  totalTest,
  backCourse
}) => {
  const [listQuestion, setListQuestion] = useState<any[]>([])
  const [questImage, setQuestImage] = useState<string>('')
  const [questAudio, setQuestAudio] = useState<string>('')
  const { numberCorrect, showCheer } = useSelector((state: RootState) => state.lesson)

  useEffect(() => {
    // if (lession?.type === 'new_arrange') {
    if (!_.isEmpty(lession)) {
      const listAns: any = lession?.questionText
      setListQuestion(listAns)
    } else {
      setListQuestion([])
    }
  }, [lession])

  return (
    <div>
      {lession?.type === 'new_arrange' && (
        <NewArrangement
          lession={lession}
          onNextLession={onNextLession}
          onSetResults={onSetResults}
          currentTestIndex={currentTestIndex}
          totalTest={totalTest}
          backCourse={() => backCourse()}
          metas={lession?.metas}
        />
      )}
      {lession?.type !== 'new_arrange' && (
        <ArrangWord
          lession={lession}
          onNextLession={onNextLession}
          onSetResults={onSetResults}
          currentTestIndex={currentTestIndex}
          totalTest={totalTest}
          backCourse={() => backCourse()}
          metas={lession?.metas}
        />
      )}
    </div>
  )
}

export default Arrangement
