import React, { useEffect, useState, useCallback } from 'react'
import { FlatList, View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native'
import { REACT_APP_BACKEND_URI } from 'react-native-dotenv'
import HRVReadingCard from './HRVReadingCard'
import axios from 'axios'
import { getLatestHRV } from '../../components/utils/GetHRVNative'


function HRVReadings() {

    const [readings, setReadings] = useState([])
    const [page, setPage] = useState(1) //page index
    const [size, setSize] = useState(5) //page size
    const [loadingMore, setLoadingMore] = useState(false) //infinite scroll loading 
    const [refreshing, setRefreshing] = useState(true) // pull to refresh loading
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false) //load only 1x per scroll movement

    const {height} = Dimensions.get('window');


    useEffect(() => {
        fetchReadings()
    }, [page])

    const fetchReadings = () => {
        axios.get(`${REACT_APP_BACKEND_URI}/api/readings/hrv/${page}/${size}`)
            .then(res => {
                const newReadings = res.data.data.map(reading => {
                    return { ...reading, readinessData: { data: [reading.hfpwrPercentile, reading.rMSSDPercentile, reading.sdnnPercentile] } }
                })
                setReadings(
                    (page === 1) ? newReadings : [...readings, ...newReadings]
                )

                setLoadingMore(false)
                setRefreshing(false)
            })
            .catch(err => {
                console.log(err)

                setLoadingMore(false)
                setRefreshing(false)
            })
    }

    const handleLoadMore = () => {
        //fire loading only when momentum stops
        if (!onEndReachedCalledDuringMomentum) {        
            setPage(page + 1)
            setLoadingMore(true)
            setOnEndReachedCalledDuringMomentum(true)
        }
    }

    const handleRefresh = useCallback(() => {
        setRefreshing(true)
        getLatestHRV()
            .then((res) => {
                setPage(1)
                fetchReadings()
            })
            .catch ((err) => {
                console.log(err)
                setRefreshing(false)
            })
    }, [refreshing])

    const renderFooter = () => {
        if (!loadingMore) return null

        return (
            <View>
                <ActivityIndicator animating size="large" />
            </View>
        );
    }

    return (
        <View style={styles.readingsContainer} style={{height: height, backgroundColor: '#151E29'}}>
            <FlatList
            style={styles.readingsCardsContainer}
                data={readings}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View
                        // style={{
                        //     marginTop: 25,
                        //     width: '100%'
                        // }}
                        style={styles.readingsCards}
                    >
                        <HRVReadingCard reading={item} />
                    </View>
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
                initialNumToRender={size}
                ListFooterComponent={renderFooter}
                onRefresh={handleRefresh}
                refreshing={refreshing}

            />
        </View>
    )
}

const styles = StyleSheet.create({
    readingsContainer: {
        backgroundColor: '#151E29',
       
    },
    readingsCardsContainer: {
    },
    readingsCards: {
       marginTop: 25
    }
})

export default HRVReadings