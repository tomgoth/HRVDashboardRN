import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import moment from 'moment'
import { ProgressChart } from 'react-native-chart-kit'


function HRVReadingCard(props) {
    const { SDNN, rMSSD, HFPWR, LFPWR, LFtoHF, AVNN, TOTPWR, NNtoRR, createdAt, readinessData } = props.reading
    const HR =  (1000 / AVNN) * 60
    const quality = NNtoRR * 100
    const [width, height] = [100, 125]

    const chartConfig = {
        backgroundColor: '#151E29',
        backgroundGradientFrom: '#151E29',
        backgroundGradientTo: '#151E29',
        color: (opacity = 1, i) => {
            //change color based on percentile
            if (readinessData.data[i] < .33) return `rgba(${254}, ${74}, ${73}, ${opacity})`
            else if (readinessData.data[i] >= .33 && readinessData.data[i] < .66) return `rgba(${243}, ${222}, ${44}, ${opacity})`
            else return `rgba(${116}, ${195}, ${101}, ${opacity})`
        }
    }
    

    return (
  
        <View style={styles.readingsCardContainer}>

             <Text style={styles.readingsTitle}>{moment(createdAt).format("MMM Do h:mma")}</Text>

            <View style={styles.readingsCard}>

                <View style={styles.readingDetails}>
                {/* <Text style={styles.readingsText}>{moment(createdAt).format("MMM Do h:mma")}</Text> */}
                <Text style={styles.readingsText}>SDNN: {SDNN.toFixed(0)} ms </Text>
                <Text style={styles.readingsText}>rMSSD: {rMSSD.toFixed(0)} ms</Text>
                <Text style={styles.readingsText}>Total Power: {TOTPWR.toFixed(0)}</Text>
                <Text style={styles.readingsText}>High Frequency (HF) Power: {HFPWR.toFixed(0)}</Text>
                <Text style={styles.readingsText}>Low Frequency (LF) Power: {LFPWR.toFixed(0)}</Text>
                <Text style={styles.readingsText}>LF/HF Ratio: {LFtoHF.toFixed(2)}</Text>
                <Text style={styles.readingsText}>Reading Heart Rate: {HR.toFixed(0)} bpm</Text>
                <Text style={styles.readingsText}>Reading Quality: {quality.toFixed(0)}</Text>
                </View>
                
                <View style={styles.readingChart}>
                <ProgressChart
                    data={readinessData}
                    width={width}
                    height={height}
                    chartConfig={chartConfig}
                    hideLegend={true}
                    strokeWidth={5}
                    radius={16}
                />
                </View>

            </View>
        </View>
      
    )
}

const styles = StyleSheet.create({
    readingsCardContainer: {
        display: 'flex',
        flexDirection: 'column',
        borderColor: '#20A4F3',
        borderWidth: 1,
        width: '100%',
        borderRadius: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    readingsTitle: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    readingsCard: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        // borderColor: '#20A4F3',
        // borderWidth: 1,
        // width: '100%',
        // borderRadius: 10,
        // padding: 20
    },
    readingDetails: {
        // width: '45%',
    },
    readingChart: {
        marginLeft: 25 
    },
    readingsText: {
        color: '#fff'
    }
})

export default HRVReadingCard