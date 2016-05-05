import React from 'react'

export default class Html extends React.Component {

    render() {
        const linkStyles = <link
        href={`/build/css/app.css?v=${this.props.version}`}
        rel="stylesheet"
            />

        // TODO: Add favicon.
        const linkFavicon = false && <link
        href={`/build/img/favicon.icon?v=${this.props.version}`}
        rel="shortcut icon"
            />

        return (
            <html lang="en">
            <head>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
            <title>{this.props.title}</title>
        {linkStyles}
        {linkFavicon}
    </head>
        <body dangerouslySetInnerHTML={{__html: this.props.bodyHtml}} />
    </html>
    )
    }
}

Html.propTypes = {
    bodyHtml: React.PropTypes.string.isRequired,
    isProduction: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    version: React.PropTypes.string.isRequired,
}
