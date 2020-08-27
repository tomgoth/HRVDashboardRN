import React, { useState, useContext, useEffect } from 'react';
import { View, ImageBackground, Image, Text, TextInput, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import AuthContext from '../../context/auth/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

// const image = {source: '../utils/bgLoginImage.png'}

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
                {/* <ImageBackground
                    style={styles.bgImage}
                    source={require('../utils/bgLoginImage3.png')}
                > */}

                <Image style={styles.bgImage} source={require('../utils/Logo.png')} />

                <View style={styles.hero}>
                    <Text style={styles.h1}>Hello</Text>
                    <Text style={styles.h3}>Sign into your account</Text>
                </View>

                <View style={styles.emailAndPasswordInput}>
                    <FontAwesomeIcon  icon={faEnvelope} style={styles.emailAndPasswordIcon} size={20} />
                    <TextInput
                        style={styles.textInput}
                        placeholder='Email'
                        placeholderTextColor='rgba(28,53,63, .25)'
                        keyboardType='email-address'
                        autoCapitalize = 'none'
                        onChangeText={(value) => setUser({ ...user, email: value })}
                    />
                </View>

                <View style={styles.emailAndPasswordInput}>
                    <FontAwesomeIcon icon={faLock} style={styles.emailAndPasswordIcon} size={20}  />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Password"
                        placeholderTextColor='rgba(28,53,63, .25)'
                        secureTextEntry={true}
                        onChangeText={(value) => setUser({ ...user, password: value })}
                    />
                </View>
                
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
                    <TouchableOpacity
                        style={styles.signUpButton}
                        color='#fff'
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.signUpText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
                {/* </ImageBackground> */}
            </View>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor:'#151E29',
        fontFamily: 'Lato',
    },
    bgImage: {
        width: 80,
        height: 80,
        marginLeft: 150,
        marginTop: 30
        
    },
    hero: {
        marginBottom: 40,
    },
    h1: {
        color:'#FFFFFF', 
        textAlign: 'center', 
        fontSize: 65,
        marginTop: 10
    },
    h2: {
        color:'#FFFFFF',
        fontSize: 25,
    },
    h3: {
        color:'#FFFFFF',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 20
    },
    emailAndPasswordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        color: '#20A4f3',
        borderRadius: 25,
        padding: 15,
        marginBottom: 20,
        width: 300,
        marginLeft: 40
    },
    emailAndPasswordIcon: {
        marginLeft: 10,
        marginRight: 10,
        color: '#20A4f3',
    },
    textInput: {
        color: '#20A4f3',
        fontSize: 15
    },
    signInContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 40,
        marginTop: 60
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
        marginTop: 80,
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
        fontSize: 17
    }
});

export default Login