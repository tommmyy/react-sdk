const run = require('../run');

module.exports = (config) => Promise.resolve()
	.then(() => run('clean'))
	.then(() => run('copy'))
	.then(() => run('bundle'))

