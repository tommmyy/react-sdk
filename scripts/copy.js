const ncp = require('ncp');
const promisify = require('es6-promisify');
const asyncNcp = promisify(ncp);

module.exports = () => asyncNcp('./src/public', './build/public');
