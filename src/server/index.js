
if (!global.Intl) {
	global.Intl = require('intl')
}

// Turn ES6 on
require('babel/register')({optional: ['es7']})

// Start app
require('./main')
