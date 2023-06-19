const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, ".", "src");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBundleAnalyzer =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  entry: {
    popup: path.join(srcDir, "pages/popup/index.tsx"),
    // options: path.join(srcDir, 'options.tsx'),
    background: path.join(srcDir, "pages/background/index.ts"),
    content: path.join(srcDir, "pages/content/index.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "src/pages/[name]/index.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new WebpackBundleAnalyzer(),
    new CleanWebpackPlugin({
      verbose: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "./dist"),
        },
        {
          from: path.resolve(__dirname, "src/**/*.html"),
          // to: path.resolve(__dirname, './dist/src/**')
        },
      ],
      options: {},
    }),
  ],
};
