## Project structure / architecture

- [Folder structure](#folder-structure)
- [Ducks (Redux bundles)](#ducks)
- [Actons](#actions)
- [Sagas](#sagas)
- [Styled components](#styled-components)
- [Layout](#layout)
- [Storybook](#storybook)
- [Tips](#tips)

### Folder structure

#### Feature based

- **components**
  - **<FeatureName>**
    - **index.js** (Define and export features public API)
    - **<FeatureName>Component.js** (stateless components)
    - **<FeatureName>Container.js** (HOC statefull components)
    - **<FeatureName>Styles.js** (styled components)
    - ...
- **ducks** (redux bundles - reducers, actionTypes, actionCreators, selectors
  grouped in single file per feature)
- **sagas** (redux side effects per feature)
- **services** (api and other type of services)
- **UI** (primitive/reusable styled components) - **Button** - **Button.js** -
  **ButtonStyles.js**
- **store** (redux store config, middlewares, etc.)
- **utils** (utility functions)

## Ducks

[Ducks](https://github.com/erikras/ducks-modular-redux) is a proposal for
bundling reducers, action types (actionTypes) and actions (actionCreators) in
the same file, leading to a reduced boilerplate.

- **app.js** (place for actions/types not tied to specific reducer - global)
- **index.js** (combineReducers)
- **HomePage.js** (reducers, action types, actions creators, selectors)
- **exampleComponent.js** (reducers, action types, actions creators, selectors)
- ...

index.js

```js
import { combineReducers } from 'redux';
import HomePage from './HomePage';
import ExampleComponent from './ExampleComponent';

export default combineReducers({ HomePage, ExampleComponent });
```

HomePage.js

```js
export const actionTypes = {
	SIGNUP_REQUEST: 'AUTH/SIGNUP_REQUEST',
	SIGNUP_SUCCESS: 'AUTH/SIGNUP_SUCCESS',
	SIGNUP_FAILURE: 'AUTH/SIGNUP_FAILURE',
	LOGIN_REQUEST: 'AUTH/LOGIN_REQUEST',
	LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
	LOGIN_FAILURE: 'AUTH/LOGIN_FAILURE',
	LOGOUT: 'AUTH/LOGOUT'
};

export const initialState = {
	user: null,
	isLoading: false,
	error: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SIGNUP_REQUEST:
		case actionTypes.LOGIN_REQUEST:
			return { ...state, isLoading: true, error: null };

		case actionTypes.SIGNUP_SUCCESS:
		case actionTypes.LOGIN_SUCCESS:
			return { ...state, isLoading: false, user: action.payload.user };

		case actionTypes.SIGNUP_FAILURE:
		case actionTypes.LOGIN_FAILURE:
			return { ...state, isLoading: false, error: action.payload.error };

		case actionTypes.LOGOUT:
			return { ...state, user: null };

		default:
			return state;
	}
};

export const actionCreators = {
	signup: (email, password) => ({
		type: actionTypes.SIGNUP_REQUEST,
		payload: {
			email,
			password
		}
	}),
	login: (email, password) => ({
		type: actionTypes.LOGIN_REQUEST,
		payload: {
			email,
			password
		}
	}),
	logout: () => ({ type: actionTypes.LOGOUT })
};
```

If we structure ducks this way, we can easily import actions inside components
like:

```js
import { actionCreators } from 'ducks/HomePage'

...

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(actionCreators, dispatch)
})
```

Using **bindActionCreators** our actionCreators are available via `this.props`.
We want to use **bindActionCreators** as it will make our code more readable and
easier to maintain.

If we need to dispatch actions of different ducks in component you can use alias
import:

```js
import { actionCreators as homeActionCreators } from 'ducks/HomePage'
import { actionCreators as exampleActionCreators } from 'ducks/ExampleComponent'

...

const mapDispatchToProps = (dispatch) => ({
    ...bindActionCreators({
        ...homeActionCreators,
        ...exampleActionCreators,
    }, dispatch)
})
```

## Actions

A basic Flux Standard Action:

```js
{
  type: 'ADD_TODO',
  payload: {
    text: 'Do something.'
  }
}
```

An FSA that represents an error, analogous to a rejected Promise:

```js
{
  type: 'ADD_TODO',
  payload: new Error(),
  error: true
}
```

An action MUST

- be a plain JavaScript object.
- have a `type` property.

An action MAY

- have an `error` property.
- have a `payload` property.
- have a `meta` property.

An action MUST NOT include properties other than `type`, `payload`, `error`, and
`meta`.

### `type`

The `type` of an action identifies to the consumer the nature of the action that
has occurred. `type` is a string constant. If two types are the same, they MUST
be strictly equivalent (using `===`).

### `payload`

The optional `payload` property MAY be any type of value. It represents the
payload of the action. Any information about the action that is not the `type`
or status of the action should be part of the `payload` field.

By convention, if `error` is `true`, the `payload` SHOULD be an error object.
This is akin to rejecting a promise with an error object.

### `error`

The optional `error` property MAY be set to `true` if the action represents an
error.

An action whose `error` is true is analogous to a rejected Promise. By
convention, the `payload` SHOULD be an error object.

If `error` has any other value besides `true`, including `undefined` and `null`,
the action MUST NOT be interpreted as an error.

### `meta`

The optional `meta` property MAY be any type of value. It is intended for any
extra information that is not part of the payload.

## Sagas

redux-saga is a redux middleware, like a separate thread in your application
that's solely responsible for side effects, which means this thread can be
started, paused and cancelled from the main application with normal redux
actions, it has access to the full redux application state and it can dispatch
redux actions as well.

Usefull examples and patterns:

- [Async api call](#async-api-call)
- [Take and Fork](#take-and-fork)
- [Watch and Fork](#watch-and-fork)
- [Put and Take](#put-and-take)
- [Error Handling](#error-handling)

#### Async api call

Example api service:

```js
// services/api.js
export const getUser = userId => (
    // `axios` function returns promise
    axios.get(`${baseUrl}/api/user/` + userId);
);
```

...then in saga file:

```js
function* getUserSaga(action) {
	// yield call function is used to create effect description, which instructs middleware to call the promise.
	const data = yield call(api.getUser, action.userId);
	// saga middleware to dispatch corresponding action.
	try {
		// put function creates effect, in which instructs middleware to dispatch success action to the store.
		yield put({
			type: 'GET_USER_SUCCESS',
			data
		});
	} catch (error) {
		// put function creates effect, in which instructs middleware to dispatch failed action to the store.
		yield put({
			type: 'GET_USER_FAILED',
			error
		});
	}
}
```

#### Take and Fork

It's like a listener. This will work only once, after you exec the process it
won’t work anymore.

```js
/* this is the saga you are going to register */
export function* aListenerOnlySaga() {
	const user = yield take('CHANGE_USER');
	yield fork(changeUserData, user);
}
function* changeUserData(user) {
	/* Any process you need to do */

	const userName = yield call(getUserName, user);
	yield put({
		type: 'USER_CHANGE_SUCCESS',
		payload: userName
	});
}
```

#### Watch and Fork

Watch for every change

```js
export function* listenFor() {
	while (true) {
		// <=======
		const user = yield take('CHANGE_USER');
		yield fork(changeUserData, user);
	}
}
```

...or in root saga use `takeEvery` operator:

```js
/* Where you register the sagas */
function* rootSagas() {
	yield all([takeEvery('CHANGE_USER', changeUserData)]);
}
```

#### Put and Take

This pattern is useful when you need to process different sequential events:

```js
export function* sequentialEvents() {
	while (true) {
		yield put({ type: 'SOME_EVENT_STARTS' });
		/* 
        computing stuff...
       */
		yield take('SOME_EVENT_SUCCESS');
	}
}
```

...and consume it like:

```js
function* rootSagas() {
	yield all([takeEvery('SOME_EVENT', sequentialEvents)]);
}
```

#### Error Handling

```js
export default function* errorHandlerSaga(action) {
	const { err, type } = action;
	const error = err.message || err;
	// dispatch error event with error message
	yield put({
		type,
		error
	});
	// also dispatch another event which in this case opens modal window and displays the message
	yield put({
		type: uiActionTypes.UI_MODAL_SHOW,
		modal: {
			type: modalTypesConstants.errorModal,
			message: error
		}
	});
}
```

...and consume it like:

```js
import errorHandlerSaga from 'sagas/errorHandlerSaga';
export function* someExampleSaga() {
	try {
		/*
        do some stuff here
        */
	} catch (err) {
		// here we are calling errorHandlerSaga saga and are passing through error and event name
		yield call(errorHandlerSaga, {
			err,
			type: 'EXAMPLE_EVENT_FAILED'
		});
	}
}
```

## Styled components

### About

[styled-components](https://www.styled-components.com/) library let's you create
normal React components with your styles attached to it.

If the styled target is a simple element (e.g. `styled.div`), styled-components
passes through any known HTML attribute to the DOM. If it is a custom React
component (e.g. `styled(MyComponent)`), styled-components passes through all
props. You can use the "as" polymorphic prop to dynamically swap out the element
that receives the styles you wrote.

```js
const Button = styled.button`
	display: inline-block;
	padding: 0.25em 1em;
	color: white;
	background-color: palevioletred;
`;

const TommatoButton = styled(Button)`
	background-color: tomato;
`;

render() {
	return (
		<>
			<Button>normal button</Button>
			<TommatoButton as="a" href="https://odt.net">link with TommatoButton styles</TommatoButton>
			<Button as={Link} to="/">Link component with Button styles</Link>
		</>
	);
}
```

### Organizing styled-components

Primitive UI styled-components go in the `src/UI` direcotory, and one-off
components near to the container components that render them
(`<ComponentName>Styles.js`), and are all imported under the `S` namespace.

- Don't have to import each component separately.
- Visual distinction between a styled component, and an actual component.
- Autocomplete when typing `S`.

```js
// NavigationComponent.js
import * as S from './NavigationComponentStyles.js';

const Navigation = ({ content }) => (
	<S.Navigation>
		<S.Content>{content}</S.Content>
	</S.Navigation>
);
```

## Layout

### Components and options for laying out the project

#### Containers

Containers are the most basic layout element and are required when using our
grid system. Choose from a responsive, fixed-width container (meaning its
`max-width` changes at each breakpoint) or fluid-width (meaning it’s `100%` wide
all the time).

While containers can be nested, most layouts do not require a nested container.

Pass `floud` prop for a full width container.

```js
import Container from 'UI/Container/Container';

render() {
	return (
		<Container fluid>
			content here
		</Container>
	);
}
```

#### Grid system

Grid system uses a series of containers, rows, and columns to layout and align
content.

```js
import Container from 'UI/Container/Container';
import Row from 'UI/Row/Row';
import Col from 'UI/Col/Col';

render() {
	return (
		<Container>
			<Row>
				<Col md={3}>1 of 3</Col>
				<Col md={6}>2 of 3 (wider)</Col>
				<Col md={3}>3 of 3</Col>
			</Row>
		</Container>
	)
}
```

## Tips

#### Try to avoid using setState and component lifecycle hooks when using Redux

Manage the application state using redux store when it is global state. Try to
avoid using setState in your component when you are using state management
libraries like redux. Use component state when it makes sense ie. A Button
component that shows a tooltip when hovered would not use Redux.

#### Use axios library for http requests over fetch

- It allows performing transforms on data before request is made or after
  response is received.
- It allows you to alter the request or response entirely (headers as well).
  also perform async operations before request is made or before Promise
  settles.
- Built-in XSRF protection.

#### Presentational and Container Components

Containers provide the data needed to render the presentational components. This
means that the presentational components don’t have direct access to your Redux
store or actions. Instead, they are passed down as props from their containers.

#### Redux actionTypes

As a good practice, you should try to scope the names based on the feature they
belong to. This helps when debugging more complex applications.

example: `APP/AUTH/SIGNUP_REQUEST`, `APP/HOMEPAGE/SOME_ACTION`

---

# Getting Started with Create React App

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best
performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn’t feel obligated to use this
feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.

## Learn More

You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here:
[https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here:
[https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here:
[https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here:
[https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here:
[https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here:
[https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
