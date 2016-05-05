import messages from '../lib/intl/messages'
import {Record, Map} from 'immutable';

export default {
    intl: {
        availableLanguages: ['en'],
        messages: new Map(messages),
        selectedLanguage: 'en'
    }
}
