const CracoLessPlugin = require("craco-less");
const fs = require("fs");
const path = require("path");
const CracoEnvPlugin = require("craco-plugin-env");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#1677ff",
              "border-radius-base": "12px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: require("craco-babel-loader"),
      options: {
        includes: [resolveApp("../common")],
      },
    },
    {
      plugin: CracoEnvPlugin,
      options: {
        variables: {},
      },
    },
  ],
};
