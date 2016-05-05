import React, {PropTypes} from 'react'
import {format} from '../../lib/intl/localize'
import {PureRenderComponent} from '../../lib/components/base'

export default class Welcome extends PureRenderComponent {
    static propTypes = {
        msg: PropTypes.object
    };

    render() {
        const {msg} = this.props
        return (
            <div className="hidden">{format(msg.user.panel.welcome.title)}</div>
        )
    }
}
