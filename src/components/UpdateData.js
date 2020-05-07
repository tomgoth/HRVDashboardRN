import { NativeModules, Button, Text } from 'react-native'
import React, {useState} from 'react'
// import axios from 'axios';
// import {REACT_APP_BACKEND_URI} from 'react-native-dotenv'
import {getHRVSince, getRHRSince } from './utils/GetHRVNative'


NativeModules.HRV.authorizeHealthKit()


export default function UpdateData(){

    const [rhrReadingCount, setRhrReadingCount] = useState(0)
    

    return (
        <>
    
        <Button 
            title="Get All HRV Readings!"
            onPress={() => getHRVSince()}
        />
        <Button 
            title="Get All RHR!"
            onPress={() => getRHRSince(() => setRhrReadingCount(rhrReadingCount + 1))}
        />
            {(rhrReadingCount > 0) ? <Text>RHR Imported: {rhrReadingCount}</Text> : <></>}
        </>
    )
}