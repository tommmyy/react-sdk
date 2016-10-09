const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function test(...args) {
	return new Promise((resolve, reject) => {
		const jest = /^win/.test(process.platform) ? 'jest.cmd' : 'jest';
		const options = { stdio: ['ignore', 'inherit', 'inherit'] };
		spawn(jest, [...args], options).on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error('Failed to test.'));
			}
		});
	});
}


module.exports = () => Promise.resolve()
	.then(() => test(
			'--config',
			 JSON.stringify(require('./jest.config')),
			...(process.env.WATCH_TESTS ? ['--watchAll'] : [])
		)
	);
