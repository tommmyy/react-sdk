import React, { Component, PropTypes } from 'react';
import DevTools from '../DevTools';
import './App.scss';

class App extends Component {
	render() {
		return (
			<div>
				<h1>Application!</h1>
				{this.props.children}
				{__DEV__ ? <DevTools /> : null}
			</div>
		);
	}
}

App.propTypes = {
	children: PropTypes.node,
};

export default App;
