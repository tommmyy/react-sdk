const del = require('del');
const fs = require('./lib/fs');

module.exports = () => del(['build/*'])
	.then(() => fs.makeDir('build/public'));
