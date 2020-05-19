import { NativeEventEmitter, NativeModules } from 'react-native';
import axios from 'axios';
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'


const emitter = new NativeEventEmitter(NativeModules.HRV)



const HRVResultCount = 0
const RHRResultCount = 0 

export function getHRVSince(callback) {
    emptyResults(callback)
    emitter.removeAllListeners('OnHRVComplete')
    emitter.addListener(
        'OnHRVComplete',
        res => {
            postReading(JSON.parse(res.beatData), callback)
        }
    )
    NativeModules.HRV.getHRVSince()
}

export function getRHRSince(callback) {
    emptyResults(callback)
    emitter.removeAllListeners('OnRHRComplete')
    emitter.addListener(
        'OnRHRComplete',
        res => {
            postRHRReading(JSON.parse(res.rhrData), callback)
        }
    )
    NativeModules.HRV.getRHRSince()
}


export async function getLatestHRV(callback, token) {
    emptyResults(callback)
    emitter.removeAllListeners('OnHRVComplete')
    emitter.addListener(
        'OnHRVComplete',
        res => {
            postReading(JSON.parse(res.beatData), callback)
        }
    )
    const config = (token) ? {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        } 
    } : null

    axios.get(`${REACT_APP_BACKEND_URI}/api/readings/hrv/mostrecent`, config)
        .then(mostRecent => {
            if (mostRecent.data) {
                NativeModules.HRV.getLatestHRV(mostRecent.data.createdAt)
            }
            else {
                NativeModules.HRV.getLatestHRV('')
            }
        })
        .catch(err => {
            //NativeModules.HRV.getLatestHRV('')
            console.log(err)
        })
    
}

export async function getLatestRHR(callback, token) {
    emptyResults(callback)
    emitter.removeAllListeners('OnRHRComplete')
    emitter.addListener(
        'OnRHRComplete',
        res => {
            postRHRReading(JSON.parse(res.rhrData), callback)

        }
    )
    const config = (token) ? {
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        } 
    } : null

    axios.get(`${REACT_APP_BACKEND_URI}/api/readings/rhr/mostrecent`, config)
        .then(mostRecent => {
            if (mostRecent.data){
                NativeModules.HRV.getLatestRHR(mostRecent.data.createdAt)
            }
            else {
                NativeModules.HRV.getLatestRHR('')
            }
        })
        .catch(err => {
            // NativeModules.HRV.getLatestRHR('')
            console.log(err)
        })
}

const postReading = (reqData, callback) => {
    axios.post(`${REACT_APP_BACKEND_URI}/api/readings/hrv`, reqData)
        .then(res => callback())
        .catch(err => console.log(err))
}

const postRHRReading = (reqData, callback) => {
    axios.post(`${REACT_APP_BACKEND_URI}/api/readings/rhr`, reqData)
        .then(res => callback())
        .catch(err => console.log(err))
}

const emptyResults = (callback) => {
    emitter.removeAllListeners('NoResults')
    emitter.addListener(
        'NoResults',
        res => callback()
    )
}

const rhrResultCount = () => {

    emitter.removeAllListeners('RHRResultCount')
    RHRResultCount = 0
    emitter.addListener(
        'RHRResultCount',
        res => {
            RHRResultCount += JSON.parse(res.resultCount)
            console.log('RHR Result Count',RHRResultCount)
    })
}

const hrvResultCount = () => {
    emitter.removeAllListeners('HRVResultCount')
    HRVResultCount = 0
    emitter.addListener(
        'HRVResultCount',
        res => {
            HRVResultCount += JSON.parse(res.resultCount)
            console.log('HRV Result Count',HRVResultCount)
    })
}
