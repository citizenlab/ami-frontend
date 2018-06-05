const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default
const webpack = require('webpack');
const glob = require("glob");
const fs = require("fs");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const basePlugins = [
	new HtmlWebpackPlugin({
		template: "./app/index.html",
		filename: "index.html",
		inject: false,
		chunks: ["app"],
	}),
	new webpack.ProvidePlugin({
		moment: "moment",
		"window.moment": "moment"
	}),
	new webpack.ProvidePlugin({
		_: "underscore",
		"window._": "_"
	}),
	new CopyWebpackPlugin([
		{ from: "./app/views", to: "./views/" },
		{ from: "./app/translations", to: "./translations/" },
		{ from: "./app/images", to: "./images/" },
		{ from: "./app/styles", to: "./styles/" },
		{ from: "./app/fonts", to: "./fonts/" }
	])
]

const prodPluginsBefore = [
	new webpack.DefinePlugin({
		__CONFIG__: fs.readFileSync("./config/prod.json", "utf8")
	})
]
const devPluginsBefore = [
	new webpack.DefinePlugin({
		__CONFIG__: fs.readFileSync("./config/dev.json", "utf8")
	})
]

const prodPluginsAfter = [
	new ImageminPlugin({
		test: /\.(jpe?g|png|gif|svg)$/i,
		disable: process.env.NODE_ENV !== 'production', // Disable during development
		pngquant: {
		quality: '95-100'
		}
	})
];

const devPluginsAfter = [];


const buildPlugins = function(mode){
	let PRODUCTION = false;
	if(mode === "production"){
		PRODUCTION = true;
	}
	const plugins = []
	.concat(PRODUCTION ? prodPluginsBefore : [])
	.concat(!PRODUCTION ? devPluginsBefore : [])
	.concat(basePlugins)
	.concat(PRODUCTION ? prodPluginsAfter : [])
	.concat(!PRODUCTION ? devPluginsAfter : []);

	return plugins;
};

module.exports = (env, argv) => ({
	entry: {
		"app": [
			"./app/scripts/app.js",
		]
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "js/[name].js",
		// publicPath: "/",
		chunkFilename: "js/[name].js",
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}
		]
	},
	plugins: buildPlugins(argv.mode),
	// optimization: {
	// 	splitChunks: {
	// 		chunks: 'initial'
	// 	}
	// }
});