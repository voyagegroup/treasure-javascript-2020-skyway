const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config();

module.exports = function(env, argv) {
  return {
    entry: {
      main: "./src/app.tsx",
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: chunkData => {
        return chunkData.chunk.name === "main"
          ? "[name].js"
          : "[name]/[name].js";
      }
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      port: 8080
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        },
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        process: {
          env: {
            SKYWAY_API_KEY: JSON.stringify(process.env.SKYWAY_API_KEY),
            isProd: argv.mode === "production"
          }
        }
      }),
      new HtmlWebpackPlugin({
        chunks: ["main"],
        filename: "index.html",
        template: "src/html/index.html",
      }),
    ]
  };
};