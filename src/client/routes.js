import React from 'react'
import App from './app/app'
import Error404 from './app/404'
import Welcome from './app/welcome'
import CheckListPanel from './components/checklist/views'
import {IndexRoute, Route} from 'react-router'

export default function createRoutes(getState) {

    return (
        <Route component={App} path="/">
        <IndexRoute component={Welcome} />
        <Route path='checklists' component={CheckListPanel} />
        <Route path="*" component={Error404} />
        </Route>
    )
}
