import React, { useState, useContext, useEffect } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Alert } from 'react-native'
import AuthContext from '../../context/auth/authContext';


const Login = ({ navigation }) => {
    const authContext = useContext(AuthContext)
    const { login, error, clearErrors, isAuthenticated } = authContext

    const [ user, setUser ] = useState({
        email: '',
        password: '',
    })

    const { email, password } = user

    useEffect(() => {
        //if a bigger app i would use an id for the error
        if (error) {
            Alert.alert(
                "Error",
                error,
                [

                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            )
            clearErrors()
        }
    }, [error, isAuthenticated])

    const submit = () => {
        if (email === '' || password === '') {
            Alert.alert(
                "Error",
                'Please fill in all fields',
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        } else {
            login({
                email,
                password
            })
        }
    }

    return (
        <View>
             <Text>Email</Text>
            <TextInput
                style={styles.textInput}
                keyboardType='email-address'
                autoCapitalize = 'none'
                onChangeText={(value) => setUser({ ...user, email: value })}
            />
            <Text>Password</Text>
            <TextInput
                style={styles.textInput}
                secureTextEntry={true}
                onChangeText={(value) => setUser({ ...user, password: value })}
            />
            <Button
                style={styles.button}
                title='Login'
                onPress={() => submit()}
            />
            <Text>Don't have an account?</Text>
            <Button
                style={styles.button}
                title='Sign Up'
                onPress={() => navigation.navigate("Register")}
            />
        </View>

    )
}
const styles = StyleSheet.create({
    textInput: {
        color: 'gray',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1
    },
    button: {
        borderColor: 'gray',
        borderWidth: 1
    }
});

export default Login