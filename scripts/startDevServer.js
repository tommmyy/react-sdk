const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const serverConfig = require('./server-dev.config');

module.exports = (config) => new Promise((resolve) => {
	const compiler = webpack(config.webpack);
	const handleCompilerComplete = () => {
		const bs = browserSync.create();
		bs.init({
			ui: false,
			port: serverConfig.port,
			server: {
				baseDir: serverConfig.output.path,
				middleware: [
					historyApiFallback(),
					webpackDevMiddleware(compiler, {
						publicPath: config.webpack.output.publicPath,
						stats: config.webpack.stats,
					}),
					webpackHotMiddleware(compiler),
				],
			},
			files: [
				'**/*.css',
			],
		}, resolve);
	};

	compiler.run(handleCompilerComplete);
});
