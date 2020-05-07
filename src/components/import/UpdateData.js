import { NativeModules, Button } from 'react-native'
import React from 'react'
import {getHRVSince, getRHRSince } from '../utils/GetHRVNative'


NativeModules.HRV.authorizeHealthKit()

export default function UpdateData(){
    

    return (
        <>
    
        <Button 
            title="Get All HRV Readings!"
            onPress={() => getHRVSince(() => console.log("HRV added!"))}
        />
        <Button 
            title="Get All RHR!"
            onPress={() => getRHRSince(() => console.log("RHR added!"))}
        />
         
        </>
    )
}