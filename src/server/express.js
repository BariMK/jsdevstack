/*eslint-disable no-console */

import express from 'express'
import compression from 'compression'
import config from './config'
import render from './render'
import livereload from 'connect-livereload'

export default function() {

    const app = express()

    // Compress response as TGZ (save bandwidth)
    app.use(compression())

    if (!config.isProduction) {
        app.use(livereload({port: 35729}))
    }
    app.use('/build', express.static('build'))

    app.get('*', render)

    app.listen(config.port)
    console.log(`App started on port ${config.port}`)
}