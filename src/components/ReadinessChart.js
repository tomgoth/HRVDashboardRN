import React, { useState, useEffect } from 'react'
import { Text, View, Dimensions } from 'react-native'
import axios from 'axios';
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'
import { ProgressChart } from 'react-native-chart-kit'
import Spinner from './Spinner'




function ReadinessChart() {


    const [readinessData, setReadinessData] = useState()
    const [isLoading, setIsLoading] = useState(true)


    const width = Dimensions.get("window").width;
    // const width = 300
    const height = 300

    const chartConfig = {
        // backgroundColor: '#000000',
        backgroundGradientFrom: '#000000',
        backgroundGradientTo: '#000000',
        color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`

    }
    const graphStyle = {
        marginVertical: 8,
        ...chartConfig.style
    }

    // const data = {
    //     labels: ["Swim", "Bike", "Run"], // optional
    //     data: [0.4, 0.6, 0.8]
    // };


    useEffect(() => {
        axios.get(`${REACT_APP_BACKEND_URI}/readiness`)
            .then((res) => {
                console.log(res.data)
                let labels = res.data.map(metric => `${metric.label}: ${metric.currentValue} @ ${metric.createdAt}`)
                let data = res.data.map(metric => metric.percentile)


                setReadinessData({
                    labels: labels,
                    data: data
                })
                setIsLoading(false)
            })
            .catch((err) => { console.log(err) })

    }, [])

    if (isLoading) {
        return <Spinner />
    }
    return (
        <ProgressChart
            data={readinessData}
            width={width}
            height={height}
            chartConfig={chartConfig}
        />
    )
}

export default ReadinessChart