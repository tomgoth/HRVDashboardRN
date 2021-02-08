import { NativeEventEmitter, NativeModules } from 'react-native';
import axios from 'axios';
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'


const emitter = new NativeEventEmitter(NativeModules.HRV)

let HRVResultCount = 0
let HRVPostedCount = 0

let RHRResultCount = 0
let RHRPostedCount = 0

let ECGResultCount = 0
let ECGPostedCount = 0


export async function getLatestHRV(token) {
    return new Promise((resolve, reject) => {
        hrvResultCount(resolve) //listener for result count
        emitter.removeAllListeners('OnHRVComplete')
        emitter.addListener(
            'OnHRVComplete',
            async (res) => {
                const beatData = JSON.parse(res.beatData)
                await postReading({ ...beatData, isECG: false }, resolve, reject)
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
        rhrResultCount(resolve) // listener for result count
        emitter.removeAllListeners('OnRHRComplete')
        emitter.addListener(
            'OnRHRComplete',
            async (res) => {
                await postRHRReading(JSON.parse(res.rhrData), resolve, reject)
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

export async function getLatestECG(token) {
    return new Promise(async (resolve, reject) => {
        ecgListeners(resolve, reject)
        const config = (token) ? {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        } : null
        const mostRecent = await axios.get(`${REACT_APP_BACKEND_URI}/api/readings/ecg/mostrecent`, config)
        console.log("most recent ECG", mostRecent.data)
        if (mostRecent.data) {
            NativeModules.HRV.getLatestECG(mostRecent.data.createdAt)
        }
        else {
            NativeModules.HRV.getLatestECG('')
        }
    })
}

const postReading = async (reqData, resolve, reject) => {
    try {
        const res = await axios.post(`${REACT_APP_BACKEND_URI}/api/readings/hrv`, reqData)
        HRVPostedCount++
        console.log('HRV Posted Count', HRVPostedCount)
        if (HRVPostedCount >= HRVResultCount) resolve(HRVPostedCount)
    }
    catch {
        console.log(err)
        reject(err)
    }
}

const postRHRReading = async (reqData, resolve, reject) => {
    try {
        const res = await axios.post(`${REACT_APP_BACKEND_URI}/api/readings/rhr`, reqData)
        RHRPostedCount++
        console.log('RHR Posted Count', RHRPostedCount)
        if (RHRPostedCount >= RHRResultCount) resolve(RHRPostedCount)
    }
    catch {
        console.log(err)
        reject(err)
    }
}

const postECGReading = async (reqData, resolve, reject) => {
    //post ECG to back end
    const { ecg, date, averageHR } = reqData
    const rs = await computeRRIntervals(ecg, averageHR)
    await postReading({ beatToBeat: rs, date: date, isECG: true }, (count) => { }, reject)
    ECGPostedCount++
    console.log("ecg posted", ECGPostedCount, 'ecg result', ECGResultCount)
    if (ECGPostedCount >= ECGResultCount) resolve(ECGPostedCount)
}

const rhrResultCount = (resolve) => {
    // set the total result count, if 0 resolve the promise
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
    // set the total result count, if 0 resolve the promise
    emitter.removeAllListeners('HRVResultCount')
    emitter.addListener(
        'HRVResultCount',
        res => {
            HRVResultCount = JSON.parse(res.resultCount)
            if (HRVResultCount === 0) resolve(0)
            console.log('HRV Result Count', HRVResultCount)
        })
}

const ecgListeners = (resolve, reject) => {
    emitter.removeAllListeners('OnECGComplete')
    emitter.addListener(
        'OnECGComplete',
        async (res) => {
            await postECGReading(JSON.parse(res.ecgData), resolve, reject)
        })
    emitter.removeAllListeners('ECGResultCount')
    emitter.addListener(
        'ECGResultCount',
        res => {
            ECGResultCount = JSON.parse(res.resultCount)
            if (ECGResultCount === 0) resolve(0)
            console.log('ECG Result Count', ECGResultCount)
        })


}

const computeRRIntervals = (ecg, averageHR) => {
    return new Promise((resolve, reject) => {
        const n = ecg.length

        //double differnce and square
        let d1 = ecg.map((e, i) => {
            const ei = e.voltageQuantity
            const ei1 = (i < n - 1) ? ecg[i + 1].voltageQuantity : 0
            return ei1 - ei
        })
        d1 = d1.slice(0, n - 1)

        let d2 = d1.map((d1j, j) => {
            const d1j1 = (j < n - 2) ? d1[j + 1] : 0
            return d1j1 - d1j
        })
        d2 = d2.slice(0, n - 2)
        d = d2.map((dj, j) => { return { ...ecg[j], d: Math.pow(dj, 2) } })
        d = d.sort((a, b) => b.d - a.d)// sort in descending order
        const threshold = d[0].d * 0.03
        d = d.filter(e => e.d > threshold)

        console.log("d length", d.length)

        let qrs = []

        // establish the qrs windows into their own array
        d.forEach(e => {
            const withinWindow = qrs.filter(r => {
                return Math.abs(e.timeSinceSeriesStart - r.timeSinceSeriesStart) * 1000 < 75
            }) //iz within 75ms
            if (withinWindow.length === 0) {
                qrs.push(e)
            }
        });

        //find max and min voltage for each window and average them to get a baseline
        qrs = qrs.map(window => {
            return ecg.reduce((acc, cv) => {
                return {
                    max: (cv.voltageQuantity > acc.max && Math.abs(cv.timeSinceSeriesStart - window.timeSinceSeriesStart) * 1000 < 75) ? cv.voltageQuantity : acc.max,
                    min: (cv.voltageQuantity < acc.min && Math.abs(cv.timeSinceSeriesStart - window.timeSinceSeriesStart) * 1000 < 75) ? cv.voltageQuantity : acc.min
                }
            }, { max: 0, min: 0 })
        }).map((cv, i) => { return { ...qrs[i], baseline: (cv.max + cv.min) / 2 } })//mean of max and min
        //use relative magnitude to find the R Peak voltage
        let rs = qrs.map(window => {
            return ecg.reduce((acc, cv) => {
                const relAmp = cv.voltageQuantity - window.baseline
                return (relAmp > acc.relAmp && Math.abs(cv.timeSinceSeriesStart - window.timeSinceSeriesStart) * 1000 < 75) ? { ...cv, relAmp: relAmp } : acc
            }, { relAmp: 0 })
        })

        //sort and map the 
        rs = rs.sort((a, b) => a.timeSinceSeriesStart - b.timeSinceSeriesStart).map((cv, i) => {
            return { timeSinceSeriesStart: cv.timeSinceSeriesStart, precededByGap: false }
        })

        const averageNN = (60 / averageHR) * 1000 //average NN from the ECG reading in healthkit
        rs = rs.filter((cv, i) => {
            if (i < 1) {
                return true
            }
            else {
                const rr = (cv.timeSinceSeriesStart - rs[i - 1].timeSinceSeriesStart) * 1000
                if (rr < 200) {
                    return false //remove if less than 200ms
                }
                else if (rr / averageNN < .7) {
                    return false //remove if less than 70% of averageNN
                }
                else {
                    return true
                }
            }
        })

        //add average Rs where the duration between beats is more than 180%
        const newRRs = []
        rs.forEach((cv, i) => {
            const a = (i < 1) ? 0 : rs[i - 1].timeSinceSeriesStart
            const b = cv.timeSinceSeriesStart
            const rr = (b - a) * 1000
            if (rr >= 1.8 * averageNN) {
                newRRs.push({ ...cv, timeSinceSeriesStart: (a + averageNN / 1000) })
            }
        })
        console.log("new RRs", newRRs)

        //combine and sort the new rrs
        rs = [...rs, ...newRRs].sort((a, b) => a.timeSinceSeriesStart - b.timeSinceSeriesStart)


        // rrs for debugging    
        let rrs = rs.map((cv, i) => {
            return (i < rs.length - 2) ? (rs[i + 1].timeSinceSeriesStart - cv.timeSinceSeriesStart) * 1000 : 0
        }).slice(0, rs.length - 2)

        console.log("rrs", rrs)

        const avgHR = 60 / ((rrs.reduce((acc, cv) => cv + acc) / 1000) / rrs.length)
        console.log("average HR from RRs", avgHR, "average HR from healthkit", averageHR)

        //console.log('rs indentifid', rs)
        resolve(rs)
    })
}

