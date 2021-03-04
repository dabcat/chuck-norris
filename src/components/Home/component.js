import React from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from 'hooks/debounce';
import { useTheme } from 'store/context';

import Loader from 'UI/Loader';
import ItemComponent from 'UI/Item';
import Switch from 'UI/Switch';
import SearchHistory from 'UI/SearchHistory';
import style from './style.module.scss';

const HomeComponent = ({
	fact,
	facts,
	history,
	isLoading,
	searchFactQuery
}) => {
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

	const handleSearchAgain = (q) => {
		searchFactQuery(q);
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
			{facts.length === 0 && (
				<div className={style.randomFact}>
					<ItemComponent fact={fact} />
				</div>
			)}

			{facts.slice(0, 6).map((item) => (
				<ItemComponent key={item.id} fact={item} />
			))}

			<SearchHistory
				history={history}
				recentSearch={handleSearchAgain}
				showMax={10}
			/>
		</div>
	);
};

HomeComponent.propTypes = {
	fact: PropTypes.object,
	facts: PropTypes.array,
	isLoading: PropTypes.bool,
	history: PropTypes.array,
	searchFactQuery: PropTypes.func.isRequired
};

HomeComponent.defaultProps = {
	fact: {},
	facts: [],
	history: [],
	isLoading: false
};

export default HomeComponent;
