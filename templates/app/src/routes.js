import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import LoginPage from './containers/LoginPage';
import UserPage from './containers/UserPage';

export default (
	<Route path="/" component={App}>
		<IndexRoute component={LoginPage} />
		<Route path="/user/:login" component={UserPage} />
	</Route>
);
