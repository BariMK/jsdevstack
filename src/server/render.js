import DocumentTitle from 'react-document-title'
import Html from './html'
import Promise from 'bluebird'
import React from 'react'
import ReactDOMServer from 'react-dom/server';
import {RouterContext, match} from 'react-router';
import config from './config'
import useragent from 'useragent';
import initState from './initstate'
import createLocation from 'history/lib/createLocation';
import createRoutes from '../client/routes'
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import createStore from './createStore';

export default function render(req, res, next) {
    createStore(req)
        .then(store => renderPage(store, req, res, next))
    .catch(next);
}

function renderPage(store, req, res, next) {
    const routes = createRoutes(() => store.getState());
    const location = createLocation(req.url);

    match({routes, location}, (error, redirectLocation, renderProps) => {

        if (redirectLocation) {
        res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        return;
    }

    if (error) {
        next(error);
        return;
    }

    if (renderProps == null) {
        res.status(404).end();
        return;
    }

    const ua = useragent.is(req.headers['user-agent']);
    const appHtml = getAppHtml(store, renderProps);
    const clientState = store.getState();
    const html = getPageHtml(appHtml, clientState, req.hostname, ua);

    res.send(html);
    });
}

function getAppHtml(store, renderProps) {

    const str = ReactDOMServer.renderToString(
        <Provider store={store}>
            <RouterContext {...renderProps} />
        </Provider>
    )
    return str;
}

function getPageHtml(appHtml, clientState, hostname, ua) {
    let scriptHtml = '';

    const needIntlPolyfill = ua.safari || (ua.ie && ua.version < '11');
    if (needIntlPolyfill) {
        scriptHtml += `
    <script src="/node_modules/intl/dist/Intl.min.js"></script>
            <script src="/node_modules/intl/locale-data/jsonp/en-US.js"></script>`;
    }

    const appScriptSrc = config.isProduction
        ? '/build/app.js?v=' + config.version
        : '//localhost:3000/build/app.js'
    scriptHtml += `
    <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(clientState)};
    </script>
        <script src="${appScriptSrc}"></script>
            <script>
            function initImagesDefer() {
                var imgDefer = document.getElementsByTagName('img');
                for (var i=0;i<imgDefer.length;i++) {
                    if(imgDefer[i].getAttribute('data-src')) {
                        imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));
                    } } }
        window.onload = initImagesDefer;
    </script>
    `;

    const title = DocumentTitle.rewind();

    return '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
        <Html
            bodyHtml={`<div id="app">${appHtml}</div>` + scriptHtml}
            isProduction={config.isProduction}
            title={title}
            version={config.version}
        />
    );
}