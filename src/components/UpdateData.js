import { NativeModules, Button, Text } from 'react-native'
import React, {useState} from 'react'
import axios from 'axios';
import {REACT_APP_BACKEND_URI} from 'react-native-dotenv'
import {getHRVSince, getLatestHRV, emitter} from './utils/GetHRVNative'


NativeModules.HRV.authorizeHealthKit()



export default function UpdateData(){

    let reqArr = []

    const[latestReading, setLatestReading] = useState("");
    const[sizeBatch, setSizeBatch] = useState(0);


    const postReading = (reqData) => {
        axios.post(`${REACT_APP_BACKEND_URI}/gethrv`, reqData)
            .then((res => setLatestReading(res.data.rMSSD)))
            .catch(err => console.log(err))
    }
    
    const appendToBatch = (reqData) => {
        reqArr.push(reqData)
        setSizeBatch(reqArr.length)
    
    }
    

    return (
        <>
        <Button 
            title="Get Latest Reading"
            onPress={() => getLatestHRV(reqData => postReading(reqData))}
        />
        <Text>{latestReading}</Text>
        <Button 
            title="Get All Data!"
            onPress={() => getHRVSince(reqData => postReading(reqData))}
        />
        <Text>{sizeBatch}</Text>
        </>
    )
}