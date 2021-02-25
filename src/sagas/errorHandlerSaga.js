import { put } from "redux-saga/effects";

export default function* errorHandlerSaga(action) {
  const { err, type } = action;
  const error = err.message || err;
  yield put({
    type,
    error,
  });
}
