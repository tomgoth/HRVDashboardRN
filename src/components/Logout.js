import React, { useContext } from 'react';
import { Button } from 'react-native'
import AuthContext from '../context/auth/authContext';

const Logout = (props) => {
    const authContext = useContext(AuthContext)
    const { logout } = authContext

    return (
        <Button 
            title='Logout'
            onPress={() => {logout()}}
        />
    )
}

export default Logout