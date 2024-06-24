import _ from 'lodash'

import { arenaApi as api } from '../../lib'
import { openError } from '../../utils/common'
import { getCandidateInfo } from '../arena/actions'
import { Types } from './types'

export const getLeaderBoard = (id: number) => async (dispatch: any) => {
    try {
        const response = await api.post("/contests/get_results_rank_table_the_round/", {
            round_id: id,
            start: 0
        });
        if (response.data.c === 1) {
            dispatch({
                type: Types.GET_LEADER_BOARD_SUCCEED,
                payload: response.data.d
            })
        } else {
            dispatch({
                type: Types.GET_LEADER_BOARD_SUCCEED,
                payload: null
            })
        }
    } catch (error) {
        if (error instanceof Error) openError(error.message)
        return []
    }
}