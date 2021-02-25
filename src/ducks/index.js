import { combineReducers } from "redux";

import appDuck from "./appDuck";

const appReducer = combineReducers({
  app: appDuck,
});

export default (state, action) => appReducer(state, action);
