import React, { useEffect, useContext } from 'react';
import MainView from './readiness/MainView.js';
import Register from './auth/Register';
import Login from './auth/Login';
import AuthContext from '../context/auth/authContext';
import { createStackNavigator } from '@react-navigation/stack';
import setAuthToken from '../utils/setAuthToken';
import HRVReadings from './readings/HRVReadings.js';
import Spinner from './utils/Spinner';
import RNSpinner from './utils/RNSpinner';
import Import from './import/Import';


const Stack = createStackNavigator();


export default function WrapperMain() {

    //need this wrapper so AuthContext may be accessed for bootstrapping token
    const authContext = useContext(AuthContext)
    const { isAuthenticated, loading, bootstrapAsync, token, user } = authContext


    useEffect(() => {
        //get token from AsyncStorage if exists
        bootstrapAsync()
    }, [])

    useEffect(() => {
        //update axios defaults when token changes
        setAuthToken(token)
    }, [token, user])

    if (loading) {
        return <Spinner /> 
    }
    
    return (
        <Stack.Navigator>
            {!isAuthenticated ? (
                // No token found, user isn't signed in
                <>
                    <Stack.Screen
                        name="Login"
                        component={Login}
                    />
                    <Stack.Screen
                        name="Register"
                        component={Register}
                    />
                </>
            ) : (
                    <>
                        <Stack.Screen name="Home" component={MainView} />
                        <Stack.Screen name="Readings" component={HRVReadings} />
                        <Stack.Screen name="Import" component={Import} />
                    </>
                )}
        </Stack.Navigator>

    )
}

