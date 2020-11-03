import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

function HRVReadingsButton({navigation}){

    return (
        <TouchableOpacity 
            style={styles.hrvReadingsBtn}
            onPress={() => {navigation.navigate("Readings")}}
        >
            <Text style={styles.hrvReadingsText}>Reading Details</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    hrvReadingsBtn: {
        borderColor: '#20A4F3',
        borderWidth: 1.5,
        borderRadius: 10,
        padding: 15,
        width: '90%',
        marginLeft: 20
    },
    hrvReadingsText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18
    }
})

export default HRVReadingsButton