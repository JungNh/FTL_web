import * as React from 'react'
import type { FC } from 'react'

type Props = {
  children?: string
}

const MainLayout: FC<Props> = ({ children }) => <div>{children}</div>

export default MainLayout
