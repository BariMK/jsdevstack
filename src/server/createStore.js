import Promise from 'bluebird';
import initialState from './initstate';
import configureStore from './configureStore';
import {fromJS} from 'immutable';
import {combineReducers, applyMiddleware, createStore} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

export default function createAppStore(req) {
  return new Promise((resolve, reject) => {
    const requestState = fromJS(initialState);
    const store = configureStore(requestState.toJS());

    resolve(store);
  });
}
