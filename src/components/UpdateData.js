import { NativeModules, Button, Text } from 'react-native'
import React, {useState} from 'react'
import axios from 'axios';
import {REACT_APP_BACKEND_URI} from 'react-native-dotenv'
import {getHRVSince, getLatestHRV, getRHRSince} from './utils/GetHRVNative'


NativeModules.HRV.authorizeHealthKit()


export default function UpdateData(){

    const[latestReading, setLatestReading] = useState("");
    
    const postReading = (reqData) => {
        axios.post(`${REACT_APP_BACKEND_URI}/hrv`, reqData)
            .then(res => setLatestReading(res.data.rMSSD))
            .catch(err => console.log(err))
    }

    const postRHRReading = (reqData) => {
        axios.post(`${REACT_APP_BACKEND_URI}/rhr`, reqData)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
        <>
        <Button 
            title="Get Latest Reading"
            onPress={() => getLatestHRV(reqData => postReading(reqData))}
        />
        <Text>{latestReading}</Text>
        <Button 
            title="Get All HRV Readings!"
            onPress={() => getHRVSince(reqData => postReading(reqData))}
        />
        <Button 
            title="Get All RHR!"
            onPress={() => getRHRSince(reqData => postRHRReading(reqData))}
        />
        
        </>
    )
}