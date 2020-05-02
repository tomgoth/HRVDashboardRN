import React, { useEffect, useContext } from 'react'
import { Dimensions, Button } from 'react-native'
import { ProgressChart } from 'react-native-chart-kit'
import ReadinessCard from './ReadinessCard'
import ReadinessContext from '../context/ReadinessContext'

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