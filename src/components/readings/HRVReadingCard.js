import React, { useState } from 'react'
import { Text, View } from 'react-native'
import moment from 'moment'
import { ProgressChart } from 'react-native-chart-kit'


function HRVReadingCard(props) {
    const { SDNN, rMSSD, HFPWR, LFPWR, LFtoHF, AVNN, TOTPWR, NNtoRR, createdAt, readinessData } = props.reading
    const HR =  (1000 / AVNN) * 60
    const quality = NNtoRR * 100
    const [width, height] = [100, 100]

    const chartConfig = {
        backgroundColor: '#CFFCFF',
        backgroundGradientFrom: '#29335C',
        // backgroundGradientTo: '#CFFCFF',
        color: (opacity = 1, i) => {
            //change color based on percentile
            if (readinessData.data[i] < .33) return `rgba(${254}, ${74}, ${73}, ${opacity})`
            else if (readinessData.data[i] >= .33 && readinessData.data[i] < .66) return `rgba(${243}, ${222}, ${44}, ${opacity})`
            else return `rgba(${116}, ${195}, ${101}, ${opacity})`
        }
    }
    

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
            <ProgressChart
                data={readinessData}
                width={width}
                height={height}
                chartConfig={chartConfig}
                hideLegend={true}
                strokeWidth={4}
                radius={8}
            />
            <Text></Text>
        
        </>
    )
}

export default HRVReadingCard