import { NativeEventEmitter, NativeModules } from 'react-native';
import axios from 'axios';
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'


const emitter = new NativeEventEmitter(NativeModules.HRV)

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


export async function getLatestHRV(callback) {
    emptyResults(callback)
    emitter.removeAllListeners('OnHRVComplete')
    emitter.addListener(
        'OnHRVComplete',
        res => {
            postReading(JSON.parse(res.beatData), callback)
        }
    )
    let mostRecent = await axios.get(`${REACT_APP_BACKEND_URI}/api/readings/hrv/mostrecent`)
    NativeModules.HRV.getLatestHRV(mostRecent.data.createdAt)
}

export async function getLatestRHR(callback) {
    emptyResults(callback)
    emitter.removeAllListeners('OnRHRComplete')
    emitter.addListener(
        'OnRHRComplete',
        res => {
            postRHRReading(JSON.parse(res.rhrData), callback)

        }
    )
    let mostRecent = await axios.get(`${REACT_APP_BACKEND_URI}/api/readings/rhr/mostrecent`)
    NativeModules.HRV.getLatestRHR(mostRecent.data.createdAt)
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
