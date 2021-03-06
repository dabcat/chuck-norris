/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import style from './SearchHistory.module.scss';

const SearchHistory = ({ history, recentSearch, showMax }) =>
	history.length > 0 ? (
		<>
			<h2>Recent Searches</h2>
			<ul className={style.list}>
				{history.slice(0, showMax).map((i, index) => (
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events
					<li key={`${i}-${index}`} onClick={() => recentSearch(i)}>
						{i}
					</li>
				))}
			</ul>
		</>
	) : null;
SearchHistory.propTypes = {
	history: PropTypes.array,
	recentSearch: PropTypes.func,
	showMax: PropTypes.number
};

SearchHistory.defaultProps = {
	history: [],
	recentSearch: () => null,
	showMax: 10
};

export default SearchHistory;
