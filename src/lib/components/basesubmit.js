import React from 'react'
import {PureRenderComponent} from './base'

export default class BaseSubmitButton extends PureRenderComponent {
    static propTypes = {
        onClick: React.PropTypes.func.isRequired,
        value: React.PropTypes.string.isRequired,
        active: React.PropTypes.bool,
        className: React.PropTypes.string
    };

    render() {
        return (
            <button type="button"
                    className={this.props.className}
                    onClick={this.props.onClick}
                    disabled={(this.props.active !== undefined) && !this.props.active}>
                {this.props.value}
            </button>
        )
    }
}