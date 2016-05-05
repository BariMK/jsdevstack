import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import { apiMiddleware } from 'redux-api-middleware';
import {applyMiddleware, createStore, compose, combineReducers} from 'redux';
import appReducer from '../client/reducer';
import config from './config'

export default function configureStore(initialState) {
    const middlewares = [
        promiseMiddleware,
        apiMiddleware
    ];

    const finalCreateStore = compose(
        applyMiddleware(...middlewares),
        typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' && !config.isProduction
            ? window.devToolsExtension() : f => f
    )(createStore);

    return finalCreateStore(appReducer, initialState);
}
