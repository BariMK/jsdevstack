import React from 'react'
import {PureRenderComponent} from './base'
import { browserHistory } from 'react-router'


export default class BasePopUpPanel extends PureRenderComponent {

    static propTypes = {
        children: React.PropTypes.element.isRequired,
        headerChildren: React.PropTypes.element,
        footerChildren: React.PropTypes.element,
        idField: React.PropTypes.string.isRequired,
        classNames: React.PropTypes.string,
        closeHandler: React.PropTypes.func
    };

    render() {
        return (
            <div id={this.props.idField} className={'popup-panel ' + this.props.classNames}>
                <div className="popup-header">
                    {this.props.headerChildren}
                    <button
                        type="button"
                        className="btn btn-danger closeButton"
                        onClick={() => {if (this.props.closeHandler) {this.props.closeHandler()} browserHistory.push('/')}}>
                        &times;
                    </button>
                </div>
                <div className="popup-body">{this.props.children}</div>
                <div className="popup-footer">{this.props.footerChildren}</div>

            </div>
        )
    }
}

