import React, { useReducer, createContext } from 'react'
import isArray from 'lodash/isArray'
import { arenaApi as api } from '../../../../lib'

const LOADING = 'LOADING'
const LOADED = 'LOADED'
const ERROR = 'ERROR'
const ENDED = 'ENDED'
const RESET = 'RESET'
const ITEM_PER_LOAD = 10

interface IContext {
  isLoading: boolean
  data: any
  userRank: any
  startParam: number
  error: any
  isEnded: boolean
  loadDataChunk?: any
  reset?: any
}

export const Context = createContext<IContext>({
  isLoading: false,
  data: [],
  userRank: [],
  error: false,
  startParam: 0,
  isEnded: false
})

const fetchData = async (id: number, skip: number) => {
  try {
    const response = await api.post('/contests/get_results_rank_table_the_round/', {
      round_id: id,
      start: skip
    })
    if (response.data.c === 1) {
      return {
        response: response.data.d,
        error: undefined,
        userRank: response.data.u
      }
    } else if (response.data.c === -10) {
      return { response: undefined, error: '-10' }
    } else {
      return { response: undefined, error: response.data.m }
    }
  } catch (error) {
    return { response: undefined, error }
  }
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        isLoading: true
      }
    case LOADED: {
      // const startParam = state.startParam + ITEM_PER_LOAD + (state.startParam === 0 ? 1 : 0);
      const startParam = state.startParam + ITEM_PER_LOAD
      const newData = [...state.data, ...action.payload.dataChunk]
      const userRank = [...action.payload.userRank]
      return {
        ...state,
        isLoading: false,
        data: newData,
        userRank: userRank,
        startParam: startParam,
        isEnded: newData.length < ITEM_PER_LOAD
      }
    }
    case ENDED:
      return {
        ...state,
        error: false,
        isLoading: false,
        isEnded: true
      }
    case RESET:
      return {
        isLoading: false,
        data: [],
        error: false,
        startParam: 0,
        isEnded: false
      }
    case ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    default:
      throw new Error("Don't understand action.")
  }
}

export const Provider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: [],
    userRank: [],
    error: false,
    startParam: 0,
    isEnded: false
  })
  const { isLoading, data, error, isEnded, startParam, userRank } = state
  const loadDataChunk = async (id: number) => {
    if (!isEnded) {
      dispatch({
        type: LOADING
      })
      const { response, error, userRank } = await fetchData(id, startParam)
      if (response && response.length !== 0) {
        const payload = { dataLength: response.length, dataChunk: response, userRank: userRank }
        dispatch({ type: LOADED, payload: payload })
      } else if (isArray(response) && response.length === 0) {
        dispatch({ type: ENDED })
      } else if (!!error) {
        dispatch({ type: ERROR, payload: error })
      }
    }
  }
  const reset = () => {
    dispatch({ type: RESET })
  }
  return (
    <Context.Provider
      value={{
        isLoading,
        data,
        userRank,
        startParam,
        error,
        isEnded,
        loadDataChunk,
        reset
      }}
    >
      {props.children}
    </Context.Provider>
  )
}
export const loadDataChunk = ''
