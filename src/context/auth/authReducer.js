import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'
import deviceStorage from '../../utils/deviceStorage'

export default (state, action) => {
    switch(action.type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            deviceStorage.saveJWT({
                ...state,
                ...action.payload})
            return {
                ...state,
                ...action.payload, //token
                isAuthenticated: true,
                loading: false
            }
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGOUT:
            deviceStorage.deleteJWT()
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        case USER_LOADED:
            return { 
                ...state, 
                isAuthenticated: true,
                loading: false,
                user: action.payload
            }
        default:
            return state
    }
}