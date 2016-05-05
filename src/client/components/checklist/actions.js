import {Map, fromJS} from 'immutable'
import * as api from '../../../lib/api'
import validate from '../../../lib/validations/framework'

/*=============================================================================
 * Check List management
/*===========================================================================*/

export const ADD_CHECKLIST = 'ADD_CHECKLIST'
export const DELETE_CHECKLIST = 'DELETE_CHECKLIST'
export const ADD_CHECKLIST_ITEM = 'ADD_CHECKLIST_ITEM'

export const UPDATE_CHECKLIST_NAME = 'UPDATE_CHECKLIST_NAME'
export const UPDATE_CHECKLISTITEM_NAME = 'UPDATE_CHECKLISTITEM_NAME'

export const CHECKLISTITEM_TOGGLE = 'CHECKLISTITEM_TOGGLE'
export const CHECKLISTITEM_DELETE = 'CHECKLISTITEM_DELETE'


export const START_UPDATE_CHECKLIST_NAME = 'START_UPDATE_CHECKLIST_NAME'
export const FINISH_UPDATE_CHECKLIST_NAME = 'FINISH_UPDATE_CHECKLIST_NAME'
export const START_UPDATE_CHECKLISTITEM_NAME = 'START_UPDATE_CHECKLISTITEM_NAME'
export const FINISH_UPDATE_CHECKLISTITEM_NAME = 'FINISH_UPDATE_CHECKLISTITEM_NAME'



/**
 * Add new check list
 */
export function addList() {
	return {
		type: ADD_CHECKLIST,
		payload: {}
	}
}

/**
 * Reacts on real time update of check list name in text input box
 *
 * @param listId - ID of check list whose name is being edited
 * @target - name and value of text input that holds check list name
 */
export function updateListName(listId, {target: {name, value}}) {
	return {
		type: UPDATE_CHECKLIST_NAME,
		payload: {
			listId: listId,
			name: value,
		}
	}
}

/**
 * Show text in input box instead just of text, hide other input boxes of other lists
 *
 * @param listId - ID of check list
 */
export function startEditingListName(listId) {
	return {
		type: START_UPDATE_CHECKLIST_NAME,
		payload: {
			listId: listId
		}
	}
}

/**
 * Hide input box. If `rollback = true` return old value of name else save name
 *
 * @param listId - ID of check list
 * @param rollback - bool value whether to discard (false) or keep changes (true)
 */
export function finishEditingListName(listId, rollback) {
	return {
		type: FINISH_UPDATE_CHECKLIST_NAME,
		payload: {
			listId: listId,
			rollback: rollback
		}
	}
}

/**
 * Persist list name and hide input
 *
 * @param listId - ID of check list
 */
export function saveListName(listId) {
	return finishEditingListName(listId, false)
}

/**
 * Return changes back as it was before editing
 *
 * @param listId - ID of check list
 */
export function rollbackListName(listId) {
	return finishEditingListName(listId, true)
}

/**
 * Delete whole check list
 *
 * @param listId - ID of check list
 */
export function deleteList(listId) {
	return {
		type: DELETE_CHECKLIST,
		payload: {
			listId: listId
		}
	}
}


// /*=============================================================================
//  * Check List Items management
// /*===========================================================================*/


/*
 * Add new item to check list
 *
 * @param listId - ID of check list
 */
export function addItem(listId) {
	return {
		type: ADD_CHECKLIST_ITEM,
		payload: {
			listId: listId
		}
	}
}

/**
 * Reacts on real time update of check list item value in text input box
 *
 * @param listId - ID of check list whose item is being edited
 * @param itemIdx - index of item in check list that is being edited. Undefined if new item is added
 * @target - name and value of text input that holds check list item value
 */
export function updateItem(listId, itemIdx, {target: {name, value}}) {
	return {
		type: UPDATE_CHECKLISTITEM_NAME,
		payload: {
			listId: listId,
			itemIdx: itemIdx,
			value: value,
		}
	}
}

/**
 * Show text in input box instead just of text, hide other input boxes of same list
 */
export function startEditing(listId, itemIdx) {
	return {
		type: START_UPDATE_CHECKLISTITEM_NAME,
		payload: {
			listId: listId,
			itemIdx: itemIdx,
		}
	}
}

/**
 * Hide input box. If `rollback = true` return old value of item else save value
 */
export function finishEditing(listId, itemIdx, rollback) {
	return {
		type: FINISH_UPDATE_CHECKLISTITEM_NAME,
		payload: {
			listId: listId,
			itemIdx: itemIdx,
			rollback: rollback,
		}
	}
}

/**
 * Persist item value and hide input
 */
export function saveItem(listId, itemIdx) {
	return finishEditing(listId, itemIdx, false)
}

/**
 * Return changes back as it was before editing
 */
export function rollbackItem(listId, itemIdx) {
	return finishEditing(listId, itemIdx, true)
}


/**
 * Check/uncheck item
 *
 * @param listId - ID of check list
 * @param itemIdx - index of item in check list to toggle
 */
export function toggleItem(listId, itemIdx) {
	return {
		type: CHECKLISTITEM_TOGGLE,
		payload: {
			listId: listId,
			itemIdx: itemIdx,
		}
	}
}

/**
 * Remove item from list
 */
export function deleteItem(listId, itemIdx) {
	return {
		type: CHECKLISTITEM_DELETE,
		payload: {
			listId: listId,
			itemIdx: itemIdx,
		}
	}
}
