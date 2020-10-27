import React, { useEffect, useContext } from 'react'
import ReadinessContext from '../../context/readiness/ReadinessContext'
import { Text } from 'react-native'

function SmallestWorthwhileChange () {

    const readinessContext = useContext(ReadinessContext)
    const { smallestWorthwhileChange, getSWC } = readinessContext

    useEffect(() => {
        getSWC()
    }, [])

    return (
        <Text>
            {JSON.stringify(smallestWorthwhileChange)}
        </Text>
    )
}

export default SmallestWorthwhileChange