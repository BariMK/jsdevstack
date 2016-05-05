import {combineReducers} from 'redux';

import checkLists from './components/checklist/reducer';
import intl from '../lib/intl/reducer';

const appReducer = combineReducers({
    checkLists,
    intl
});

export default appReducer;