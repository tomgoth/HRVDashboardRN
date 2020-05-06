import React, { useEffect, useContext } from 'react';
import MainView from './MainView.js';
import Register from './Register'
import AuthContext from '../context/auth/authContext';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();


export default function WrapperMain() {
    const authContext = useContext(AuthContext)
    const { isAuthenticated, bootstrapAsync } = authContext

    useEffect(() => {
        bootstrapAsync()
    }, [])

    return (
        <Stack.Navigator>
            {!isAuthenticated ? (
                // No token found, user isn't signed in
                <Stack.Screen
                    name="Register"
                    component={Register}
                />
            ) : (
                    // User is signed in
                    <Stack.Screen name="Home" component={MainView} />
                )}
        </Stack.Navigator>

    )
}

