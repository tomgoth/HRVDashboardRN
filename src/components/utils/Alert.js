import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Alert = (props) => (
    <View style={styles.container}>
        <Text color="#151E29">{props.message}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor:  "#FE4A49"
    }
})

export default Alert;