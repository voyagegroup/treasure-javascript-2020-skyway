const merge = require("webpack-merge");
const common = require("./webpack.common.js");

const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  plugins: [new HardSourceWebpackPlugin()],
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./public",
    host: "0.0.0.0",
    port: 3000,
    inline: true,
    hot: true,
    historyApiFallback: true,
  },
});
