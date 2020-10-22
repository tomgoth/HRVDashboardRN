import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import ReadinessState from './src/context/readiness/ReadinessState'
import AuthState from './src/context/auth/AuthState';
import WrapperMain from './src/components/WrapperMain';
import AlertState from './src/context/alert/alertState';


export default function App() {
	
	return (
		<NavigationContainer>
			<AuthState>
				<AlertState>
					<ReadinessState>
						<WrapperMain/>
					</ReadinessState>
				</AlertState>
			</AuthState>
		</NavigationContainer>
	)
}