import IntlMessageFormat from 'intl-messageformat'
import IntlRelativeFormat from 'intl-relativeformat';

const cachedInstances = Object.create(null);
const intlRelativeFormat = new IntlRelativeFormat;

function getCachedFormatter(message) {
    if (message in cachedInstances) {
        return cachedInstances[message]
    }
    // TODO: Add locales support.
    cachedInstances[message] = new IntlMessageFormat(message)
    return cachedInstances[message]
}

export function format(msg, options = null) {
    if (!options) return msg;
    return getCachedFormatter(msg).format(options);
}

export function dateFormat(date, locales, options) {
    const dateTimeFormat = new Intl.DateTimeFormat(locales, options); // eslint-disable-line no-undef
    return dateTimeFormat.format(date);
}

export function relativeDateFormat(date, options) {
    return intlRelativeFormat.format(date, options);
}