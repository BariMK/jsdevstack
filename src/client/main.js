import ReactDOM from 'react-dom';
import React from 'react'
import {Router, browserHistory} from 'react-router'
import createRoutes from './routes'
import configureStore from '../server/configureStore'
import {Provider} from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';


const app = document.getElementById('app');
const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState);
const routes = createRoutes(() => store.getState());

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            {routes}
        </Router>
    </Provider>,
    app
);