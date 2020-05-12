import React from 'react'
import {Button} from 'react-native'

function HRVReadingsButton({navigation}){

    return (
        <Button 
            title='Readings Details'
            onPress={() => {navigation.navigate("Readings")}}
        />
    )
}
export default HRVReadingsButton