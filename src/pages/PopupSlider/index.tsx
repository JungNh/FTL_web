import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { apiCore } from '../../lib-core'
import { RootState } from '../../store'
import { format } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import { Image } from 'react-bootstrap'
import { convertUrl } from '../../utils/common'
import ReactHtmlParser from 'react-html-parser'
import ContainerWithBack from '../../components/ContainerWithBack'

const PopupSlider = () => {
  const { item_popup } = useSelector((state: RootState) => state.popup)

  return (
    <ContainerWithBack>
      <div className="p-3">
        <div className="d-flex justify-content-end mb-3">
          <small className="ms-auto">
            {item_popup?.createdAt
              ? format(new Date(item_popup?.createdAt), 'eeee, dd/MM/yyyy, HH:mm (z)', {
                  locale: viLocale
                })
              : ''}
          </small>
        </div>
        <h1 className="fw-bold">{item_popup?.title}</h1>
        {/* <Image width="100%" className="mb-3" src={convertUrl(item_popup?.imageUrl, 'image')} /> */}

        <div className="html__container">{ReactHtmlParser(item_popup?.content)}</div>
        <div className="d-flex justify-content-end mb-3">
          <h4 className="fw-bold fst-italic">{item_popup?.createdUser?.email}</h4>
        </div>
      </div>
    </ContainerWithBack>
  )
}

export default React.memo(PopupSlider)
