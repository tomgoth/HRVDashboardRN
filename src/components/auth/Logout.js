import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import AuthContext from '../../context/auth/authContext';

const Logout = (props) => {
    const authContext = useContext(AuthContext)
    const { logout } = authContext

    return (
        <TouchableOpacity 
            style={styles.logoutBtn}
            onPress={() => {logout()}}
        >
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    logoutBtn: {
        borderColor: '#20A4F3',
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 15,
        width: '90%',
        marginLeft: 20,
        marginTop: 10
    },
    logoutText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18
    }
})

export default Logout