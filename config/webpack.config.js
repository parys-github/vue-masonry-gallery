var path = require("path");
var webpack = require("webpack");
module.exports = {
  entry: path.resolve(__dirname, "./src/components/VueMasonryGallery.vue"),
  output: {
    path: path.resolve(__dirname, "./vendor/VueMasonryGallery/"),
    filename: "VueMasonryGallery.js",
    libraryTarget: "umd",
    library: "VueMasonryGallery",
    libraryExport: "default" // Do not set this item, then only access in test.default
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};
