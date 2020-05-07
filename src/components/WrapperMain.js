import React, { useEffect, useContext } from 'react';
import MainView from './readiness/MainView.js';
import Register from './auth/Register'
import Login from './auth/Login'
import AuthContext from '../context/auth/authContext';
import { createStackNavigator } from '@react-navigation/stack';
import setAuthToken from '../utils/setAuthToken'


const Stack = createStackNavigator();


export default function WrapperMain() {
    
    //need this wrapper so AuthContext may be accessed for bootstrapping token
    const authContext = useContext(AuthContext)
    const { isAuthenticated, bootstrapAsync, token, user } = authContext

    
    useEffect(() => {
        //get token from AsyncStorage if exists
        bootstrapAsync()
    }, [])

    useEffect(() => {
        //update axios defaults when token changes
        setAuthToken(token)
    }, [token, user])

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
                    // User is signed in
                    <Stack.Screen name="Home" component={MainView} />
                )}
        </Stack.Navigator>

    )
}

