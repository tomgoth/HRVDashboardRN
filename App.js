import React, { Component } from 'react';
import ReadinessState from './src/context/ReadinessState'
import MainView from './src/components/MainView.js';

export default function App() {
	return (
		<ReadinessState>
			<MainView />
		</ReadinessState>
	)
}