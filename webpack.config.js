const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "./main.js"
  },
  devServer: {
    static: { 
        directory: 'dist', 
      },
    compress: true,
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
  }
};