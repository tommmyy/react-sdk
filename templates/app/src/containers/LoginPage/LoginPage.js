import React, { Component } from 'react';
import Button from 'gef-ui-components/atoms/Button';

class LoginPage extends Component {
	render() {
		return (
			<div>
				<h1>Login</h1>
				<Button label="Login" primary />
			</div>
		);
	}
}

export default LoginPage;
