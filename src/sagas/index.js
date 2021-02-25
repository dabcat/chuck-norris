// root saga/table of content of all the sagas

import { all } from "redux-saga/effects";

import appSaga from "./appSaga";

export default function* rootSaga() {
  yield all([appSaga()]);
}
