const slsw = require("serverless-webpack");
const path = require("path");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  mode: isLocal ? "development" : "production",
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "node16",
      }),
    ],
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".mjs", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "app/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js|\.ts$/,
        exclude: /node_modules/,
        loader: "esbuild-loader",
        options: {
          loader: "ts",
          target: "node16",
        },
      },
    ],
  },
};
