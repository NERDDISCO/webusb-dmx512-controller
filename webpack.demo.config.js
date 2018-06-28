const path = require("path");

/**
 * - Bundle the content of "demo" into the "docs" folder
 * - Configuration for webpack-dev-server
 */

const ROOT = __dirname;
const DOCS = path.resolve(ROOT, "docs");

module.exports = {
  entry: {
    demo: "./demo/index.js"
  },
  output: {
    path: DOCS,
    filename: "[name].js",
    libraryTarget: "umd"
  },
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          // eslint options (if necessary)
        }
      },
    ],
  },
  devtool: "source-map",
  devServer: {
    contentBase: DOCS,
    compress: false,
    historyApiFallback: true,
    hot: true
  }
};
