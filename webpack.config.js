const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = (env, argv) => {
  return {
    entry: {
      main: './src/index.tsx',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 3000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
        {
          // css
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        process: {
          env: {
            SKYWAY_API_KEY: JSON.stringify(process.env.SKYWAY_API_KEY),
            isProd: argv.mode === 'production',
          },
        },
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html',
      }),
    ],
  };
};
