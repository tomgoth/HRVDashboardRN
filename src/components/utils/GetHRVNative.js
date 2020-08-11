import { NativeEventEmitter, NativeModules } from 'react-native';
import axios from 'axios';
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'


const emitter = new NativeEventEmitter(NativeModules.HRV)

let HRVResultCount = 0
let HRVPostedCount = 0

let RHRResultCount = 0
let RHRPostedCount = 0

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


export async function getLatestHRV(token) {
    return new Promise((resolve, reject) => {
        // emptyResults(callback)
        hrvResultCount(resolve)
        emitter.removeAllListeners('OnHRVComplete')
        emitter.addListener(
            'OnHRVComplete',
            res => {
                postReading(JSON.parse(res.beatData), resolve, reject)
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
                console.log(err)
                reject(err)
            })
    })

}

export async function getLatestRHR(token) {
    return new Promise((resolve, reject) => {
        rhrResultCount(resolve)
        emitter.removeAllListeners('OnRHRComplete')
        emitter.addListener(
            'OnRHRComplete',
            res => {
                postRHRReading(JSON.parse(res.rhrData), resolve, reject)

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
                if (mostRecent.data) {
                    NativeModules.HRV.getLatestRHR(mostRecent.data.createdAt)
                }
                else {
                    NativeModules.HRV.getLatestRHR('')
                }
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

const postReading = (reqData, resolve, reject) => {
    axios.post(`${REACT_APP_BACKEND_URI}/api/readings/hrv`, reqData)
        .then(res => {
            HRVPostedCount++
            console.log('HRV Posted Count', HRVPostedCount)
            if (HRVPostedCount === HRVResultCount) resolve(HRVPostedCount)
        })
        .catch(err => {
            console.log(err)
            reject(err)
        })
}

const postRHRReading = (reqData, resolve, reject) => {
    axios.post(`${REACT_APP_BACKEND_URI}/api/readings/rhr`, reqData)
        .then(res => {
            RHRPostedCount++
            console.log('RHR Posted Count', RHRPostedCount)
            if (RHRPostedCount === RHRResultCount) resolve(RHRPostedCount)
        })

        .catch(err => {
            console.log(err)
            reject(err)
        })
}

const rhrResultCount = (resolve) => {

    emitter.removeAllListeners('RHRResultCount')
    emitter.addListener(
        'RHRResultCount',
        res => {
            RHRResultCount = JSON.parse(res.resultCount)
            if (RHRResultCount === 0) resolve(0)
            console.log('RHR Result Count', RHRResultCount)
        })
}

const hrvResultCount = (resolve) => {
    emitter.removeAllListeners('HRVResultCount')
    emitter.addListener(
        'HRVResultCount',
        res => {
            HRVResultCount = JSON.parse(res.resultCount)
            if (HRVResultCount === 0) resolve(0)
            console.log('HRV Result Count', HRVResultCount)
        })
}
