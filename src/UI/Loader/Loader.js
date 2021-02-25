import React from 'react';
import PropTypes from 'prop-types';
import style from './Loader.module.css';

const Loader = ({ isLoading }) =>
	isLoading ? (
		<div className={style.loader}>
			<div />
			<div />
		</div>
	) : null;

Loader.propTypes = {
	isLoading: PropTypes.bool
};

Loader.defaultProps = {
	isLoading: false
};

export default Loader;
