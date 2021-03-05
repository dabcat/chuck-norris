import React from 'react';
import PropTypes from 'prop-types';
import { usePrevious } from 'hooks/state';

const ThemeContext = React.createContext();

export function useTheme() {
	const ctx = React.useContext(ThemeContext);
	if (ctx == null)
		throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}

export function ThemeProvider(props) {
	const { defaultTheme } = props;
	const [theme, setTheme] = React.useState(defaultTheme);
	const prevTheme = usePrevious(theme);

	React.useEffect(() => {
		document.body.classList.add(defaultTheme);
		document.body.classList.replace(prevTheme, theme);
	}, [theme, defaultTheme, prevTheme]);
	return <ThemeContext.Provider value={[theme, setTheme]} {...props} />;
}

ThemeProvider.propTypes = {
	defaultTheme: PropTypes.string.isRequired
};

export default ThemeContext;
