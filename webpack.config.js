const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const glob = require("glob");

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
	new webpack.ProvidePlugin({
		pdfMake: "pdfmake-browserified",
		"window.pdfMake": "pdfMake"
	}),
	new CopyWebpackPlugin([
		{ from: "./app/views", to: "./views/" },
		{ from: "./app/translations", to: "./translations/" },
		{ from: "./app/images", to: "./images/" },
		{ from: "./app/styles", to: "./styles/" },
		{ from: "./app/fonts", to: "./fonts/" }
	]),
]
console.log(path.resolve(__dirname + '/app/scripts/modules/config/localConfig.json'));
const plugins = basePlugins;

module.exports = {
	entry: {
		"app": [
			"./app/scripts/app.js",
		]
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "js/[name].js",
		// publicPath: "/",
		chunkFilename: "[id].js",
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		},
		{
			// Let's take our config file by absolute url 
			test: path.resolve(__dirname + 'app/scripts/modules/config/localConfig.json'),
			loader: 'ng-constants-json-loader',
			query: {
			  // default 
			  moduleName: 'envOptions',
			  // Should it be a standalone module: 
			  //   angular.module('name', []) 
			  // or not: 
			  //   angular.module('name') 
			  standalone: true
			}
		  }
		]
	},
	plugins: plugins
};