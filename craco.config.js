const CracoAlias = require('craco-alias');
const CracoAntDesignPlugin = require('craco-antd');
const rawLoader = require('craco-raw-loader');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        babelPluginImportOptions: {
          libraryDirectory: 'es',
        },
      },
    },
    { plugin: rawLoader, options: { test: /\.xml$/ } },
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.alias.json',
      },
    },
  ],
};
