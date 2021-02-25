import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as appActionCreators } from 'ducks/appDuck';

import HomeComponent from './component';

const mapStateToProps = (state) => {
	const {
		app: { fact, facts, isLoading }
	} = state;

	return {
		fact,
		facts,
		isLoading
	};
};

const mapDispatchToProps = (dispatch) => ({
	...bindActionCreators(
		{
			...appActionCreators
		},
		dispatch
	)
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
