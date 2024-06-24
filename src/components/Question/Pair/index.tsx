import React from 'react'
import _ from 'lodash'
import Pair from './Pair'
import FillPic from './FillPic'
// import FillWordMultiPic from './FillWordMultiPic'

type Props = {
  lession?: {
    id?: number
    questionTitle?: string
    questionText?: string
    questionExplain?: string
    answers?: any[]
    audioUrl?: string
    metas?: any[]
    hasImage: boolean
  }
  onNextLession: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const PairQues: React.FC<Props> = ({
  lession,
  onNextLession,
  currentTestIndex,
  totalTest,
  backCourse,
}) => (
  <div>
    {!lession?.hasImage && (
    <Pair
      lession={lession}
      onNextLession={onNextLession}
      currentTestIndex={currentTestIndex}
      totalTest={totalTest}
      backCourse={() => backCourse()}
    />
    )}
    {lession?.hasImage && (
    <FillPic
      lession={lession}
      onNextLession={onNextLession}
      currentTestIndex={currentTestIndex}
      totalTest={totalTest}
      backCourse={() => backCourse()}
    />
      )}
    {/* {!_.isEmpty(listQuestion) && !_.isEmpty(lession?.metas) && questAudio && (
        <FillWordMultiPic
          lession={lession}
          onNextLession={onNextLession}
          currentTestIndex={currentTestIndex}
          totalTest={totalTest}
          backCourse={() => backCourse()}
        />
      )} */}
  </div>
)

export default PairQues
