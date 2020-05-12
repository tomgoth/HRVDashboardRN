import React from 'react'
import { Text } from 'react-native'
import moment from 'moment'


function HRVReadingCard(props) {
    const { SDNN, rMSSD, HFPWR, LFPWR, LFtoHF, AVNN, TOTPWR, NNtoRR, createdAt } = props.reading
    const HR =  (1000 / AVNN) * 60
    const quality = NNtoRR * 100

    return (
        <>
            <Text>{moment(createdAt).format("MMM Do h:mma")}</Text>
            <Text>SDNN: {SDNN.toFixed(0)} ms</Text>
            <Text>rMSSD: {rMSSD.toFixed(0)} ms</Text>
            <Text>Total Power: {TOTPWR.toFixed(0)}</Text>
            <Text>High Frequency (HF) Power: {HFPWR.toFixed(0)}</Text>
            <Text>Low Frequency (LF) Power: {LFPWR.toFixed(0)}</Text>
            <Text>LF/HF Ratio: {LFtoHF.toFixed(2)}</Text>
            <Text>Reading Heart Rate: {HR.toFixed(0)} bpm</Text>
            <Text>Reading Quality: {quality.toFixed(0)}</Text>
            <Text></Text>
        </>
    )
}

export default HRVReadingCard