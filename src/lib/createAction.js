import request from 'superagent'
import {fromJS} from 'immutable'
import cookie from 'react-cookie'
import config from '../server/config'
import { CALL_API } from 'redux-api-middleware';

export function makeApiUrl(uri) {
    return `${config.apiUrl}/${uri}`
}

export function createAction(actionType, payload) {
    if (typeof payload === 'undefined' || payload === null || arguments.length === 1) {
        return () => ({
            type: actionType
        })
    }
    if (typeof payload === 'string') {
        return (value) => ({
            type: actionType,
            payload: {[payload]: value}
        })
    }
    if (typeof payload === 'object') {
        return (value) => ({
            type: actionType,
            payload: value
        })
    }
    if (typeof payload === 'function') {
        return function (...value) {
            return {
                type: actionType,
                payload: payload(...value)
            }
        }
    }
    throw new Error('Invalid call to createAction, payload needs to be string, object or function')
}


export function createSecApiAction(name, uri, method, body) {
    if (body === undefined && typeof uri === 'string') {
        return function () {
            return {
                [CALL_API]: {
                    types: [`${name}_REQUEST`, `${name}_SUCCESS`, `${name}_FAILURE`],
                    endpoint: makeApiUrl(uri),
                    headers: {'Access-Control-Allow-Origin': '*',
                        'x-auth-token': cookie.load('token'),
                        'Accept': 'application/json'},
                    method: method
                }
            }
        }
    } else if (typeof body === 'function' && typeof uri === 'string') {
        return function () {
            return {
                [CALL_API]: {
                    types: [`${name}_REQUEST`, `${name}_SUCCESS`, `${name}_FAILURE`],
                    endpoint: makeApiUrl(uri),
                    method: method,
                    headers: {'Access-Control-Allow-Origin': '*',
                        'x-auth-token': cookie.load('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'},
                    body: body(...arguments)
                }
            }
        }
    } else {
        let stringified = JSON.stringify(body)
        return function () {
            return {
                [CALL_API]: {
                    types: [`${name}_REQUEST`, `${name}_SUCCESS`, `${name}_FAILURE`],
                    endpoint: makeApiUrl(uri),
                    method: method,
                    headers: {'Access-Control-Allow-Origin': '*',
                        'x-auth-token': cookie.load('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'},
                    body: stringified
                }
            }
        }
    }
}

export function createApiAction(name, uri, method, body) {
    if (body === undefined && typeof uri === 'string') {
        return function () {
            return {
                [CALL_API]: {
                    types: [`${name}_REQUEST`, `${name}_SUCCESS`, `${name}_FAILURE`],
                    endpoint: makeApiUrl(uri),
                    method: method,
                    headers: {'Access-Control-Allow-Origin': '*'}
                }
            }
        }
    } else if (body === undefined && typeof uri === 'function') {
        return function () {
            return {
                [CALL_API]: {
                    types: [`${name}_REQUEST`, `${name}_SUCCESS`, `${name}_FAILURE`],
                    endpoint: makeApiUrl(uri(...arguments)),
                    method: method,
                    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    body: '{}'
                }
            }
        }
    } else if (typeof body === 'function' && typeof uri === 'string') {
        return function () {
            return {
                [CALL_API]: {
                    types: [`${name}_REQUEST`, `${name}_SUCCESS`, `${name}_FAILURE`],
                    endpoint: makeApiUrl(uri),
                    method: method,
                    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    body: body(...arguments)
                }
            }
        }
    } else {
        let stringified = JSON.stringify(body)
        return function () {
            return {
                [CALL_API]: {
                    types: [`${name}_REQUEST`, `${name}_SUCCESS`, `${name}_FAILURE`],
                    endpoint: makeApiUrl(uri),
                    method: method,
                    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                    body: stringified
                }
            }
        }
    }
}
