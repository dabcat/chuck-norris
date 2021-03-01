import React from 'react';

const ThemeContext = React.createContext();

export function useTheme() {
	const ctx = React.useContext(ThemeContext);
	if (ctx == null)
		throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}

export function ThemeProvider(props) {
	const [theme, setTheme] = React.useState('light');

	React.useEffect(() => {
		if (theme === 'light') {
			document.body.classList.add('light');
			document.body.classList.remove('dark');
		} else {
			document.body.classList.add('dark');
			document.body.classList.remove('light');
		}
	}, [theme]);
	return <ThemeContext.Provider value={[theme, setTheme]} {...props} />;
}

export default ThemeContext;
