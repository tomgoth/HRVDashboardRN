import React, { useState, useEffect } from 'react'
import { Dimensions, FlatList } from 'react-native'
import axios from 'axios';
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'
import { ProgressChart } from 'react-native-chart-kit'
import Spinner from './Spinner'
import ReadinessCard from './ReadinessCard'




function ReadinessChart() {


    const [readinessData, setReadinessData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState()


    const width = Dimensions.get("window").width;
    // const width = 300
    const height = 300

    const chartConfig = {
        backgroundColor: '#CFFCFF',
        backgroundGradientFrom: '#29335C',
        // backgroundGradientTo: '#CFFCFF',
        color: (opacity = 1, i) => {
            console.log('index of readiness data', readinessData.data[i])
            if (readinessData.data[i] < .33) return `rgba(${254}, ${74}, ${73}, ${opacity})`
            else if (readinessData.data[i] >= .33 && readinessData.data[i] < .66) return `rgba(${243}, ${222}, ${44}, ${opacity})`
            else return `rgba(${116}, ${195}, ${101}, ${opacity})`
            //return `rgba(${200}, ${255}, ${255}, ${opacity})`
        },


    }

    useEffect(() => {
        axios.get(`${REACT_APP_BACKEND_URI}/readiness`)
            .then((res) => {
                console.log(res.data)
                let labels = res.data.map(metric => `${metric.label}: ${metric.currentValue} @ ${metric.createdAt}`)
                let data = res.data.map(metric => metric.percentile)

                setData(res.data)
                setReadinessData({
                    labels: labels,
                    data: data,
                })
                setIsLoading(false)
            })
            .catch((err) => { console.log(err) })

    }, [])

    if (isLoading) {
        return <Spinner />
    }
    return (
        <>
            <ProgressChart
                data={readinessData}
                width={width}
                height={height}
                chartConfig={chartConfig}
                hideLegend={true}
            />
            {data.map(item => <ReadinessCard props={item} key={item.id}/>)}
        </>
    )
}

export default ReadinessChart