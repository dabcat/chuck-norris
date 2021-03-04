import React from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from 'hooks/debounce';
import { useTheme } from 'store/context';

import Loader from 'UI/Loader';
import ItemComponent from 'UI/Item';
import Switch from 'UI/Switch';
import SearchHistory from 'UI/SearchHistory';
import AutoSuggest from 'UI/AutoSuggest';
import style from './style.module.scss';

const HomeComponent = ({
	fact,
	facts,
	history,
	isLoading,
	searchFactQuery,
	resetSearch
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
		setQuery(q);
	};

	const clearQuery = () => {
		resetSearch();
		setQuery('');
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
						value={query}
						onChange={handleSearch}
						placeholder="Search for min 3 letters"
					/>
					{query && !isLoading && (
						<button
							tabIndex={0}
							aria-hidden="true"
							onClick={clearQuery}
							className={style.clearQueryButton}
							type="button"
							role="link"
						>
							x
						</button>
					)}
					<AutoSuggest results={facts} maxResults={6} query={query} />
				</label>
			</div>
			{facts.length === 0 && (
				<div className={style.randomFact}>
					<ItemComponent fact={fact} />
				</div>
			)}

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
	searchFactQuery: PropTypes.func.isRequired,
	resetSearch: PropTypes.func.isRequired
};

HomeComponent.defaultProps = {
	fact: {},
	facts: [],
	history: [],
	isLoading: false
};

export default HomeComponent;
