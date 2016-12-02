const webpack = require('webpack');
const path = require('path');

const VERBOSE = process.argv.includes('--verbose');
const GLOBALS = {
	'process.env.NODE_ENV': '"production"',
	'process.env.BROWSER': true,
	__DEV__: false,
};

module.exports = {
	context: path.resolve(path.join(process.cwd(), 'src')),
	entry: [
		'./index',
	],
	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				screw_ie8: true,
				warnings: VERBOSE,
			},
				mangle: {
				screw_ie8: true,
			},
				output: {
				comments: false,
				screw_ie8: true,
			},
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
	],
	output: {
		path: path.resolve(process.cwd(), './build/public/assets'),
		publicPath: '/assets/',
		sourcePrefix: '  ',
	},
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
			path.resolve(process.cwd(), './web_modules'),
		],
		modulesDirectories: ['node_modules', 'web_modules'],
		extensions: ['', '.webpack.js', '.web.js', '.js', '.json'],
	},
	devtool: false,
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
		importer: require('compass-importer'),
		includePaths: [path.resolve(process.cwd(), './node_modules/')]
	},
};
