const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const srcPage = paths.resolveApp('src/site');
const entries = glob.sync(`${srcPage}/*/*.js`);
const entryJsList = {};
const entryHtmlList = [];

for (const path of entries) {
    const chunkName = path.slice(`${srcPage}/`.length, -'.js'.length).split('/').shift();
    entryJsList[chunkName] = [
        // We ship a few polyfills by default:
        require.resolve('./polyfills'),
        paths.resolveApp(`src/site/${chunkName}/index.js`),
        // We include the app code last so that if there is a runtime error during
        // initialization, it doesn't blow up the WebpackDevServer client, and
        // changing JS code would still trigger a refresh.
    ];
    let htmlPrams = {
        inject: true,
        template: paths.appHtml ,
        filename: `${chunkName}.html`,
        chunks: [chunkName]
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
        entryJsList[chunkName].push(require.resolve('react-dev-utils/webpackHotDevClient'));
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
}

module.exports = {
    entryJsList,
    entryHtmlList,
}
