const path = require('path');

module.exports = {
	rootDir: process.cwd(),
	cacheDirectory: "/tmp/jest_cache",
	testPathDirs: [
		'src'
	],
	modulePathIgnorePatterns: [
		'/build/'
	],
	"moduleNameMapper": {
    	"^.*\\.scss$": path.join(__dirname, '../test', 'stubs', 'SCSSStub')
  	},
};


