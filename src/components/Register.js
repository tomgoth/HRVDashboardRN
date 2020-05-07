import React, { useState, useContext, useEffect } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Alert } from 'react-native'
// import AlertContext from '../context/alert/alertContext';
import AuthContext from '../context/auth/authContext';


const Register = (props) => {
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
        <View>
            <Text>Name</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Text>Email</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(value) => setUser({ ...user, email: value })}
            />
            <Text>Password</Text>
            <TextInput
                style={styles.textInput}
                secureTextEntry={true}
                onChangeText={(value) => setUser({ ...user, password: value })}
            />
            <Text>Confirm Password</Text>
            <TextInput
                style={styles.textInput}
                secureTextEntry={true}
                onChangeText={(value) => setUser({ ...user, password2: value })}
            />
            <Button
                style={styles.button}
                title='Register'
                onPress={() => submit()}
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

export default Register