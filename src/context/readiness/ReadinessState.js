import React, { useReducer } from 'react';
import axios from 'axios'
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'
import { getHRVSince, getLatestHRV, getRHRSince, getLatestRHR } from '../../components/utils/GetHRVNative'
import ReadinessContext from './ReadinessContext';
import ReadinessReducer from './ReadinessReducer';
import {
    SET_READINESS,
    SET_LOADING,
    SET_DOMAIN
} from '../types'


const ReadinessState = props => {
    const initialState = {
        readinessData: {data: [], labels: []},
        data: [],
        isLoading: true,
        domain: 0
    }

    const [state, dispatch] = useReducer(ReadinessReducer, initialState)

    //ACTIONS
    const setReadinessData = () => {
        setIsLoading(true)
        axios.get(`${REACT_APP_BACKEND_URI}/api/readings/readiness/${state.domain}/hour`)
            .then((res) => {
                dispatch({
                    type: SET_READINESS,
                    payload: res.data
                })
            })
            .catch((err) => { console.log(err) })
    }

    const getLatestReadings = () => {
        setIsLoading(true)
        getLatestHRV(() => {
            getLatestRHR(setReadinessData)
        })
        
    }

    const setDomain = (option) => {
        dispatch({
            type: SET_DOMAIN,
            payload: option
        })
    }

    const setIsLoading = (isLoading) => {
        dispatch({
            type: SET_LOADING,
            payload: isLoading
        })
    }

    return (
        <ReadinessContext.Provider
            //  anything we want to access from other components, including state and actions
            value={{
                readinessData: state.readinessData,
                data: state.data,
                isLoading: state.isLoading,
                domain: state.domain,
                setIsLoading,
                getLatestReadings,
                setReadinessData,
                setDomain
            }} >
            {props.children}
        </ReadinessContext.Provider>
    )


}

export default ReadinessState


