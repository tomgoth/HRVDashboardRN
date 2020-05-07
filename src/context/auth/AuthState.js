import React, { useReducer } from 'react'
import axios from 'axios'
import AuthContext from './authContext'
import authReducer from './authReducer'
// import setAuthToken from '../../utils/setAuthToken'
// import axiosWithAuth from '../../utils/axiosWithAuth'
import deviceStorage from '../../utils/deviceStorage'
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS,
    SET_TOKEN
} from '../types'

const AuthState = props => {

    const initialState = {
        token: null,
        isAuthenticated: false,
        user: null,
        loading: true,
        error: null
    }

    const [state, dispatch] = useReducer(authReducer, initialState)

    // Actions:

    // Load User - async because i'm making a request to BE
    const loadUser = async (token) => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        }

        try {
            const res = await axios.get(`${REACT_APP_BACKEND_URI}/api/auth`, config)
            if (res.data) {
                dispatch({
                    type: USER_LOADED,
                    payload: res.data
                })
            }
            else {
                dispatch({ type: AUTH_ERROR })
            }
            console.log('load user', res.data)

        } catch (err) {
            console.log(err)
            dispatch({ type: AUTH_ERROR })
        }
    }

    // Register User
    const register = async (formData) => {
        console.log("register state", state)

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        try {
            const res = await axios.post(`${REACT_APP_BACKEND_URI}/api/users`, formData, config)
            console.log('register', res)
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data // should be token
            })

            loadUser(res.data.token)

        } catch (err) {
            console.log(err)
            dispatch({
                type: REGISTER_FAIL,
                payload: err.response.data.msg
            })
        }
    }

    // Login User
    const login = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post(`${REACT_APP_BACKEND_URI}/api/auth`, formData, config)

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data // should be token
            })

            loadUser(res.data.token)

        } catch (err) {
            dispatch({
                type: LOGIN_FAIL,
                payload: err.response.data.msg
            })
        }
    }


    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = () => {
        deviceStorage.loadJWT()
            .then(value => {
                dispatch({
                    type: SET_TOKEN,
                    payload: value.token
                })
                loadUser(value.token)
            })
            .catch(err => console.log(err))
    };



    // Logout User
    const logout = () => {
        dispatch({ type: LOGOUT })
    }

    // Clear Errors
    const clearErrors = () => {
        dispatch({ type: CLEAR_ERRORS })
    }



    return (
        <AuthContext.Provider
            //  anything we want to access from other components, including state and actions
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                loading: state.loading,
                error: state.error,
                register,
                loadUser,
                login,
                logout,
                clearErrors,
                bootstrapAsync
            }} >
            {props.children}
        </AuthContext.Provider>
    )

}

export default AuthState
