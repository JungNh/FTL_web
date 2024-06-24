import _ from 'lodash'
import { openError } from '../../utils/common'
import { arenaApi as api } from '../../lib'
import { Types } from './types'

export const getContest = (id: number) => async (dispatch: any) => {
    try {
        dispatch(getContestSuccess(null))
        const response = await api.post("/contests/get_contest_round_info/", {
            round_id: id
        });
        if (response.data.c === 1) {
            dispatch(getContestSuccess(response.data.d[0]))
        }
    } catch (error) {
        if (error instanceof Error) openError(error.message)
        return []
    }
}

export const getContestSuccess = (payload: any) => ({
    type: Types.GET_CONTEST_SUCCEED,
    payload
})
