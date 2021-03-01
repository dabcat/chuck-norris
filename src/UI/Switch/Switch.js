import React from 'react';
import PropTypes from 'prop-types';
import style from './Switch.module.scss';

const Switch = ({ onChange, value, ...props }) => (
	<div className={style.switch}>
		<label htmlFor="true">
			<input {...props} checked={value} onChange={onChange} type="checkbox" />
			<div>
				<div />
			</div>
		</label>
	</div>
);
Switch.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.any.isRequired
};

export default Switch;
