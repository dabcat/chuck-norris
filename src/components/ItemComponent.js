import React from 'react';
import PropTypes from 'prop-types';
import style from './itemComponent.module.css';

const ItemComponent = ({ fact }) => (
	<div className={style.item}>
		<div className={style.image}>
			<img src={fact.icon_url} alt="" />
		</div>
		<div className={style.text}>{fact.value}</div>
	</div>
);

ItemComponent.propTypes = {
	fact: PropTypes.object
};

ItemComponent.defaultProps = {
	fact: {}
};
export default ItemComponent;
