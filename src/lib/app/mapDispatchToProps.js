import * as checkListActions from '../../client/components/checklist/actions';
import {Map} from 'immutable';
import {bindActionCreators} from 'redux';

const actions = [
    checkListActions
];

export default function mapDispatchToProps(dispatch) {
	const creators = Map()
        .merge(...actions)
        .filter(value => typeof value === 'function')
        .toObject();
	
    return {
        actions: bindActionCreators(creators, dispatch)
    };
}
