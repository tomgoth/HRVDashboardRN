import React, {  useEffect, useCallback, useContext } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, AppState } from 'react-native'
// import RMSSDChart from './RMSSDChart'
import UpdateData from './UpdateData'
import ReadinessChart from './ReadinessChart'
import ReadinessContext from '../context/ReadinessContext'


export default function MainView() {

    useEffect(() => {
        AppState.addEventListener('change', handleChange);  
      
        return () => {
          AppState.removeEventListener('change', handleChange);  
        }
      }, []);
      
      
      const handleChange = (newState) => {
        if (newState === "active") {
            getLatestReadings()
        }
      }

    const readinessContext = useContext(ReadinessContext)
    const { isLoading, getLatestReadings } = readinessContext

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