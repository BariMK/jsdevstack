import Promise from 'bluebird';
import {Map, List, fromJS} from 'immutable'
import * as staticValidators from './validators'


class ValidationWorker {

    /**
     * @param data - immutable Map of form data (with fields and errors message)
     */
    constructor(data) {
        this._data = (data instanceof Map) ? data : fromJS(data)
        this._errors = new Map()
        this._field = ''
        this.promise = Promise.resolve()
        this._isValid = () => this._errors.isEmpty()
    }

    /**
     * If not error is detected in data, callback of this method is fired.
     * Callbalck is fired after all promises are resolved
     */
    onSuccess(cb) {
        this.promise = this.promise.then(() => {
                if (this._isValid()) {
            cb()
        }
    })
        return this
    }

    /**
     * If any error is detected in data, callback of this method is fired with errors immutable map as parameter.
     * Callbalck is fired after all promises are resolved
     */
    onError(cb) {
        this.promise = this.promise.then(() => {
                if (!this._isValid()) {
            cb(this._errors)
        }
    })
        return this
    }

    /**
     * Similar as onSuccess/onError, but fires no matter whether error occured or not. If error occured,
     * errors are added as callback parameters
     * Callbalck is fired after all promises are resolved
     */
    onAny(cb) {
        cb(this._errors)
        this.promise = this.promise.then(() => {
                cb(this._errors)
            })
        return this
    }

    /**
     * Switches field for which validators will be added. Has to be called before any validator is added.
     */
    field(field) {
        this._field = field
        return this
    }

    /**
     * Adds validator and immediately fires falidation as a promise. If previous promises are not yet finished,
     * it will be added to queue.
     *
     * @param object or Array of validators
     */
    addValidator(validator) {
        const field = this._field
        // If field was not specified or not exist in data, continue
        if (this._data.get(field, null) !== null) {
            this.promise = this.promise.then(() => {

                    if (!validator.isValid()) {
                if (!this._errors.get(field)) {
                    this._errors = this._errors.set(field, new List())
                }

                this._errors = this._errors.set(field, this._errors.get(field).push(validator.msg()))
            }
        })
        }
        return this
    }

    /**************************************************************************
     * Shortcuts for `addValidator` method
     **************************************************************************/


    _val() {
        return this._data.get(this._field)
    }

    required() {
        return this.addValidator(new staticValidators.RequiredValidator(this._val()))
    }

    email() {
        return this.addValidator(new staticValidators.EmailValidator(this._val()))
    }

    min(len) {
        return this.addValidator(new staticValidators.MinValidator(this._val(), len))
    }

    max(len) {
        return this.addValidator(new staticValidators.MaxValidator(this._val(), len))
    }

    range(min, max) {
        return this.addValidator(new staticValidators.RangeValidator(this._val(), min, max))
    }
}

/**
 * Shortcut for `ValidationWorker` class. Usng this method is preferred
 * over direct usage of `ValidationWorker` class.
 *
 * @param singleFormField set to true if data to validate are taken from
 *        form input (e.g. when user types). Such data have format:
 *        {
 *            name: name, value: value,
 *        }
 *        and has to be transformed to format required by validator worker.
 *        this will be done automatically by setting this flag to true.
 */
export default function validate(data, singleFormField = false) {

    // To be able to validate field when typing, we need to convert:
    // {name: 'fieldName', value: 'fieldValue'} => {fieldName: fieldValue}
    if (singleFormField) {
        const obj = {}
        obj[data.name] = data.value
        data = obj
    }

    return new ValidationWorker(data, singleFormField)
}
