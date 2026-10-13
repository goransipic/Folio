const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const lang = require('./webpack.common-values.js');

const languages = lang.languages;

// Changes on every build; appended to our own CSS and JS addresses so browsers do not keep an old copy
const BUILD_ID = Date.now().toString(36);

// Clear Node's require cache and re-load the JSON
const loadJson = (lang) => {
  const filePath = path.resolve(__dirname, 'i18n', `${lang}.json`);
  return {...JSON.parse(fs.readFileSync(filePath, 'utf-8')), buildId: BUILD_ID};
};

// Static assets to copy
const assets = [
  {from: 'assets/images', to: 'assets/images'},
  {from: 'assets/css', to: 'assets/css'},
  {from: 'assets/vendor', to: 'assets/vendor'},
  {from: 'assets/js', to: 'assets/js'},
  {from: 'robots.txt', to: 'robots.txt'},
  {from: 'favicon.ico', to: 'favicon.ico'},
  {from: 'sitemap.xml', to: 'sitemap.xml'},
];

// Copy to root for 'hr', and prefix with lang for others
// Page file names can differ per language (the `urls` block of each i18n file); others use the key itself
const pageFile = (lang, key) => {
  const name = loadJson(lang).urls[key] || `${key}.html`;
  return lang === 'hr' ? name : `${lang}/${name}`;
};

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
      filename: pageFile(lang, 'contact'),
      template: './templates/contact.hbs',
      templateParameters: () => loadJson(lang),
      chunks: ['contact'],
    })),
    // Text-only pages share one template; `page` is that page's block in the i18n file
    ...['privacy', 'terms'].flatMap(key => languages.map(lang => new HtmlWebpackPlugin({
      filename: pageFile(lang, key),
      template: './templates/legal.hbs',
      templateParameters: () => {
        const json = loadJson(lang);
        return {...json, page: json[key]};
      },
      chunks: [],
    }))),
    // Content pages share one template; each file name maps to that page's block in the i18n file
    ...Object.entries({
      'services': 'servicesPage',
      'pricing': 'pricingPage',
      'izrada-web-stranica': 'websitePage',
      'izrada-web-trgovina': 'webshopPage',
    }).flatMap(([file, block]) => languages.map(lang => new HtmlWebpackPlugin({
      filename: pageFile(lang, file),
      template: './templates/page.hbs',
      templateParameters: () => {
        const json = loadJson(lang);
        return {...json, page: json[block]};
      },
      chunks: [],
    }))),
    // The Croatian pages used to have English file names; keep those addresses working
    ...Object.entries(loadJson('hr').urls).filter(([key, name]) => name !== `${key}.html`).map(([key, name]) => new HtmlWebpackPlugin({
      filename: `${key}.html`,
      template: './templates/redirect.hbs',
      templateParameters: {target: name},
      chunks: [],
    })),
    // GitHub Pages serves the root 404.html for every missing URL, so only the Croatian one is built
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: './templates/404.hbs',
      templateParameters: () => loadJson('hr'),
      chunks: [],
    }),
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


