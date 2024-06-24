import React, { useReducer, createContext } from 'react'
import { arenaApi as api } from '../../../../lib'

const LOADING = 'LOADING'
const LOADED = 'LOADED'
const ERROR = 'ERROR'
const ENDED = 'ENDED'
const RESET = 'RESET'
const ITEM_PER_LOAD = 10

interface IContext {
  isLoading: boolean
  data: Contest[]
  startParam: number
  error: boolean
  isEnded: boolean
  loadDataChunk?: any
  reset?: any
}

export const Context = createContext<IContext>({
  isLoading: false,
  data: [],
  error: false,
  startParam: 0,
  isEnded: false
})

const fetchData = async (type: string, skip: number) => {
  try {
    const response = await api.post('/contests/get_contest_rounds_list/', {
      type_status: type,
      start: skip
    })
    if (response.data.c === 1) {
      return { response: response.data.d, error: undefined }
    } else {
      return { response: undefined, error: true }
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
      return {
        ...state,
        isLoading: false,
        data: newData,
        startParam: startParam,
        isEnded: true
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
        error: true,
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
    error: false,
    startParam: 0,
    isEnded: false
  })
  const { isLoading, data, error, isEnded, startParam } = state
  const loadDataChunk = async (type: string) => {
    if (!isEnded) {
      dispatch({
        type: LOADING
      })
      const { response, error } = await fetchData(type, 0)
      if (response && response.length !== 0) {
        const payload = { dataLength: response.length, dataChunk: response }
        dispatch({ type: LOADED, payload: payload })
      } else if (!response || response.length === 0) {
        dispatch({ type: ENDED })
      } else if (error) {
        dispatch({ type: ERROR })
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
