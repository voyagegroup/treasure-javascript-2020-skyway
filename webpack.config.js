const path = require("path")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  mode: "development",
  module: {
    rules: [{ test: /\.(js)$/, use: "babel-loader" }],
  },
  output: {
    filename: "bundle.[hash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new webpack.DefinePlugin({
      API_KEY: JSON.stringify(process.env.API_KEY),
    }),
  ],
}
