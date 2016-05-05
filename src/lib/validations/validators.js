import React from 'react';
import validator from 'validator';

/**
 * Base class for all static validators. Every class has to implement
 * methods `isValid` and `msg`.
 */
export default class Validator {

    constructor(value) {
        this._value = value
        this._validator = validator
    }

    /**
     * Returns true in case that `this._value` is valid
     * according to validator, else returns false.
     */
    isValid() {
        throw new Error(`Method validate of Validator mast be implemented`)
    }

    /**
     * Returns validation message in case that validated data
     * are not valid.
     */
    msg() {
        throw new Error(`Method msg of Validator mast be implemented`)
    }
}


/******************************************************************************
 * Concrete validators implementations
 *****************************************************************************/


export class RequiredValidator extends Validator {

    isValid() {
        // !! makes boolean value out of object value
        return !!this._validator.toString(this._value).trim()
    }

    msg(prop) {
        return `Cannot be empty`
    }
}


export class EmailValidator extends Validator {

    isValid() {
        return this._validator.isEmail(this._value)
    }

    msg() {
        return `Correct email address is required.`
    }
}

export class MinValidator extends Validator {

    constructor(value, len) {
        super(value)
        this._len = len
    }

    isValid() {
        return this._validator.toString(this._value).trim().length >= this._len
    }

    msg() {
        return `Value should be longer than ${this._len} characters.`
    }
}

export class MaxValidator extends Validator {

    constructor(value, len) {
        super(value)
        this._len = len
    }

    isValid() {
        return this._validator.toString(this._value).trim().length < this._len
    }

    msg() {
        return `Maximal allowed length is ${this._len} characters.`
    }
}

export class RangeValidator extends Validator {

    constructor(value, min, max) {
        super(value)
        this._min = min
        this._max = max
    }

    isValid() {
        const l = this._validator.toString(this._value).trim().length
        return this._min <= l && l < this._max
    }

    msg() {
        return `Length should be between ${this._min} and ${this._max} characters.`
    }
}
