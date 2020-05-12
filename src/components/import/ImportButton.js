import React from 'react'
import {Button} from 'react-native'

function HRVReadingsButton({navigation}){

    return (
        <Button 
            title='Bulk Import Readings'
            onPress={() => { navigation.navigate("Import") }}
        />
    )
}
export default HRVReadingsButton