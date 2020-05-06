import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import ReadinessState from './src/context/ReadinessState'
import AuthState from './src/context/auth/AuthState';
import WrapperMain from './src/components/WrapperMain';


export default function App() {
	
	return (
		<NavigationContainer>
			<AuthState>
				<ReadinessState>
					<WrapperMain/>
				</ReadinessState>
			</AuthState>
		</NavigationContainer>
	)
}