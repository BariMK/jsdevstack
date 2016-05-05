import React, {PropTypes} from 'react'
import immutable from 'immutable'
import {PureRenderComponent} from '../../../lib/components/base'
import BasePopUpPanel from '../../../lib/components/basepopup'
import BaseInput from '../../../lib/components/baseinput'
import BaseSubmitButton from '../../../lib/components/basesubmit'


export default class CheckListPanel extends PureRenderComponent {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		checkLists: PropTypes.object.isRequired
	}

	render() {
		const {actions, checkLists:{lists}} = this.props;
  		return (
				<BasePopUpPanel
						idField="check-form-panel"
						children={<CheckListContainer {...{actions, lists}} />}
						title="Check lists" />
		)
	}
}



class CheckListContainer extends PureRenderComponent {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		lists: PropTypes.object.isRequired
	}

	render() {
		const {actions, lists} = this.props
		return (<div>
			<h2><a href="#" onClick={() => actions.addList()}>+</a></h2>
			{lists.map( list =>
					<CheckList key={list.id} {...{actions, list}} />
			)}
		</div>)
	}
}


/**
 * Whole checklist with header and items
 */
class CheckList extends PureRenderComponent {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		list: PropTypes.object.isRequired
	}

	render() {

		const {actions,list} = this.props
		const allCnt = list.items.size

		const completedCnt = list.items.filter(i => i.checked).size


		let items = []
		for (var i = 0; i < allCnt; i++) {
			items.push(<CheckListItemContainer key={i} item={list.items.get(i)} listId={list.id} itemIdx={i} actions={actions} />)
		}

		const listNameCmp = list.edited
				? <EditableListName name={list.name} listId={list.id} actions={actions} />
				: <StaticListName name={list.name} listId={list.id} actions={actions} />

		return (
				<div className="container-fluid">
					{listNameCmp} ({completedCnt}/{allCnt})&nbsp;
					<a href="#" onClick={() => {
					if (confirm(`Remove list ${list.name}?`)) {
						actions.deleteList(list.id)
					}
				}}>delete</a>
					<ul className="list-unstyled">
						{items}
					</ul>
					{list.edited ? <div /> : <BaseSubmitButton className="btn btn-primary pull-right" value="Add" onClick={() => actions.addItem(list.id)} />}
				</div>
		)
	}
}


/**
 * Chck list name in plain text
 */
class StaticListName extends PureRenderComponent {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		name: PropTypes.string.isRequired,
		listId: PropTypes.string.isRequired
	}

	render() {
		const {actions, name, listId} = this.props
		return (
				<span onClick={() => actions.startEditingListName(listId)}>{name}</span>
		)
	}
}



/**
 * Check list name in input for editing
 */
class EditableListName extends PureRenderComponent {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		name: PropTypes.string.isRequired,
		listId: PropTypes.string.isRequired
	}

	render() {
		const {actions, name, listId} = this.props
		return (
				<BaseInput
						autoFocus={true}
						type="text"
						name="name"
						value={name}
						onChange={(value) => actions.updateListName(listId, value)}
						onEnter={() => name.trim() ? actions.saveListName(listId) : {}}
						onEsc={() => {actions.rollbackListName(listId)}}/>
		)
	}
}


/**
 * Single check list item container
 */
class CheckListItemContainer extends PureRenderComponent {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		listId: React.PropTypes.string.isRequired,
		item: React.PropTypes.object.isRequired,
		itemIdx: React.PropTypes.number.isRequired
	}

	render() {
		return (
				<li className="row">
					{this.props.item.edited
							? <EditableItem {...this.props} />
							: <CheckableItem {...this.props} />
					}
				</li>
		)
	}
}




/**
 * Check list item with plain text value and checkbox
 */
class CheckableItem extends PureRenderComponent {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		listId: React.PropTypes.string.isRequired,
		item: React.PropTypes.object.isRequired,
		itemIdx: React.PropTypes.number.isRequired
	}

	render() {
		const {actions, listId, item, itemIdx} = this.props
		const cls = item.checked ? `strikethrough` : ``
		return (
				<div className="form-group">
					<div className="col-sm-10">
						<div className="checkbox">
							<label>
								<input type="checkbox"
									   checked={item.checked}
									   onChange={() => {actions.toggleItem(listId, itemIdx)}}/>
								<span className={cls} onClick={() => actions.startEditing(listId, itemIdx)}>{item.name}</span>
							</label>
						</div>
					</div>
				</div>
		)
	}
}


/**
 * Check list item with value in input box for editation and delete link
 */
class EditableItem extends PureRenderComponent {

	static propTypes = {
		actions: PropTypes.object.isRequired,
		listId: React.PropTypes.string.isRequired,
		item: React.PropTypes.object.isRequired,
		itemIdx: React.PropTypes.number.isRequired
	}

	render() {
		const {actions, listId, item, itemIdx} = this.props
		return (
				<div>
					<BaseInput
							autoFocus={true}
							type="text"
							name="name"
							className="col-md-11"
							value={item.name}
							onChange={(value) => actions.updateItem(listId, itemIdx, value)}
							onEnter={() => item.name.trim() ? actions.saveItem(listId, itemIdx) : {}}
							onEsc={() => {actions.rollbackItem(listId, itemIdx)}}/>
					<span href="#" className="glyphicon glyphicon-remove col-md-1 pointer" onClick={() => actions.deleteItem(listId, itemIdx)}/>
				</div>)
	}
}