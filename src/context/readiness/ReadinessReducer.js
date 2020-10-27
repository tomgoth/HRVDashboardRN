import {
    SET_READINESS,
    SET_LOADING,
    SET_DOMAIN,
    SET_SWC
} from '../types'

export default (state, action) => {
    switch (action.type) {
        case SET_READINESS:
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                readinessData: {
                    data: action.payload.map(metric => metric.percentile),
                    labels: action.payload.map(metric => `${metric.label}: ${metric.currentValue} @ ${metric.createdAt}`)
                }
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case SET_DOMAIN:
            return {
                ...state,
                domain: action.payload
            }
        case SET_SWC:
            return {
                ...state,
                smallestWorthwhileChange: action.payload
            }
        default:
            return state
    }
}