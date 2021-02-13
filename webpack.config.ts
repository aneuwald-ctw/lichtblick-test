import path from "path";
import type { Configuration } from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import main from "./webpack.main.config";
import renderer from "./webpack.renderer.config";
import preload from "./webpack.preload.config";

interface WebpackConfiguration extends Configuration {
  devServer?: WebpackDevServerConfiguration;
}

// Use a single devServer configuration across all our multi-compiler configs
const devServerConfig: WebpackConfiguration = {
  // Use empty entry to avoid webpack default fallback to /src
  entry: {},

  // Output path must be specified here for HtmlWebpackPlugin within render config to work
  output: {
    publicPath: "",
    path: path.resolve(__dirname, ".webpack"),
  },

  devServer: {
    contentBase: path.join(__dirname, ".webpack"),
    writeToDisk: (filePath) => {
      // Electron needs to open the main thread source and preload source from disk
      // avoid writing the hot-update js and json files
      return /\.webpack\/main\/(?!.*hot-update)/.test(filePath);
    },
    hot: true,
  },
  plugins: [],
};

export default [devServerConfig, main, preload, renderer];
