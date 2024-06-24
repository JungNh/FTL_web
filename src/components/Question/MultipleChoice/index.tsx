import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import MultiChoiceText from './MultiChoice'
import MultiChoicePicAndAudio from './MultiChoiceWithPic'
import MultiChoiceWithSound from './MultiChoiceSound'
import MultiChoicePicAns from './MultiChoicePicsAns'
import start_cheer from '../../../assets/images/start_cheer.png'
import { LessionType } from './type'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

type Props = {
  lession?: LessionType
  onNextLession: () => void
  onSetResults: (data: any) => void
  currentTestIndex?: number
  totalTest?: number
  backCourse: () => void
}

const MultipleChoice: React.FC<Props> = ({
  lession,
  onNextLession,
  onSetResults,
  currentTestIndex,
  totalTest,
  backCourse,
}) => {
  const [listQuestion, setListQuestion] = useState<any[]>([])
  const [questImage, setQuestImage] = useState<string>('')
  const [questAudio, setQuestAudio] = useState<string>('')
  const { numberCorrect, showCheer } = useSelector((state: RootState) => state.lesson)

  useEffect(() => {
    if (!_.isEmpty(lession) && !_.isEmpty(lession?.answers)) {
      const listAns: any = lession?.answers
      setListQuestion(listAns)
    } else {
      setListQuestion([])
    }
    if (!_.isEmpty(lession) && !_.isEmpty(lession?.metas)) {
      const listMetas: any = lession?.metas
      const objImage: any = listMetas.find((item: any) => item?.key === 'image')
      const objAudio: any = listMetas.find((item: any) => item?.key === 'audio')
      if (!_.isEmpty(objImage)) {
        setQuestImage(objImage?.value)
      } else {
        setQuestImage('')
      }
      if (!_.isEmpty(objAudio)) {
        setQuestAudio(objAudio?.value)
      } else {
        setQuestAudio('')
      }
    }
  }, [lession])
  return (
    <div>
      {!_.isEmpty(listQuestion)
        && _.isEmpty(lession?.metas)
        && listQuestion[0].imageUrl === null && (
          <MultiChoiceText
            lession={lession}
            onNextLession={onNextLession}
            onSetResults={onSetResults}
            currentTestIndex={currentTestIndex}
            totalTest={totalTest}
            backCourse={() => backCourse()}
          />
        )}
      {!_.isEmpty(listQuestion)
        && _.isEmpty(lession?.metas)
        && listQuestion[0].imageUrl !== null && (
          <MultiChoicePicAns
            lession={lession}
            onNextLession={onNextLession}
            onSetResults={onSetResults}
            currentTestIndex={currentTestIndex}
            totalTest={totalTest}
            backCourse={() => backCourse()}
          />
        )}
      {!_.isEmpty(listQuestion) && !_.isEmpty(lession?.metas) && !questImage && questAudio && (
        <MultiChoiceWithSound
          lession={lession}
          onNextLession={onNextLession}
          onSetResults={onSetResults}
          currentTestIndex={currentTestIndex}
          totalTest={totalTest}
          backCourse={() => backCourse()}
        />
      )}
      {!_.isEmpty(listQuestion) && !_.isEmpty(lession?.metas) && questImage && (
        <MultiChoicePicAndAudio
          lession={lession}
          onNextLession={onNextLession}
          onSetResults={onSetResults}
          currentTestIndex={currentTestIndex}
          totalTest={totalTest}
          backCourse={() => backCourse()}
        />
      )}
    </div>
  )
}

export default MultipleChoice
