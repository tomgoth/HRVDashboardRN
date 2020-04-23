import { NativeEventEmitter, NativeModules } from 'react-native';

const emitter = new NativeEventEmitter( NativeModules.HRV )



export function getHRVSince( callback ){
    emitter.removeAllListeners('OnHRVComplete')
    emitter.addListener(
        'OnHRVComplete',
        res => {
            console.log(res)
            callback( JSON.parse(res.beatData))
        }
    )
    NativeModules.HRV.getHRVSince()
}

    
export function getLatestHRV( callback ){
        emitter.removeAllListeners('OnHRVComplete')
        emitter.addListener(
            'OnHRVComplete',
            res => {
                console.log(res)
                callback( JSON.parse(res.beatData))
            }
        )
        NativeModules.HRV.getLatestHRV()
}
