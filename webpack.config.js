const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const glob = require("glob");
const fs = require("fs");

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
	])
]

const buildPlugins = function(mode){
	let plugins = basePlugins;
	var config;

	switch(mode){
		case "production":
			config = fs.readFileSync("./config/prod.json", "utf8");
			break;
		default:
			config = fs.readFileSync("./config/dev.json", "utf8");
			break;
	}
	plugins.push(
		new webpack.DefinePlugin({
			__CONFIG__: config
		}),
	);
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
		chunkFilename: "[id].js",
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}
		]
	},
	plugins: buildPlugins(argv.mode)
});