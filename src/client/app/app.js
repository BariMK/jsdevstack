import DocumentTitle from 'react-document-title'
import React, {PropTypes} from 'react';
import {format} from '../../lib/intl/localize'
import {PureRenderComponent} from '../../lib/components/base'
import mapStateToProps from '../../lib/app/mapStateToProps'
import mapDispatchToProps from '../../lib/app/mapDispatchToProps'
import {connect} from 'react-redux';

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends PureRenderComponent {

    static propTypes = {
        children: PropTypes.object,
        checkLists: PropTypes.object,
        actions: PropTypes.object.isRequired,
        msg: PropTypes.object
    };

    render() {
        const {msg} = this.props
        return (
            <DocumentTitle title={format(msg.app.title)}>
                <div className="light">
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </DocumentTitle>
        )
    }
}
