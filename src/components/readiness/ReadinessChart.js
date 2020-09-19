import React, { useEffect, useContext } from 'react'
import { Dimensions, Button, View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { ProgressChart } from 'react-native-chart-kit'
import ReadinessCard from './ReadinessCard'
import ReadinessContext from '../../context/readiness/ReadinessContext'

function ReadinessChart() {
    const readinessContext = useContext(ReadinessContext)
    const { readinessData, data, domain, getLatestReadings, setReadinessData, setDomain } = readinessContext
    
    const domainOptions = [
        { displayName: "Latest", value: 0 },
        { displayName: "6 hour", value: 6 },
        { displayName: "12 hour", value: 12 },
        { displayName: "1 day", value: 24 },
        { displayName: "2 day", value: 48 }
    ]
    
    const handleDomainOption = (option) => {
        setDomain(option)
    }

    const width = Dimensions.get("window").width;
    const height = 250

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

    useEffect(() => {
        getLatestReadings()
    }, [])

    useEffect(() =>{
        setReadinessData()
    }, [domain])

   
    return (
        <>
            <View style={styles.chartButtonContainer}>
            {domainOptions.map(option =>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => handleDomainOption(option.value)}
                            key={option.value}
                            style={(option.value === domain) ? styles.chartButtonActive : styles.chartButtons}
                        >
                        <Text style={(option.value === domain) ? styles.chartButtonTextActive :styles.chartButtonText}>{option.displayName}</Text>
                        </TouchableOpacity>
                        )}
            </View>
            <ProgressChart
                data={readinessData}
                width={width}
                height={height}
                chartConfig={chartConfig}
                hideLegend={true}
                style={styles.mainChart}
                strokeWidth={10}
            />

            <View style={styles.ringStatsContainer}>
                <Text style={styles.breakdownText}>Your Ring Breakdown</Text>
                <Text style={styles.breakdownButton}>?</Text>
            </View>

            <View style={styles.subChartContainer}>
            {data.map(item => <ReadinessCard style={styles.subChartsContainer} item={item} key={item.id} domain={domain}/>)}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    chartButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    chartButtons: {
        borderColor: '#20A4F3',
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 10,
        marginTop: 15,
        marginBottom: 10,
    },
    chartButtonActive: {
        borderColor: '#20A4F3',
        borderWidth: 1.5,
        backgroundColor: '#20A4F3',
        padding: 10,
        borderRadius: 10,
        marginTop: 6,
    },
    chartButtonTextActive: {
        color: '#151E29'
    },
    chartButtonText: {
        color: '#fff'
        // color: '#151E29'
    },
    mainChart: {
        paddingLeft: 38
    },
    ringStatsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 35,
        paddingRight: 35,
        marginBottom: 15,
        marginTop: 15
    },
    breakdownText: {
        color: '#fff'
    },
    breakdownButton: {
        color: '#fff',
        borderColor:'#fff',
        borderWidth: 1,
        borderRadius: 12,
        // padding: 6,
        paddingTop: 3,
        textAlign: 'center',
        width: 24,
        height: 24
    },
    subChartContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginTop: 10
    }
})

export default ReadinessChart;

