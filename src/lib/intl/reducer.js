import messages from './messages';
import {Record, Map} from 'immutable';

const InitialState = Record({
    availableLanguages: ['en'],
    messages: new Map(messages),
    selectedLanguage: 'en'
});
const initialState = new InitialState;

const revive = intl => initialState.merge({
    availableLanguages: intl.availableLanguages,
    messages: new Map(intl.messages),
    selectedLanguage: intl.selectedLanguage
});

export default function intlReducer(state = initialState) {
    if (!(state instanceof InitialState)) return revive(state);

    return state;
}