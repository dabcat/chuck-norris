import React from 'react';
import { ThemeProvider } from 'store/context';
import Home from 'components/Home';
import './App.css';

function App() {
	return (
		<ThemeProvider defaultTheme="dark">
			<div className="App">
				<Home />
			</div>
		</ThemeProvider>
	);
}

export default App;
