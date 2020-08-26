import React, { useState, useContext, useEffect } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import AuthContext from '../../context/auth/authContext';



const Login = ({ navigation }) => {
    const authContext = useContext(AuthContext)
    const { login, error, clearErrors, isAuthenticated } = authContext

    const [ user, setUser ] = useState({
        email: '',
        password: '',
    })

    const { email, password } = user;

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
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss()
        }}>
            <View style={styles.container}>
                <View style={styles.hero}>
                    <Text style={styles.h1}>Hello</Text>
                    <Text style={styles.h3}>Sign into your account</Text>
                </View>
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
                <Text style={styles.p}>Forgot Password?</Text>
                <View style={styles.signInContainer}>
                    <Text style={styles.h2}>Sign in</Text>
                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => submit()}
                        underlayColor='#fff'
                    >
                        <Text style={styles.signInText}> &#x2192; </Text>
                    </TouchableOpacity>

                </View>
                <View style={styles.signUpContainer}> 
                    <Text style={styles.p2}>Don't have an account?</Text>
                    {/* <Button
                        style={styles.signUpButton}
                        title='Sign Up'
                        color='#fff'
                        onPress={() => navigation.navigate("Register")}
                    /> */}
                    <TouchableOpacity
                        style={styles.signUpButton}
                        // title='Sign Up'
                        color='#fff'
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.signUpText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#151E29',
        fontFamily: 'Lato',
    },
    hero: {
        marginBottom: 40
    },
    h1: {
        color:'#FFFFFF', 
        textAlign: 'center', 
        fontSize: 65,
        marginTop: 125
    },
    h2: {
        color:'#FFFFFF',
        fontSize: 25,
    },
    h3: {
        color:'#FFFFFF',
        textAlign: 'center',
        fontSize: 20,
    },
    textInput: {
        backgroundColor: '#ffffff',
        color: '#20A4f3',
        width: 300,
        borderRadius: 25,
        padding: 15,
        marginBottom: 20,
        marginLeft: 40
    },
    signInContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 40,
        marginTop: 100
    },
    p: {
        color: '#fff',
        textAlign: 'right',
        marginRight: 40,
        textDecorationLine: 'underline'
    },
    signInButton: {
        backgroundColor: '#20A4f3',
        borderRadius: 50,
        // borderWidth: 1,
        // padding: 20,
        height: 75,
        width: 75,
        marginLeft: 10
    },
    signInText: {
        color: "#fff",
        fontSize: 25,
        marginTop: 22,
        marginLeft: 20
    },
    signUpContainer: {
        display: 'flex',
        alignItems:'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 70,
        marginBottom: 100
    },
    p2: {
        color: '#fff',
        fontWeight: '200'
    },
    signUpText: {
        textDecorationLine:'underline',
        color: '#fff',
        marginLeft: 10,
        fontSize: 16
    }
});

export default Login