import { NativeEventEmitter, NativeModules } from 'react-native';
import axios from 'axios';
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'


const emitter = new NativeEventEmitter(NativeModules.HRV)

export function getHRVSince() {
    emitter.removeAllListeners('OnHRVComplete')
    emitter.addListener(
        'OnHRVComplete',
        res => {
            console.log(res)
            postReading(JSON.parse(res.beatData))
        }
    )
    NativeModules.HRV.getHRVSince()
}

export function getRHRSince() {
    emitter.removeAllListeners('OnRHRComplete')
    emitter.addListener(
        'OnRHRComplete',
        res => {
            console.log(res)
            postRHRReading(JSON.parse(res.rhrData))
        }
    )
    NativeModules.HRV.getRHRSince()
}


export function getLatestHRV(callback) {
    emitter.removeAllListeners('OnHRVComplete')
    emitter.addListener(
        'OnHRVComplete',
        res => {
            console.log(res)
            postReading(JSON.parse(res.beatData), callback)
        }
    )
    NativeModules.HRV.getLatestHRV()
}

export function getLatestRHR(callback) {
    emitter.removeAllListeners('OnRHRComplete')
    emitter.addListener(
        'OnRHRComplete',
        res => {
            console.log(res)
            postRHRReading(JSON.parse(res.rhrData), callback)

        }
    )
    NativeModules.HRV.getLatestRHR()
}

const postReading = (reqData, callback) => {
    axios.post(`${REACT_APP_BACKEND_URI}/hrv`, reqData)
        .then(res => callback())
        .catch(err => console.log(err))
}

const postRHRReading = (reqData, callback) => {
    axios.post(`${REACT_APP_BACKEND_URI}/rhr`, reqData)
        .then(res => callback())
        .catch(err => console.log(err))
}
