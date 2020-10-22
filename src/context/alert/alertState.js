import React, { useReducer, useContext } from 'react';
import alertReducer from './alertReducer'
import AlertContext from './alertContext'
import { SET_ALERT, REMOVE_ALERT } from '../types';


const AlertState = props => {
    const initialState = {
        alert: "",
        hasAlert: false
    }

    const [state, dispatch] = useReducer(alertReducer, initialState)

    const setAlert = (alertMsg) => {
        dispatch({
            type: SET_ALERT,
            payload: alertMsg
        })
    }

    const removeAlert = () => {
        dispatch({
            type: REMOVE_ALERT,
            payload: ""
        })
    }

    return (
        <AlertContext.Provider
            //  anything we want to access from other components, including state and actions
            value={{
                alert: state.alert,
                hasAlert: state.hasAlert,
                setAlert,
                removeAlert
            }} >
            {props.children}
        </AlertContext.Provider>
    )
}

export default AlertState

