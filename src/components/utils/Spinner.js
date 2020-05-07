import React from 'react'
import { View, Image, StyleSheet } from 'react-native';
import spinner from './spinner.gif';

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
    },
    logo: {
      width: 200,
    }
  });

const Spinner = () => {
    return (
       
         <View style={styles.container}>
            <Image
                style={styles.logo}
                source={spinner}
            />
        </View>
    )
}

export default Spinner