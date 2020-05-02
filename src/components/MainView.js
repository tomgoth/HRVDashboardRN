import React, { useState, useEffect, useCallback, useContext } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
import RMSSDChart from './RMSSDChart'
import UpdateData from './UpdateData'
import ReadinessChart from './ReadinessChart'
import ReadinessContext from '../context/ReadinessContext'


export default function MainView() {

    const readinessContext = useContext(ReadinessContext)
    const { isLoading, setIsLoading, getLatestReadings } = readinessContext

    const onRefresh = useCallback(() => {
        getLatestReadings()
    
    }, [isLoading]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }>
                <ReadinessChart />
                {/* <RMSSDChart /> */}
                <UpdateData />
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff"
    }
});