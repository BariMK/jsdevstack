import request from 'superagent'
import {fromJS} from 'immutable'
import cookie from 'react-cookie'
import config from '../server/config'

function makeApiUrl(uri) {
    return `${config.apiUrl}${uri}`
}

export function get(uri, success, error) {
    request
        .get(makeApiUrl(uri))
        .set('Access-Control-Allow-Origin', '*')
        .set('x-auth-token', cookie.load('token'))
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (!err && res.status === 200) {
                success(fromJS(res.body))
            } else {
                console.log(`Failed to GET data from URL: ${uri}. Response: ${err}`)
                // error(err)
            }
        })
}


export function post(uri, data, success, error) {
    request
        .post(makeApiUrl(uri))
        .send(data)
        .set('Access-Control-Allow-Origin', '*')
        .set('x-auth-token', cookie.load('token'))
        .set('Accept', 'application/json')
        .end(function(err, res) {
            if (res.ok) {
                success(fromJS(res.body))
            } else {
                console.log(`Failed to POST data ${data} to URL: ${uri}. Response: ${res.text}`)
                error(err)
            }
        })
}

export function authenticate(uri, success, error) {
    request
        .post(makeApiUrl(uri))
        .set('Access-Control-Allow-Origin', '*')
        .end((err, res) => {
            if (!err && res.status === 200) {
                let token = res.body.token
                cookie.save('token', token, {path: '/'})
                success()
            } else {
                console.log(`Failed to GET data from URL: ${uri}. Response: ${err}`)
                // error(err)
            }
        })
}


export function logout() {
    cookie.remove('token')
}
