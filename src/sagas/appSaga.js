import { all, put, call, takeLatest, select } from 'redux-saga/effects';
import {
	actionCreators as appActionCreators,
	actionTypes as appActionTypes
} from 'ducks/appDuck';
import apiService from 'services/apiService';
import errorHandlerSaga from 'sagas/errorHandlerSaga';

export function* getAppInitSaga() {
	try {
		const data = yield call(apiService.getRandomFact);
		yield put(
			appActionCreators.init({
				init: 'yay!'
			})
		);
		yield put(
			appActionCreators.getRandomFact({
				fact: data
			})
		);
	} catch (err) {
		yield call(errorHandlerSaga, {
			err,
			type: appActionTypes.APP_BOOTSTRAP_FAILURE
		});
	}
}

export function* searchResultsSaga(action) {
	try {
		const { query } = action;

		const { result } = yield call(apiService.searchFact, query);
		const { history } = yield select((state) => state.app);
		yield put({
			type: appActionTypes.APP_SEARCH_FACT_SUCCESS,
			facts: result,
			history: history ? [...history, query] : [query]
		});
	} catch (err) {
		yield call(errorHandlerSaga, {
			err,
			type: appActionTypes.APP_SEARCH_FACT_FAILURE
		});
	}
}

export default function* appSaga() {
	yield all([
		getAppInitSaga(),
		takeLatest(appActionTypes.APP_SEARCH_FACT_QUERY, searchResultsSaga)
	]);
}
