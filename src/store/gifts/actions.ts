import _ from 'lodash'

import { arenaApi as api } from '../../lib'
import { openError } from '../../utils/common'
import { Types } from './types'

export const getGifts = () => async (dispatch: any) => {
    try {
        const response = await api.post("/candidates/get_my_gifts/", {
            start: 0
        });
        if (response.data.c === 1) {
            dispatch({
                type: Types.GET_EARNED_GIFTS_SUCCEED,
                payload: response.data.d
            })
        }
    } catch (error) {
        if (error instanceof Error) openError(error.message)
        return []
    }
}
