import React from 'react'
import DocumentTitle from 'react-document-title';
import {PureRenderComponent} from '../../lib/components/base'


export default class Error404 extends PureRenderComponent {

    render() {
        return (
            <DocumentTitle title={'Ooops, page was not found.'}>
                <div className="errorPanel">
                    <h1>{`This page isn't available`}</h1>
                    <p>{`The link may be broken, or the page may have been removed.`}</p>
                </div>
            </DocumentTitle>
        )
    }
}
