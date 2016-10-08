import React, { Component, PropTypes } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import routes from '../../routes';

class Root extends Component {
	render() {
		const { store, history } = this.props;
		return (
			<Provider store={store}>
				{/* https://github.com/reactjs/react-router/issues/2182 */}
				<Router history={history} routes={routes} />
			</Provider>
		);
	}
}

Root.propTypes = {
	history: PropTypes.any,
	store: PropTypes.any,
};

export default Root;
