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
    const height = 300

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
                        // <Button
                        //     title={option.displayName}
                        //     onPress={() => handleDomainOption(option.value)}
                        //     key={option.value}
                        //     color='#fff'
                        //     style={styles.chartButtons}
                        // />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => handleDomainOption(option.value)}
                            key={option.value}
                            style={styles.chartButtons}
                        >
                        <Text style={styles.chartButtonText}>{option.displayName}</Text>
                        </TouchableOpacity>
                        )}
            </View>
            <ProgressChart
                data={readinessData}
                width={width}
                height={height}
                chartConfig={chartConfig}
                hideLegend={true}
            />
            {data.map(item => <ReadinessCard style={styles.subChartsContainer} item={item} key={item.id} domain={domain}/>)}
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
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginTop: 15,
        marginBottom: 15,
        
    },
    chartButtonText: {
        color: '#fff'
    },
    subChartsContainer: {
        // borderColor: '#20A4F3',
        // borderWidth: 1,
        // display: 'flex',
        // flexDirection: 'row'
        // flexWrap: 'wrap'
    }
})

export default ReadinessChart;

