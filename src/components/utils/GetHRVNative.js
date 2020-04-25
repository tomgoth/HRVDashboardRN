import { NativeEventEmitter, NativeModules } from 'react-native';

const emitter = new NativeEventEmitter(NativeModules.HRV)



export function getHRVSince(callback) {
    emitter.removeAllListeners('OnHRVComplete')
    emitter.addListener(
        'OnHRVComplete',
        res => {
            console.log(res)
            callback(JSON.parse(res.beatData))
        }
    )
    NativeModules.HRV.getHRVSince()
}

export function getRHRSince(callback) {
    emitter.removeAllListeners('OnRHRComplete')
    emitter.addListener(
        'OnRHRComplete',
        res => {
            console.log(res)
            callback(JSON.parse(res.rhrData))
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
            callback(JSON.parse(res.beatData))
        }
    )
    NativeModules.HRV.getLatestHRV()
}
