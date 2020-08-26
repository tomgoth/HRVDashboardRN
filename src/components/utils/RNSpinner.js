import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const RNSpinner = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="20A4F3"/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
})

export default RNSpinner;