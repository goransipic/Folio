const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const lang = require('./webpack.common-values.js');

const languages = lang.languages;

// Clear Node's require cache and re-load the JSON
const loadJson = (lang) => {
  const filePath = path.resolve(__dirname, 'i18n', `${lang}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Static assets to copy
const assets = [
  {from: 'assets/images', to: 'assets/images'},
  {from: 'assets/css', to: 'assets/css'},
  {from: 'assets/vendor', to: 'assets/vendor'},
  {from: 'assets/js', to: 'assets/js'},
  {from: 'icon.svg', to: 'icon.svg'},
  {from: 'favicon.ico', to: 'favicon.ico'},
  {from: 'robots.txt', to: 'robots.txt'},
  {from: 'icon.png', to: 'icon.png'},
  {from: '404.html', to: '404.html'},
  {from: 'site.webmanifest', to: 'site.webmanifest'},
];

// Copy to root for 'hr', and prefix with lang for others
const patterns = languages.flatMap(lang =>
  assets.map(({from, to}) => ({
    from,
    to: lang === 'hr' ? to : `${lang}/${to}`,
  }))
);

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      }
    ]
  },
  plugins: [
    ...languages.map(lang => new HtmlWebpackPlugin({
      filename: lang === 'hr' ? 'index.html' : `${lang}/index.html`,
      template: './templates/index.hbs',
      templateParameters: () => loadJson(lang),
    })),
    // Copy localized static files
    new CopyPlugin({ patterns }),
  ],
};


