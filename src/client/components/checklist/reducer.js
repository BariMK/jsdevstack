import {Map, List, fromJS, Record} from 'immutable'
import {CheckList, CheckListItem} from './model'
import * as actions from './actions'



const InitialListState = Record({
  lists: List()
});
const initialListState = new InitialListState;


const reviveList = ({lists}) => initialListState.merge({
  lists: lists.map(list => new CheckList(list))
});



export default function checkListReducer(state = initialListState, action) {
  if (!(state instanceof InitialListState)) return reviveList(state);

  switch (action.type) {
  	case actions.ADD_CHECKLIST: {
  		// There already is new element added - do not repeat
		if (state.getIn(['lists', -1, 'isNew'])) {
			return state
		}

		// Add new element to the end of list and make editable
		return state.update('lists', lists =>  lists.push(new CheckList({isNew: true, edited: true})))
  	}


  	case actions.UPDATE_CHECKLIST_NAME: {
  		const {listId, name} = action.payload
  		return updateList(state, listId, {name: name})
  	}


  	case actions.START_UPDATE_CHECKLIST_NAME: {
  		const {listId} = action.payload
			// Hide all list checkboxes from previos edits
			const updated = state.update('lists', lists => lists.map(l => l.merge({edited: false})))
			// Find old name of list
			const oldName = updated.get('lists').find(l => l.get('id') === listId).get('name')

			return updateList(updated, listId, {edited: true, 'oldName': oldName})
  	}


  	case actions.FINISH_UPDATE_CHECKLIST_NAME: {
  		const {listId, rollback} = action.payload
		let updateWith = {edited: false, isNew: false}
		const listIdx = getListIdx(state, listId)
		const list = state.getIn(['lists', listIdx])

		// Rollback data - if new item => remove item, if existing item => set name back as it was
		if (rollback) {
			// New item => remove
			if (list.get('isNew')) {
				return deleteList(state, listId)
			}

			// Existing item => rollback name value
			updateWith['name'] = list.get('oldName')
		}

		return updateList(state, listId, updateWith)
  	}


  	case actions.DELETE_CHECKLIST: {
		return deleteList(state, action.payload.listId)
	}


	/**
	 * New item is added with flag `isNew = true` and `edited = true` - if such item exists at the end of list, do not add again
	 */
	case actions.ADD_CHECKLIST_ITEM: {
		const {listId} = action.payload
		const listIdx = getListIdx(state, listId)

		if (listIdx === -1) {
			console.error(`List with ID = ${listId} not found.`)
		}

		// There already is new element added - do not repeat
		if (state.getIn(['lists', listIdx, 'items', -1, 'isNew'])) {
			return state
		}
		// Add new element to the end of list and make editable
		return addNewItem(state, listId)
	}


	case actions.UPDATE_CHECKLISTITEM_NAME: {
		const {listId, itemIdx, value} = action.payload

		return updateItem(state, listId, itemIdx, {name: value})
	}


	/**
	 * Item is edit ready when it's flag `edited = true`. Attribute `oldName` is set to value of current item name in case of rollback of editation
	 */
	case actions.START_UPDATE_CHECKLISTITEM_NAME: {
		const {listId, itemIdx} = action.payload

		const allHidden = updateAllItems(state, listId, {edited: false})
		const item = getItem(allHidden, listId, itemIdx)

		return updateItem(allHidden, listId, itemIdx, {edited: true, oldName: item.get('name')})
	}


	/**
	 * Hide input box by setting `edited = false`
	 */
	case actions.FINISH_UPDATE_CHECKLISTITEM_NAME: {
		const {listId, itemIdx, rollback} = action.payload

		let updateWith = {edited: false, isNew: false}

		const item = getItem(state, listId, itemIdx)

		// Rollback data - if new item => remove item, if existing item => set name back as it was
		if (rollback) {
			// New item => remove
			if (item.get('isNew')) {
				return deleteItem(state, listId, itemIdx)
			}

			// Existing item => rollback name value
			updateWith['name'] = getItem(state, listId, itemIdx).get('oldName')
		}

		const updated = updateItem(state, listId, itemIdx, updateWith)
		if (item.get('isNew')) {
			return addNewItem(updated, listId)
		}

		return updated
	}


	/**
	 * Toggles `checked` flag of item
	 */
	case actions.CHECKLISTITEM_TOGGLE: {
		const {listId, itemIdx} = action.payload
		const item = getItem(state, listId, itemIdx)
		return updateItem(state, listId, itemIdx, item.set('checked', !item.get('checked')))
	}


	/**
	 * Remove item from list
	 */
	case actions.CHECKLISTITEM_DELETE: {
		const {listId, itemIdx} = action.payload
		return deleteItem(state, listId, itemIdx)
	}

  }

  return state;
}



/**
 * Removes list from structure with given `listId`
 */
function deleteList(structure, listId) {
	return structure.update('lists', lists => lists.remove(getListIdx(structure, listId)))
}

/**
 * Merges list identified by `listID` with `obj`
 */
function updateList(structure, listId, obj) {
	const listIdx = getListIdx(structure, listId)
	// return structure.set(listIdx, structure.get(listIdx).merge(obj))
	return structure.updateIn(['lists', listIdx], l => l.merge(obj))
}

/**
 * Gets index of list with given ID
 *
 * @param structure - immutable structure of check lists
 * @param listId - ID of list
 *
 * @return list index in structure or -1
 */
function getListIdx(structure, listId) {
	return structure.get('lists').findIndex(t => t.get('id') === listId)
}

/**
 * Adds new item with required flags at the end of list identified by `listId`
 */
function addNewItem(structure, listId) {
	const listIdx = getListIdx(structure, listId)
	return structure.updateIn(['lists', listIdx, 'items'], items => items.push(new CheckListItem({isNew: true, edited: true})))
}

/**
 * Gets item on index from list
 *
 * @param structure - immutable structure of check lists
 * @param listId - ID of list
 * @param itemIdx - index of item in check list
 *
 * @return item or notSetValue
 */
function getItem(structure, listId, itemIdx) {
	return structure.getIn(['lists', getListIdx(structure, listId), 'items', itemIdx])
}

/**
 * Removes item from check list
 *
 * @param structure - immutable structure of check lists
 * @param listId - ID of list
 * @param itemIdx - index of item in check list
 *
 * @return whole structure with new check lists without specified index
 */
function deleteItem(structure, listId, itemIdx) {
	const path = ['lists', getListIdx(structure, listId), 'items']
	return structure.updateIn(path, items => items.remove(itemIdx))
}


/**
 * Updates item in check lists immutable structure.
 *
 * @param structure - immutable structure of check lists
 * @param listId - ID of list
 * @param itemIdx - index of item in check list
 * @param obj - object (plain JS or immutbale) to merge item with
 *
 * @return whole structure with updated object
 */
function updateItem(structure, listId, itemIdx, obj) {
	const path = ['lists', getListIdx(structure, listId), 'items', itemIdx]
	return structure.updateIn(path, item => item.merge(obj))
}

/**
 * Make same update to all items in list.
 *
 * @param structure - immutable structure of check lists
 * @param listId - ID of list
 * @param obj - object (plain JS or immutbale) to merge items with
 *
 * @return whole structure with updated items in one list
 */
function updateAllItems(structure, listId, obj) {
	const path = ['lists', getListIdx(structure, listId), 'items']
	return structure.updateIn(path, items => items.map(i => i.merge(obj)))
}
