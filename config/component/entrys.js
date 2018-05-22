const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const entryJsList = {};
const entryHtmlList = [];

// 提取公用vendor
entryJsList['vendor'] = [
    'react', 
    'react-router-dom', 
    'redux', 
    'react-dom', 
    'react-redux', 
    'echarts', 
    'axios'
];
entryJsList['utils'] = [
    'qs',
    require.resolve('./polyfills')
];
entryJsList['index'] = [
    // We ship a few polyfills by default:
    paths.resolveApp('src/index.js')
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
];
let htmlPrams = {
    inject: true,
    template: paths.appHtml ,
    filename: 'index.html',
    chunks: ['index', 'vendor', 'util', 'runtime']
};
if(process.env.NODE_ENV === 'development') {
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    entryJsList['index'].push(require.resolve('react-dev-utils/webpackHotDevClient'));
} else {
    htmlPrams = Object.assign({}, htmlPrams, {
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }
    });
}
entryHtmlList.push(new HtmlWebpackPlugin(htmlPrams));

module.exports = {
    entryJsList,
    entryHtmlList,
}
