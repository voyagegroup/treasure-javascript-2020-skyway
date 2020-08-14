const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({ SKYWAY_API_KEY: JSON.stringify(process.env.SKYWAY_API_KEY) }),
    new Dotenv(),
  ],
});
