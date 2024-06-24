import * as React from 'react'

type Props = {
  string: string
}

const DisplayMarkup: React.FC<Props> = ({ string }) => {
  function createMarkup() {
    return { __html: string }
  }
  return <div dangerouslySetInnerHTML={createMarkup()} />
}

export default DisplayMarkup
