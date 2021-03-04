export const actionTypes = {
	APP_BOOTSTRAP_REQUEST: 'APP/BOOSTRAP_REQUEST',
	APP_BOOTSTRAP_SUCCESS: 'APP/BOOSTRAP_SUCCESS',
	APP_BOOTSTRAP_FAILURE: 'APP/BOOSTRAP_FAILURE',

	APP_RANDOM_FACT_REQUEST: 'APP/RANDOM_FACT_REQUEST',
	APP_RANDOM_FACT_SUCCESS: 'APP/RANDOM_FACT_SUCCESS',
	APP_RANDOM_FACT_FAILURE: 'APP/RANDOM_FACT_FAILURE',

	APP_SEARCH_FACT_REQUEST: 'APP/SEARCH_FACT_REQUEST',
	APP_SEARCH_FACT_SUCCESS: 'APP/SEARCH_FACT_SUCCESS',
	APP_SEARCH_FACT_FAILURE: 'APP/SEARCH_FACT_FAILURE',

	APP_SEARCH_FACT_QUERY: 'APP/SEARCH_FACT_QUERY',

	APP_SEARCH_RESET: 'APP/SEARCH_RESET'
};

export const initialState = {
	init: {},
	fact: null,
	facts: [],
	history: [],
	isLoading: false
};

export default (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.APP_BOOTSTRAP_SUCCESS:
			return {
				...state,
				init: action.init
			};

		case actionTypes.APP_RANDOM_FACT_SUCCESS:
			return {
				...state,
				fact: action.fact
			};

		case actionTypes.APP_SEARCH_FACT_QUERY:
			return {
				...state,
				isLoading: true
			};
		case actionTypes.APP_SEARCH_FACT_SUCCESS:
			return {
				...state,
				facts: action.facts,
				history: action.history,
				isLoading: false
			};

		case actionTypes.APP_SEARCH_FACT_FAILURE:
			return {
				...state,
				isLoading: false
			};

		case actionTypes.APP_SEARCH_RESET:
			return {
				...state,
				facts: []
			};

		default:
			return state;
	}
};

export const actionCreators = {
	init: ({ init }) => ({
		type: actionTypes.APP_BOOTSTRAP_SUCCESS,
		init
	}),
	getRandomFact: ({ fact }) => ({
		type: actionTypes.APP_RANDOM_FACT_SUCCESS,
		fact
	}),
	searchFactResults: ({ facts, history }) => ({
		type: actionTypes.APP_SEARCH_FACT_SUCCESS,
		facts,
		history
	}),
	searchFactQuery: (query) => ({
		type: actionTypes.APP_SEARCH_FACT_QUERY,
		query
	}),
	resetSearch: () => ({
		type: actionTypes.APP_SEARCH_RESET
	})
};
