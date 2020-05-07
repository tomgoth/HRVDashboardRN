import React, { useEffect, useContext } from 'react';
import MainView from './MainView.js';
import Register from './Register'
import Login from './Login'
import AuthContext from '../context/auth/authContext';
import { createStackNavigator } from '@react-navigation/stack';
import setAuthToken from '../utils/setAuthToken'


const Stack = createStackNavigator();


export default function WrapperMain() {
    const authContext = useContext(AuthContext)
    const { isAuthenticated, bootstrapAsync, token, user } = authContext

    useEffect(() => {
        //get token from AsyncStorage if exists
        bootstrapAsync()
    }, [])

    useEffect(() => {
        //update axios defaults when token changes
        console.log('token UE',token)
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

