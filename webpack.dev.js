const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    port: "3030",
    hot: true,
    open: false,
  },
  plugins: [new Dotenv()],
});
