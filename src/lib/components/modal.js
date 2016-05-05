import React from 'react'
import {PureRenderComponent} from './base'
import { browserHistory } from 'react-router'
import ReactDOM from 'react-dom';

const ESC_KEY_CODE = 27

//Bootstrap style modal window
export default class Modal extends PureRenderComponent {

    static propTypes = {
        children: React.PropTypes.element.isRequired,
        headerChildren: React.PropTypes.element,
        footerChildren: React.PropTypes.element,
        idField: React.PropTypes.string,
        handleHideModal: React.PropTypes.func,
        isShowing: React.PropTypes.bool
    };

    componentDidMount() {
        const {isShowing} = this.props;
        document.body.classList.toggle('modal-open', isShowing)

        document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }
    componentWillReceiveProps(nextProps) {
        document.body.classList.toggle('modal-open', nextProps.isShowing)
    }
    componentWillUnmount() {
        document.body.classList.remove('modal-open')
        document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    }

    handleClickOutside(e) {
        const domNode = ReactDOM.findDOMNode(this.refs['modal']);
        if (!domNode || !domNode.contains(e.target)) {

            this.props.handleHideModal(e);
        }
    }

    onKeyDown(event) {
        if (event.keyCode === ESC_KEY_CODE) {
            this.props.handleHideModal();
        }
    }

    render() {
        const {children, footerChildren, headerChildren, handleHideModal, isShowing} = this.props;

        const display = isShowing ? 'block' : 'none';
        const fadeIn = isShowing ? 'in' : '';
        return (
            <div onKeyDown={this.onKeyDown.bind(this)}>
                <div id="mymodal" className={'modal fade ' + fadeIn} tabIndex="-1" role="dialog" style={{display: display}}>
                    <div className="modal-dialog" ref="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleHideModal} autofocus><span aria-hidden="true">&times;</span></button>
                                {headerChildren}
                            </div>
                            <div className="modal-body">
                                {children}
                            </div>
                            <div className="modal-footer">
                                {footerChildren}
                            </div>
                        </div>
                    </div>
                </div>
                {isShowing ? <div className={'modal-backdrop fade ' + fadeIn}></div> : null}
            </div>
        )
    }
}

