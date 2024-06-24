import React, { useMemo } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetailCourse from './DetailCourse'
import ChildrenCourse from './ChildrenCourse'
import NoCourse from './NoCourse'
import { RootState } from '../../store'
import DetailCoursePlus from './DetailCoursePlus'

type Props = Record<string, unknown>

const CoursesPage: React.FC<Props> = () => {
  const { currentCourse } = useSelector((state: RootState) => ({
    currentCourse: state.study.currentCourse
  }))
  const isChildrenCourse: boolean = useMemo(
    () => Boolean(currentCourse?.forChildren),
    [currentCourse?.forChildren]
  )

  return (
    <Switch>
      <Route path="/study/plus/:id" component={DetailCoursePlus} />
      <Route path="/study/:id" component={isChildrenCourse ? ChildrenCourse : DetailCourse} />
      <Route exact path="/study" component={NoCourse} />

      <Redirect to="/study" />
    </Switch>
  )
}

export default CoursesPage
