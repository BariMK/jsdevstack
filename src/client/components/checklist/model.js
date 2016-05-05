import {Record, List} from 'immutable';


export const CheckListItem = Record({
	name: '',
  oldName: '',
	checked: false,
	isNew: false,
	edited: false
})


export const CheckList = Record({
  id: '',
  name: '',
  oldName: '', // Name is stored here before editation for rollback purpose
  edited: false, // Indicates that check list name is being edited
  isNew: false, // Indicates that check list is new in list
  items: List()
});

