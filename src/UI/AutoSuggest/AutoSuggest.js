import React from 'react';
import PropTypes from 'prop-types';
import ItemComponent from 'UI/Item';
import style from './AutoSuggest.module.scss';

const AutoSuggest = ({ results, maxResults, query }) =>
	results.length > 0 && query.length > 0 ? (
		<div className={style.container}>
			{results.slice(0, maxResults).map((item) => (
				<ItemComponent key={item.id} fact={item} />
			))}
		</div>
	) : null;

AutoSuggest.propTypes = {
	results: PropTypes.array,
	maxResults: PropTypes.number,
	query: PropTypes.string
};

AutoSuggest.defaultProps = {
	results: [],
	maxResults: 6,
	query: ''
};

export default AutoSuggest;
