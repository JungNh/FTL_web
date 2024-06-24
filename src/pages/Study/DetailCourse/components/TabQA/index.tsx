import React, { useState } from 'react'

import avata from '../../../../../assets/images/avata.jpg'
import { Comment } from '../../../../../components'

type Props = Record<string, unknown>
type CommentData = {
  id: string
  content: string
  createAt: string
  like: number
  user: UserData
  subComments: SubComment[]
}

type SubComment = {
  content: string
  createAt: string
  like: number
  user: UserData
}
type UserData = { avata: string; username: string }

const TabQA: React.FC<Props> = () => {
  const [currentAnswer, setCurrentAnswer] = useState<string[]>([])
  const [isChangeFocus, setIsChangeFocus] = useState<boolean | undefined>(undefined)

  const userFake = {
    avata,
    username: 'Phạm Hồng Kỳ',
  }

  const comment1 = {
    content:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet?',
    createAt: '2020-12-12',
    like: 100,
  }
  const listComment: CommentData[] = [
    {
      id: '1',
      content:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet?',
      createAt: '2021-3-24',
      like: 999,
      user: userFake,
      subComments: [
        {
          content:
            'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet?',
          createAt: '2021-3-24',
          like: 999,
          user: userFake,
        },
      ],
    },
    {
      id: '2',
      content:
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet?',
      createAt: '2021-3-24',
      like: 999,
      user: userFake,
      subComments: [
        {
          content:
            'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet?',
          createAt: '2021-3-24',
          like: 999,
          user: userFake,
        },
        {
          content:
            'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet?',
          createAt: '2021-3-24',
          like: 999,
          user: userFake,
        },
      ],
    },
  ]

  return (
    <div className="tab__QA">
      <Comment.Host
        comment={comment1}
        user={userFake}
        onAnswer={() => setIsChangeFocus(!isChangeFocus)}
        onLike={() => console.log('Host like')}
      />
      <div className="divider__horizontal my-3" />
      <Comment.Input
        changeFocus={isChangeFocus}
        user={userFake}
        onAnswer={(ans: string) => console.log('value ans', ans)}
      />
      <div className="divider__horizontal my-3" />

      {/* List comment */}
      {listComment.map((item: CommentData, index: number) => (
        <React.Fragment key={index}>
          <Comment.Normal
            comment={item}
            user={item.user}
            onAnswer={() => setCurrentAnswer([...currentAnswer, item?.id])}
          />
          {item?.subComments?.length && (
            <div className="sub__comment">
              {item?.subComments.map((subItem: SubComment, subIndex: number) => (
                <Comment.Normal key={subIndex} isSub comment={subItem} user={subItem.user} />
              ))}

              {item?.id && currentAnswer.includes(item?.id) && (
                <Comment.Input
                  isSub
                  user={userFake}
                  onCancel={() =>
                    setCurrentAnswer([...currentAnswer.filter((ans) => ans !== item?.id)])}
                  onAnswer={() =>
                    setCurrentAnswer([...currentAnswer.filter((ans) => ans !== item?.id)])}
                />
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default TabQA
