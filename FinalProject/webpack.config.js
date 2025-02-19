const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "src"),
    },
    port: 8000,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Uses your existing index.html as a template
    }),
  ],
  module: {
    rules: [
      // Add loaders here if needed for processing other file types
    ],
  },
};
