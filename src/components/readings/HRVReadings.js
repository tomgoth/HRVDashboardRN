import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'
import HRVReadingCard from './HRVReadingCard'
import axios from 'axios'
import Spinner from '../utils/Spinner'


function HRVReadings() {

    const [readings, setReadings] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        axios.get(`${REACT_APP_BACKEND_URI}/api/readings/hrv`)
            .then(res => {
                setReadings(res.data.data.map(reading => {
                    return {...reading, readinessData: {data: [reading.hfpwrPercentile, reading.rMSSDPercentile, reading.sdnnPercentile]}}
                }))
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }, [])

    if (isLoading) {
        return <Spinner />
    }

    return (
        <ScrollView>
            {readings.map(r => <HRVReadingCard reading={r} key={r.createdAt} />)}
        </ScrollView>

    )
}

export default HRVReadings