import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import ActionTypes from '../constants/ActionTypes';

function errorMessage(state = null, action) {
	const { type, error } = action;

	switch (type) {
	case ActionTypes.RESET_ERROR_MESSAGE:
		return null;
	default:
		return error ? error : null;
	}
}

function user(state = {} /* , action */) {
	return state;
}

const rootReducer = combineReducers({
	errorMessage,
	user,
	routing: routerReducer,
});

export default rootReducer;
