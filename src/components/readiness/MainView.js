import React, { useEffect, useCallback, useContext } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, RefreshControl, AppState } from 'react-native'
import ReadinessChart from './ReadinessChart'
import ReadinessContext from '../../context/readiness/ReadinessContext'
import AuthContext from '../../context/auth/authContext'
import Logout from '../auth/Logout'
import HRVReadingsButton from '../readings/HRVReadingsButton'
import ImportButton from '../import/ImportButton'
import setAuthToken from '../../utils/setAuthToken'
import AlertContext from '../../context/alert/alertContext'
import Alert from '../../components/utils/Alert'
import SWCButton from './SWCButton'


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
    const { alert, hasAlert } = useContext(AlertContext)

    const onRefresh = useCallback(() => {
        getLatestReadings()
    }, [isLoading, domain]);

    return (

        <SafeAreaView style={styles.container}>

            <ScrollView refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
            }>
                {hasAlert && (
                    <Alert message={alert} />
                )}
                <ReadinessChart />
                <HRVReadingsButton navigation={navigation} />
                <SWCButton navigation={navigation} />
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
        backgroundColor: "#151E29",
    }
});