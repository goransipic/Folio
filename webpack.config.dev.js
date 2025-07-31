const {merge} = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const lang = require('./webpack.common-values.js');

class AddI18nDependenciesPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('AddI18nDependenciesPlugin', (compilation) => {
      const path = require('path');
      compilation.hooks.additionalAssets.tapAsync('AddI18nDependenciesPlugin', (callback) => {
        const jsonPaths = lang.languages.map(lang => path.resolve(__dirname, `./i18n/${lang}.json`));
        jsonPaths.forEach((file) => {
          compilation.fileDependencies.add(file);
        });
        callback();
      });
    });
  }
}

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    app: './assets/js/functions.js',
  },
  output: {
    filename: './js/app.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    watchFiles: ['./templates/**/*.hbs','./i18n/**/*.json'],
    open: {
      target: ['/hr/'],
      app: {
        name: 'google chrome'
      }
    },
    liveReload: true,
    hot: true,
  },
  plugins: [new AddI18nDependenciesPlugin()],
});
