import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
// import AlertContext from '../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Register = ({ navigation }) => {
    // const alertContext = useContext(AlertContext)
    const authContext = useContext(AuthContext)
    const { register, error, clearErrors, isAuthenticated } = authContext

    useEffect(() => {
        //if a bigger app i would use an id for the error
        if (error === 'User already exists') {
            // setAlert(error, 'danger')
            Alert.alert(
                "Error: User Already Exists",
                `Choose a different email: ${email}`,
                [
                  
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
            clearErrors()
        }

        // we want this to run when the error changes or added to state
        //eslint-disable-next-line
    }, [error, isAuthenticated])

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = user

    const submit = () => {
        
        if (name === '' || email === '' || password === '') {
            Alert.alert(
                "Error: missing fields",
                'Please enter all fields',
                [
                  
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
        } else if (password !== password2) {
            Alert.alert(
                "Error",
                'Passwords do not match',
                [
                  
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
        } else {
            register({
                name,
                email,
                password
            })
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss()
        }} >
            <View style={styles.container}>
                <Text style={styles.h1}>Create account</Text>

                <View style={styles.inputContainers}>
                    <FontAwesomeIcon  icon={faUser} style={styles.inputIcons} size={20} />
                    <TextInput
                        placeholder="Name"
                        placeholderTextColor='rgba(28,53,63, .25)'
                        autoCapitalize = 'words'
                        style={styles.textInput}
                        onChangeText={(value) => setUser({ ...user, name: value })}
                    />
                </View>

                <View style={styles.inputContainers}>
                    <FontAwesomeIcon  icon={faEnvelope} style={styles.inputIcons} size={20} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        placeholderTextColor='rgba(28,53,63, .25)'
                        keyboardType='email-address'
                        autoCapitalize = 'none'
                        onChangeText={(value) => setUser({ ...user, email: value })}
                    />
                </View>

                <View style={styles.inputContainers}>
                    <FontAwesomeIcon  icon={faLock} style={styles.inputIcons} size={20} />
                    <TextInput
                        style={styles.textInput}
                        placeholder='Password'
                        placeholderTextColor='rgba(28,53,63, .25)'
                        secureTextEntry={true}
                        onChangeText={(value) => setUser({ ...user, password: value })}
                    />
                </View>

                <View style={styles.inputContainers}>
                    <FontAwesomeIcon  icon={faLock} style={styles.inputIcons} size={20} />
                    <TextInput
                        style={styles.textInput}
                        placeholder='Confirm Password'
                        placeholderTextColor='rgba(28,53,63, .25)'
                        secureTextEntry={true}
                        onChangeText={(value) => setUser({ ...user, password2: value })}
                    />
                </View>
    
                <View style={styles.signUpContainer}>
                    <Text style={styles.h2}>Create</Text>
                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={() => submit()}
                        underlayColor='#fff'
                    >
                        <Text style={styles.signUpText}> &#x2192; </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.signInContainer}> 
                    <Text style={styles.p2}>Already have an account?</Text>
                    <TouchableOpacity
                            style={styles.signInButton}
                            color='#fff'
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={styles.signInText}>Sign in</Text>
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
    h1: {
        color:'#FFFFFF', 
        textAlign: 'center', 
        fontSize: 30,
        marginTop: 100,
        marginBottom: 40
    },
    h2: {
        color:'#FFFFFF',
        fontSize: 25,
    },
    inputContainers: {
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
    inputIcons: {
        marginLeft: 10,
        marginRight: 10,
        color: '#20A4f3',
    },
    textInput: {
        color: '#20A4f3',
        fontSize: 15
    },
    signUpContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 40,
        marginTop: 40
    },
    signUpButton: {
        backgroundColor: '#20A4f3',
        borderRadius: 50,
        height: 75,
        width: 75,
        marginLeft: 10
    },
    signUpText: {
        color: "#fff",
        fontSize: 25,
        marginTop: 22,
        marginLeft: 20
    },
    signInContainer: {
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
    signInText: {
        textDecorationLine:'underline',
        color: '#fff',
        marginLeft: 10,
        fontSize: 17
    }
});

export default Register;