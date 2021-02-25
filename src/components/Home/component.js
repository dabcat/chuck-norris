import React from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from 'hooks/debounce';
import { useTheme } from 'store/context';

import Loader from 'UI/Loader';
import ItemComponent from 'UI/Item';
import Switch from 'UI/Switch';
import style from './style.module.scss';

const HomeComponent = ({ fact, facts, isLoading, searchFactQuery }) => {
	const [query, setQuery] = React.useState('');
	const debounceQuery = useDebounce(query, 500);

	const [theme, setTheme] = useTheme();

	React.useEffect(() => {
		if (debounceQuery.length >= 3) {
			searchFactQuery(debounceQuery);
		}
	}, [searchFactQuery, debounceQuery]);

	const handleSearch = (e) => {
		setQuery(e.target.value);
	};

	const changeTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};
	return (
		<div className={style.container}>
			<div className={style.themeSwitch}>
				<span>Light</span>{' '}
				<Switch value={theme === 'dark'} onChange={changeTheme} />{' '}
				<span>Dark</span>
			</div>
			<div className={style.search}>
				<label htmlFor="text">
					<Loader isLoading={isLoading} />
					<input
						id="text"
						type="text"
						onKeyUp={handleSearch}
						placeholder="Search for min 3 letters"
					/>
				</label>
			</div>
			<div className={style.randomFact}>
				<ItemComponent fact={fact} />
			</div>

			{facts.slice(0, 6).map((item) => (
				<ItemComponent key={item.id} fact={item} />
			))}
		</div>
	);
};

HomeComponent.propTypes = {
	fact: PropTypes.object,
	facts: PropTypes.array,
	isLoading: PropTypes.bool,
	searchFactQuery: PropTypes.func.isRequired
};

HomeComponent.defaultProps = {
	fact: {},
	facts: [],
	isLoading: false
};

export default HomeComponent;
