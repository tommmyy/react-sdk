import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import configureStore from './store/configureStore';

injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
const rootElement = document.getElementById('root');


render(
	<AppContainer>
		<Root store={store} history={history} />
	</AppContainer>,
	rootElement
);

if (module.hot) {
	module.hot.accept('./containers/Root/index', () => {
		const NextRoot = require('./containers/Root').default;
		render(
			<AppContainer>
				<NextRoot store={store} history={history} />
			</AppContainer>,
			rootElement
		);
	});
}
// Keep this until this is fixed: https://github.com/reactjs/react-router/issues/2182
console.error = (() => {
	const error = console.error;
	return function(exception) {
		if (exception && typeof exception === 'string' && exception.match(/change <Router /)) {
			return;
		}

		error.apply(console, arguments);
	};
})();
