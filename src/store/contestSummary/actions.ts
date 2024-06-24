import _ from 'lodash'

import { arenaApi as api } from '../../lib'
import { openError } from '../../utils/common'
import { Types } from './types'

export const getContestSummary = (id: number) => async (dispatch: any) => {
    try {
        await dispatch({ type: Types.SET_CONTEST_SUMMARY_STATE, payload: { contest_summary: undefined } })
        const response = await api.post("/contests/get_result_the_exam/", {
            round_id: id,
            start: 0
        });
        if (response.data.c === 1) {
            dispatch({ type: Types.SET_CONTEST_SUMMARY_STATE, payload: { contest_summary: response.data.d?.[0] } })
        } else {
            dispatch({ type: Types.SET_CONTEST_SUMMARY_STATE, payload: { contest_summary: null, error_message: response.data.m } })
        }
    } catch (error) {
        if (error instanceof Error) openError(error.message)
        return []
    }
}