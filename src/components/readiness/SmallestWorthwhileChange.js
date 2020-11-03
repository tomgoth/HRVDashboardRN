import React, { useEffect, useContext } from 'react'
import ReadinessContext from '../../context/readiness/ReadinessContext'
import { Text, View , StyleSheet, Dimensions} from 'react-native'

function SmallestWorthwhileChange () {
    const {height} = Dimensions.get('window');
    const readinessContext = useContext(ReadinessContext)
    const { smallestWorthwhileChange, getSWC } = readinessContext

    useEffect(() => {
        getSWC()
    }, [])

    return (
        <View style={styles.swc} style={{height: height, backgroundColor: '#151E29'}}>
            <Text style={styles.text}>{'Comparison of past 7 day rolling average to baseline:'}</Text>
            <Text></Text>
        {Object.entries(smallestWorthwhileChange).map((entry) => {
            const key = entry[0] === "rMSSDSWC" ? "rMSSD" : entry[0] === "HFPWRSWC" ? "High Frequency Power" : "Resting Heart Rate"
            const valueText = entry[1] ? 'OK' : 'Warning'
            return (
                <Text key={`${entry[0]}`} style={styles.text}>{`${key}: ${valueText}`}</Text> 
            )
        })}
        </View>
    )
}

const styles = StyleSheet.create({
    swc: {
        backgroundColor: '#151E29'
       
    },
    text: {
        color: '#fff'
    }
})

export default SmallestWorthwhileChange