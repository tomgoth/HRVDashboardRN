import React, { useState, useContext, useEffect } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Alert } from 'react-native'
import AuthContext from '../context/auth/authContext';

const Login = (props) => {
    const authContext = useContext(AuthContext)
    const { register, error, clearErrors, isAuthenticated } = authContext

    const [ user, setUser ] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {
        //if a bigger app i would use an id for the error
        Alert.alert(
            "Error",
            `${error}`,
            [

                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
        clearErrors()
    }, [error, isAuthenticated])

    return (
        
    )
}