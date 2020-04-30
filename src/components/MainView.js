import React, { useState, useEffect } from 'react'
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import RMSSDChart from './RMSSDChart'
import UpdateData from './UpdateData'
import ReadinessChart from './ReadinessChart'


export default function MainView() {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
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