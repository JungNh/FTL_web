import * as React from 'react'
import './styles.scss'

type Props = {
  questions: Question[];
  currentQuestion: any;
  chooseQuestion: any;
}

const displayItem = (item: number) => {
  return item < 10 ? '0' + item : item;
}

const QuestionChoose: React.FC<Props> = ({ questions, currentQuestion, chooseQuestion }) => {
  return (
    <div className="questionchoose__component">
      <div className="components__header">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.2973 1.51318C0.579445 1.51318 0 2.09263 0 2.81048C0 3.52833 0.579445 4.10778 1.2973 4.10778C2.01515 4.10778 2.59459 3.52833 2.59459 2.81048C2.59459 2.09263 2.01515 1.51318 1.2973 1.51318Z" fill="#0066FF" />
          <path d="M1.2973 6.70215C0.579445 6.70215 0 7.28159 0 7.99944C0 8.71729 0.579445 9.29674 1.2973 9.29674C2.01515 9.29674 2.59459 8.71729 2.59459 7.99944C2.59459 7.28159 2.01515 6.70215 1.2973 6.70215Z" fill="#0066FF" />
          <path d="M1.2973 11.8916C0.575148 11.8916 0 12.4754 0 13.1889C0 13.9024 0.583783 14.4862 1.2973 14.4862C2.01081 14.4862 2.59459 13.9024 2.59459 13.1889C2.59459 12.4754 2.01944 11.8916 1.2973 11.8916Z" fill="#0066FF" />
          <path d="M15.9995 12.3242H3.89136V14.054H15.9995V12.3242Z" fill="#0066FF" />
          <path d="M15.9995 1.9458H3.89136V3.67554H15.9995V1.9458Z" fill="#0066FF" />
          <path d="M15.9995 7.13477H3.89136V8.86451H15.9995V7.13477Z" fill="#0066FF" />
        </svg>
        Danh sách câu hỏi
      </div>
      <div className="components__body">
        {questions.map((item: Question, index: number) => (
          <div
            key={item.id}
            className={`body__item ${currentQuestion === index ? "body__item--selected" : item.answered && item.answered.length > 0 ? "body__item--answered" : ""}`}
            onClick={() => chooseQuestion(index)}
          >
            {displayItem(index + 1)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionChoose
