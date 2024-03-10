const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    // filename: "./main.js",
    path: path.resolve(__dirname, "./dist"),
      filename: "js/[name].[hash].js",
      clean: true,
      publicPath: "/",
  },
  devServer: {
    static: { 
        directory: path.join(__dirname, "public"),
      },
    historyApiFallback: true,
    port: 9000,

  },

  module: {
    rules: [
      {
        test: /\.m?js$|jsx/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }, 

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  
  plugins: [
    new HtmlWebpackPlugin({template: path.join(__dirname, "public", "index.html"),
    inject: "body",})
  ]
};
