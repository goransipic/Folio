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
  {from: 'robots.txt', to: 'robots.txt'},
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
  entry: {
    index: './assets/js/index.js',
    contact: './assets/js/contact.js',
    admin: './assets/js/admin.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'assets/js/[name].js',
  },
  module: {
    rules: [
      // Babel support for .js files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          partialDirs: [path.resolve(__dirname, 'templates/partials')],
        },
      }
    ]
  },
  plugins: [
    ...languages.map(lang => new HtmlWebpackPlugin({
      filename: lang === 'hr' ? 'index.html' : `${lang}/index.html`,
      template: './templates/index.hbs',
      templateParameters: () => loadJson(lang),
      chunks: ['index'],
    })),
    ...languages.map(lang => new HtmlWebpackPlugin({
      filename: lang === 'hr' ? 'contact.html' : `${lang}/contact.html`,
      template: './templates/contact.hbs',
      templateParameters: () => loadJson(lang),
      chunks: ['contact'],
    })),
    ...languages.map(lang => new HtmlWebpackPlugin({
      filename: lang === 'hr' ? 'admin.html' : `${lang}/admin.html`,
      template: './templates/admin.hbs',
      templateParameters: () => loadJson(lang),
      chunks: ['admin'],
    })),
    // Copy localized static files
    new CopyPlugin({ patterns }),
  ],
};


