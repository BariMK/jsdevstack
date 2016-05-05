# Validations


Validation of data is done on frontend and also on backend.

## Frontend validations

Validation framework is located in `/src/lib/validations` folder and is based on [validator](https://github.com/chriso/validator.js) package. There are two files:

 ### `validators.js`
Contains validator implementations. There is base class abstract implementation `Validator` and some already implemented validators (e.g. `RequiredValidator`).

 ### `framework.js`
Starting point. This file will be included everywhere, where validations framework needs to be used. Validation is done by class `ValidationWorker` which takes data to validate as constructor argument. It has methods for adding validators for specific fields `addValidator()`, you can also use shortcuts for adding validator (e.g. `required()`). Validation worker class has also methods for retrieving results. See the example below. In following example `framework.js:validate` function is used, which is shortcut for `ValidationWorker` class.
```javascript
import validate from '/lib/validations/framework'

// data to be validated
const data = {
    email: '',
    password: '',
}

// Create validation object
validate(data)
    .field('email').required().email()
    .field('password').required().range(3,15)
    .onSuccess(() => {...})
    .onError(errors => {...})
```

 This file contains default method `validate` which returns new  based on [validator](https://github.com/chriso/validator.js) package.

 #### Realtime validation
 Sometimes it's necessary to validate data realtime (as user types). In this devstack data are often taken from `onChange` method and have different format. So they have to be transformed. See following example:

```javascript
// This (result of onChange())
{
    name: 'someName',
    value: 'some value',
}
// has to be converted to this (input of validation worker)
{
    someName: 'some value',
}
```

You don't have to worry with transformation as only thing you have to do is to set `singleFormField` flag of `framework.js:validate()` method to `true`. See example:
```javascript
function updateFormField({target: {name, value}}) {
    // here flag is set to true
    validate(data, true)
        .field('email').required().email()
        .field('password').required()
        .field('name').required().range(3, 32)
        .onAny(errors => {
            dispatch(updateFormField, {name, value, errors})
        })
```

Notice, that we added validators to more fields. That is ok, we don't want to check in code which field of form is being updated. So only the one being updated will be validated, other validators will be ignored.
