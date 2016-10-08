import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

function configureStore(preloadedState) {
	const store = createStore(
		rootReducer,
		preloadedState,
		__DEV__ ?
			compose(
				applyMiddleware(thunk, createLogger()),
				DevTools.instrument()
			) : applyMiddleware(thunk)
	);

	if (__DEV__ && module.hot) {
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers').default;
			store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}

export default configureStore;
