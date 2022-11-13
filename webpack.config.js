const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: ['./public/css/styles.css', './src/app.ts']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    chunkFilename: 'chunks/[id].js',
    publicPath: '',
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 3001,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!.git/**',]
    }),
    new HtmlWebPackPlugin({
      title: 'ArcGIS API  for JavaScript',
      template: './public/index.html',
      filename: './index.html',
      chunksSortMode: 'none',
      inlineSource: '.(css)$'
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css",
      chunkFilename: "[id].css"
    })
  ]
};