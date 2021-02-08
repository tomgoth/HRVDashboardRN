import React, { useReducer, useContext } from 'react';
import axios from 'axios'
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'
import { getLatestECG, getLatestHRV, getLatestRHR } from '../../components/utils/GetHRVNative'
import ReadinessContext from './ReadinessContext';
import ReadinessReducer from './ReadinessReducer';
import AuthContext from '../auth/authContext'
import {
    SET_READINESS,
    SET_LOADING,
    SET_DOMAIN,
    SET_SWC
} from '../types'
import AlertContext from '../alert/alertContext';


const ReadinessState = props => {
    const initialState = {
        readinessData: { data: [], labels: [] },
        data: [],
        isLoading: true,
        domain: 0,
        smallestWorthwhileChange: {}
    }

    const [state, dispatch] = useReducer(ReadinessReducer, initialState)
    const { token } = useContext(AuthContext)
    const { setAlert, removeAlert } = useContext(AlertContext)

    const setReadinessData = () => {
        getSWC()
        const config = (token) ? {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        } : null

        if (token) {
            axios.get(`${REACT_APP_BACKEND_URI}/api/readings/readiness/${state.domain}/hour`, config)
                .then((res) => {
                    dispatch({
                        type: SET_READINESS,
                        payload: res.data
                    })
                })
                .catch((err) => {
                    console.log(err)
                    dispatch({
                        type: SET_LOADING,
                        payload: false
                    })
                })
        }
        else {
            setIsLoading(false)
            console.log("no token !")
        }
    }

    const getSWC = () => {
        const config = (token) ? {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        } : null
        axios.get(`${REACT_APP_BACKEND_URI}/api/readings/swc`)
            .then((res) => {
                dispatch({
                    type: SET_SWC,
                    payload: res.data
                })
                const allWithinSWC = Object.values(res.data).reduce((andMapWithinSWC, isWithinSWC) => andMapWithinSWC && isWithinSWC)
                console.log("swc", res.data)
                if (!allWithinSWC) {
                    setAlert("The average of one or more parameters of readiness from the last 7 days are outside of baseline. Consider easy training or rest to get back to baseline.")
                }
                else {
                    removeAlert()
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getLatestReadings = () => {
        console.log("Get latest readings")
        setIsLoading(true)
        
        Promise.all([
            getLatestHRV(token),
            getLatestRHR(token),
            getLatestECG(token)
        ])
            .then(values => {
                const [hrvCount, rhrCount, ecgCount] = values;
                // const [hrvCount, rhrCount ] = values;
                console.log("awaited hrv count", hrvCount)
                console.log("awaited rhr count", rhrCount)
                console.log("awaited ecg count", ecgCount)

                setReadinessData()
            })
            .catch(err => {
                setIsLoading(false)
                console.log("get latest readings error", err)
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
                smallestWorthwhileChange: state.smallestWorthwhileChange,
                setIsLoading,
                getLatestReadings,
                setReadinessData,
                setDomain,
                getSWC
            }} >
            {props.children}
        </ReadinessContext.Provider>
    )


}

export default ReadinessState


