import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "ducks";
import sagas from "sagas";

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== "production" &&
  typeof window === "object" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })
    : compose;
/* eslint-enable */

export default (initialState = {}) => {
  const middlewares = [];

  // Create the saga middleware
  const sagaMiddleware = createSagaMiddleware({});
  middlewares.push(sagaMiddleware);

  // Create and export the store
  const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(...middlewares)
  );
  const finalCreateStore = createStoreWithMiddleware(createStore);
  const store = finalCreateStore(rootReducer, initialState);

  // Start the sagas
  sagaMiddleware.run(sagas);

  //   if (process.env.NODE_ENV !== "production") {
  //     if (module.hot) {
  //       module.hot.accept("../ducks/index", () => {
  //         store.replaceReducer(rootReducer);
  //       });
  //     }
  //   }

  return store;
};
