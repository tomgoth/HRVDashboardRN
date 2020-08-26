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
        <View style={styles.container}>
            <Text style={styles.h1}>Hello</Text>
            <Text style={styles.p}>Sign into your account</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor='rgba(28,53,63, .25)'
                keyboardType='email-address'
                autoCapitalize = 'none'
                onChangeText={(value) => setUser({ ...user, email: value })}
            />
            <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor='rgba(28,53,63, .25)'
                secureTextEntry={true}
                onChangeText={(value) => setUser({ ...user, password: value })}
            />
            <View>
                <Text>Sign in</Text>
                <Button
                    style={styles.button}
                    title='login'
                    onPress={() => submit()}
                />
            </View>
            <View>
                <Text>Don't have an account?</Text>
                <Button
                    style={styles.button}
                    title='Sign Up'
                    onPress={() => navigation.navigate("Register")}
                />
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#151E29',
        fontFamily: 'Lato',
    },
    h1: {
        color:'#FFFFFF', 
        textAlign: 'center', 
        fontSize: 65,
        marginTop: 125
    },
    p: {
        color:'#FFFFFF',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 40
    },
    textInput: {
        backgroundColor: '#ffffff',
        color: '#20A4f3',
        width: 300,
        borderRadius: 25,
        padding: 15,
        marginBottom: 10,
        marginLeft: 40
    },
    button: {
        borderColor: 'gray',
        borderWidth: 1
    }
});

export default Login