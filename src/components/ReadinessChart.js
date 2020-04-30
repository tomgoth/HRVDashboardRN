import React, { useState, useEffect } from 'react'
import { Dimensions, Button } from 'react-native'
import axios from 'axios';
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'
import { ProgressChart } from 'react-native-chart-kit'
import Spinner from './Spinner'
import ReadinessCard from './ReadinessCard'
import {getHRVSince, getLatestHRV, getRHRSince, getLatestRHR } from './utils/GetHRVNative'





function ReadinessChart() {


    const [readinessData, setReadinessData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState()
    const [domain, setDomain] = useState(0)

    const domainOptions = [{ displayName: "Latest", value: 0 }, { displayName: "6 hour", value: 6 }, { displayName: "12 hour", value: 12 }, { displayName: "1 day", value: 24 }, { displayName: "2 day", value: 48 }]
    const handleDomainOption = (option) => {
        setDomain(option)
    }

    const width = Dimensions.get("window").width;
    // const width = 300
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

    const fetchChartData = () => {
        axios.get(`${REACT_APP_BACKEND_URI}/readiness/${domain}/hour`)
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
    }

    useEffect(() => {
        // get the latest info , pass chart reload callback
        getLatestHRV(fetchChartData)
        getLatestRHR(fetchChartData)

    }, [])

    useEffect(() =>{
        fetchChartData()
    }, [domain])

    if (isLoading) {
        return <Spinner />
    }
    return (
        <>
            {domainOptions.map(option =>
                <Button
                    title={option.displayName}
                    onPress={() => handleDomainOption(option.value)}
                    key={option.value}
                />)}
            <ProgressChart
                data={readinessData}
                width={width}
                height={height}
                chartConfig={chartConfig}
                hideLegend={true}
            />
            {data.map(item => <ReadinessCard props={item} key={item.id} />)}
        </>
    )
}

export default ReadinessChart