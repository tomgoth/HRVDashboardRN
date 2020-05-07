import React, {  useEffect, useCallback, useContext } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, AppState } from 'react-native'
// import RMSSDChart from './RMSSDChart'
import UpdateData from '../import/UpdateData'
import ReadinessChart from './ReadinessChart'
import ReadinessContext from '../../context/readiness/ReadinessContext'
import Logout from '../auth/Logout'


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
                <Logout />
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