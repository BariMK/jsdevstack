import React from 'react'
import immutable from 'immutable'
import {PureRenderComponent} from './base'

const ENTER_KEY_CODE = 13
const ESC_KEY_CODE = 27

export default class BaseInput extends PureRenderComponent {

	render() {

		const {children, label, idField, className, errors} = this.props;

		const inputField = children ? this.createInputGroup(children) : this.createInput();

		return (
			<div className={'form-group ' + className}>
				{label ? <label htmlFor = {idField}>
					{label}
				</label> : null}
				{inputField}
				{errors && <span>{errors}</span>}
			</div>
		)
	}

	createInputGroup(children) {
		return <div className="input-group">
			{children}
			{this.createInput()}
		</div>
	}

	createInput() {
		return <input
				id = {this.props.idField}
				autoFocus = {this.props.autoFocus || false}
				className = "form-control"
				name = {this.props.name}
				type = {this.props.type}
				onKeyDown = {(event) => this.onKeyDown(event)}
				onEsc = {(event) => this.onKeyDown(event)}
				onChange = {this.props.onChange}
				value = {this.props.value}
				placeholder = {this.props.placeholder}
		/>
	}

	/**
	 * @param {object} event - save data if valid
	 */
	onKeyDown(event) {
		if (event.keyCode === ENTER_KEY_CODE) {
			if (this.props.onEnter != null) {
				this.props.onEnter(this.props.idField)
			}
		} else if (this.props.onKeyDown != null) {
			this.props.onKeyDown(event)
		}
		if (event.keyCode === ESC_KEY_CODE) {
			if (this.props.onEsc != null) {
				this.props.onEsc(this.props.idField)
			}
		}
	}
}

BaseInput.propTypes = {
	idField: React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	type: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func.isRequired,
	value: React.PropTypes.string,
	label: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	errors: React.PropTypes.instanceOf(immutable.Map),
	onEnter: React.PropTypes.func,
	onKeyDown:React.PropTypes.func,
	onEsc: React.PropTypes.func,
	autoFocus: React.PropTypes.bool,
}
