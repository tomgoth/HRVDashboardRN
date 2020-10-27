import React, { useEffect, useContext } from 'react'
import ReadinessContext from '../../context/readiness/ReadinessContext'
import { Text, View } from 'react-native'

function SmallestWorthwhileChange () {

    const readinessContext = useContext(ReadinessContext)
    const { smallestWorthwhileChange, getSWC } = readinessContext

    useEffect(() => {
        getSWC()
    }, [])

    return (
        <View>
        {Object.entries(smallestWorthwhileChange).map((entry) => {
            return (
            <>
                <Text>{`${entry[0]}:`}</Text> 
                <Text>{`${entry[1]}`}</Text>
            </>
                )
        })}
        </View>
    )
}

export default SmallestWorthwhileChange