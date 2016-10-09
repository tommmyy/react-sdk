/* eslint-disable no-console, global-require */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn } = require('child_process');
const pkg = require('./package.json');

if (process.argv.includes('--test-sdk')) {
	process.env.TEST_SDK = true;
	const tempDir = path.resolve(__dirname, '../temp');
	if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
	process.chdir(tempDir);
}

if (process.argv.includes('--verbose')) {
	process.env.VERBOSE = true;
}

if (process.argv.includes('--watch')) {
	process.env.WATCH_TESTS = true;
	console.log('Watching');
}

function checkIfCurrentWorkingDirectoryIsEmpty() {
	return new Promise((resolve) => {
		console.log(`Scaffolding a new JavaScript application in ${process.cwd()}`);

		// Check if the current directory is empty
		const files = fs.readdirSync(process.cwd());
		if (files.filter(x => x !== '.git').length) {
			console.log('The current directory is not empty.');
			const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
			process.stdout.write('Are you sure you want to proceed? (y/N)? ');
			process.stdin.once('keypress', (key) => {
				console.log();
				rl.close();
				if (key === 'y' || key === 'Y') {
					resolve();
				} else {
					process.exit(0);
				}
			});
		} else {
			resolve();
		}
	});
}

function installReactTools() {
	// Don't install start-react-tools in test mode
	if (process.env.TEST_SDK === 'true') {
		return Promise.resolve();
	}

	// Create an empty package.json file if it doesn't exist
	const filename = path.resolve(process.cwd(), 'package.json');
	try {
		fs.accessSync(filename, fs.F_OK);
	} catch (e) {
		fs.writeFileSync(filename, '{}', 'utf8');
	}

	return new Promise((resolve, reject) => {
		const tagMatch = pkg.version.match(/-([a-z]+)\./); // '1.0.0-beta.2' => 'beta'
		const module = tagMatch ? `start-react-tools@${tagMatch[1]}` : 'start-react-tools';
		console.log(`Installing '${module}' from npm... This may take a couple minutes.`);

		const npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
		const options = { stdio: ['ignore', 'inherit', 'inherit'] };

		spawn(npm, ['install', module, '--save-dev'], options).on('close', (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Failed to install '${module}'.`));
			}
		});
	});
}

function run(command) {
	if (process.env.TEST_SDK === 'true') {
		// eslint-disable-next-line global-require
		return require(path.resolve(__dirname, '../run'))(command);
	}

	// eslint-disable-next-line global-require, import/no-unresolved
	return require(
		path.resolve(process.cwd(), './node_modules/start-react-tools/run')
	)(command);
}

const command = process.argv[2];

if (process.argv.includes('--production') || process.argv.includes('--prod')) {
	process.env.APP_ENV = 'production';
} else if (process.argv.includes('--staging')) {
	process.env.APP_ENV = 'staging';
} else if (process.argv.includes('--test')) {
	process.env.APP_ENV = 'test';
} else {
	process.env.APP_ENV = (command === 'run' || command === 'start') ? 'development' : 'production';
}

if (command === 'start' || command === 'run') {
	process.env.HMR = !process.argv.includes('--no-hmr');
	if (process.argv.includes('--release') || process.argv.includes('-r')) {
		process.env.NODE_ENV = 'production';
	} else {
		process.env.NODE_ENV = 'development';
	}
} else {
	process.env.HMR = process.argv.includes('--hmr');
	if (process.argv.includes('--debug') || process.argv.includes('-d')) {
		process.env.NODE_ENV = 'development';
	} else {
		process.env.NODE_ENV = 'production';
	}
}

if (command === 'test') {
	process.env.NODE_ENV = 'test';
	process.env.BABEL_JEST_STAGE = '0';
}

if (command === 'new') {
	Promise.resolve()
		.then(() => checkIfCurrentWorkingDirectoryIsEmpty())
		.then(() => installReactTools())
		.then(() => (process.env.TEST_SDK === 'true'
			// eslint-disable-next-line global-require
			? require(path.resolve(__dirname, '../scripts/new'))()
			// eslint-disable-next-line global-require, import/no-unresolved
			: require(path.resolve(process.cwd(), './node_modules/start-react-tools/scripts/new'))())
		)
		.catch(err => {
			console.error(process.argv.includes('--verbose') ? err.stack : `ERROR: ${err.message}`);
			process.exit(1);
		});
} else if (/^[a-z0-9:\-.]+$/.test(command || '')) {
	console.log(
		`Environment: ${process.env.APP_ENV}, ` +
		`build: ${process.env.NODE_ENV === 'development'
			? 'debug (non-optimized)' : 'release (optimized)'}, `
	);
	run(command === 'start' ? 'start' : command)
		.catch(err => {
			console.error(process.argv.includes('--verbose') ? err.stack : `ERROR: ${err.message}`);
			process.exit(1);
		});
} else {
	console.log();
	console.log('      ___                         ___           ___                                  ___           ___           ___           ___');
	console.log('     /  /\          ___          /  /\         /  /\          ___                   /  /\         /  /\         /  /\         /  /\          ___');
	console.log('    /  /::\        /__/\        /  /::\       /  /::\        /__/\                 /  /::\       /  /::\       /  /::\       /  /::\        /__/\\');
	console.log('   /__/:/\:\       \  \:\      /  /:/\:\     /  /:/\:\       \  \:\               /  /:/\:\     /  /:/\:\     /  /:/\:\     /  /:/\:\       \  \:\\');
	console.log('  _\_ \:\ \:\       \__\:\    /  /::\ \:\   /  /::\ \:\       \__\:\             /  /::\ \:\   /  /::\ \:\   /  /::\ \:\   /  /:/  \:\       \__\:\\');
	console.log(' /__/\ \:\ \:\      /  /::\  /__/:/\:\_\:\ /__/:/\:\_\:\      /  /::\           /__/:/\:\_\:\ /__/:/\:\ \:\ /__/:/\:\_\:\ /__/:/ \  \:\      /  /::\\');
	console.log(' \  \:\ \:\_\/     /  /:/\:\ \__\/  \:\/:/ \__\/~|::\/:/     /  /:/\:\          \__\/~|::\/:/ \  \:\ \:\_\/ \__\/  \:\/:/ \  \:\  \__\/     /  /:/\:\\');
	console.log('  \  \:\_\:\      /  /:/__\/      \__\::/     |  |:|::/     /  /:/__\/             |  |:|::/   \  \:\ \:\        \__\::/   \  \:\          /  /:/__\/');
	console.log('   \  \:\/:/     /__/:/           /  /:/      |  |:|\/     /__/:/                  |  |:|\/     \  \:\_\/        /  /:/     \  \:\        /__/:/');
	console.log('    \  \::/      \__\/           /__/:/       |__|:|~      \__\/                   |__|:|~       \  \:\         /__/:/       \  \:\       \__\/');
	console.log('     \__\/                       \__\/         \__\|                                \__\|         \__\/         \__\/         \__\/');
	console.log();
	console.log();
	console.log(' Usage: start-react <command> [options]');
	console.log();
	console.log(' Commands:');
	console.log();
	console.log('   new     - Scaffold a new JavaScript application project');
	console.log('   build   - Compile JavaScript application with Webpack');
	console.log('   start   - Compile and launch the app');
	console.log('   test    - Runs tests.');
	console.log();
	console.log(' Options:');
	console.log();
	console.log();
	console.log('   --release,        - Build configuration (optimized/minimized vs not-optimized)');
	console.log();
	console.log('   --verbose         - Print more information to the console');
	console.log('   --watch         	- Watching files for TDD development');
	console.log('   -v, --version     - Print React App SDK version');
	console.log();
}
