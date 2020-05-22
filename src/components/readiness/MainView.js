import React, {  useEffect, useCallback, useContext } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, AppState } from 'react-native'
import ReadinessChart from './ReadinessChart'
import ReadinessContext from '../../context/readiness/ReadinessContext'
import AuthContext from '../../context/auth/authContext'
import Logout from '../auth/Logout'
import HRVReadingsButton from '../readings/HRVReadingsButton'
import ImportButton from '../import/ImportButton'
import setAuthToken from '../../utils/setAuthToken'


export default function MainView({ navigation }) {

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

    const { isLoading, getLatestReadings, domain } = useContext(ReadinessContext)
    const { token } = useContext(AuthContext)

    const onRefresh = useCallback(() => {
        getLatestReadings()
    }, [isLoading, domain]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }>
                <ReadinessChart />
                <HRVReadingsButton navigation={navigation}/>
                {/* <ImportButton navigation={navigation} /> */}
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