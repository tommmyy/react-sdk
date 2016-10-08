const webpack = require('webpack');
const path = require('path');

const VERBOSE = process.argv.includes('--verbose');
const GLOBALS = {
	'process.env.NODE_ENV': '"development"',
	'process.env.BROWSER': true,
	__DEV__: true,
};

module.exports = {
	context: path.resolve(path.join(process.cwd(), 'src')),
	entry: [
		'react-hot-loader/patch',
		'webpack-hot-middleware/client',
		'./index',
	],
	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
	],
	output: {
		path: path.resolve(process.cwd(), './build/public/assets'),
		publicPath: '/assets/',
		sourcePrefix: '  ',
	},
	debug: true,
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: [path.resolve(process.cwd(), './src')],
				exclude: /node_modules/,
				loaders: ['babel'],
			}, {
				test: /\.scss$/,
				loaders: ['style', 'css', 'resolve-url?sourceMap', 'sass?sourceMap'],
			}, {
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				loaders: [require.resolve('url-loader')],
			}, {
				test: /\.(eot|ttf|wav|mp3)$/,
				loaders: [require.resolve('file-loader')],
			},
		],
	},
	resolve: {
		root: [
			path.resolve(process.cwd(), './src'),
			path.resolve(process.cwd(), './node_modules'),
		],
		modulesDirectories: ['node_modules'],
		extensions: ['', '.webpack.js', '.web.js', '.js', '.json'],
	},
	devtool: 'cheap-module-eval-source-map',
	stats: {
		colors: true,
		reasons: true,
		hash: VERBOSE,
		version: VERBOSE,
		timings: true,
		chunks: VERBOSE,
		chunkModules: VERBOSE,
		cached: VERBOSE,
		cachedAssets: VERBOSE,
	},
	sassLoader: {
		importer: require(path.resolve(__dirname, '../node_modules/compass-importer')),
		includePaths: [path.resolve(process.cwd(), './node_modules/')]
	},
};
