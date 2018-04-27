const path = require("path");

/**
 * - Bundle the controller.js into umd which is used for unpkg
 */

const ROOT = __dirname;
const UMD = path.resolve(ROOT, "umd");

module.exports = {
  entry: {
    "webusb-dmx512-controller": "./controller.js"
  },
  output: {
    path: UMD,
    filename: "[name].js",
    libraryTarget: "umd"
  },
  mode: process.env.NODE_ENV || "development",
  devtool: "source-map",
  plugins: []
};
