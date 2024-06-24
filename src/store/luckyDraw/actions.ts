import _ from 'lodash'

import { arenaApi as api } from '../../lib'
import { openError } from '../../utils/common'
import { Types } from './types'

export const getGifts = (id: number) => async (dispatch: any) => {
    try {
        await dispatch({ type: Types.SET_DRAW_LIST_STATE, payload: { gifts: undefined } })
        const response = await api.post("/contests/get_gifts_list/", {
            round_id: id,
            start: 0
        });
        if (response.data.c === 1) {
            dispatch({ type: Types.SET_DRAW_LIST_STATE, payload: { gifts: response.data.d } })
        } else {
            dispatch({ type: Types.SET_DRAW_LIST_STATE, payload: { gifts: null } })
        }
    } catch (error) {
        if (error instanceof Error) openError(error.message)
        return []
    }
}

export const draw = (id: number, callback: Function) => async () => {
    try {
        const response = await api.post("/contests/dial_to_receive_gifts/", {
            round_id: id,
            start: 0
        });
        if (response.data.c === 1) {
            callback(response.data.d?.[0]?.id)
        }
    } catch (error) {
        if (error instanceof Error) openError(error.message)
        return []
    }
}