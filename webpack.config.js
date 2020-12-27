var path = require("path");

module.exports = {
  mode: "production",
  entry: "./index.jsx",
  output: {
    path: path.resolve("lib"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: "babel-loader",
      },
    ],
  },
};
