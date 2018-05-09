const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const paths = require('./paths');
const theme = require('./customTheme.antd');


module.exports = (env) => {
    const isProduction = env.stringified['process.env'].NODE_ENV === '"production"' ? true : false;
    let cssLoaderAarry = [];
    if (isProduction) {
        // Source maps are resource heavy and can cause out of memory issue for large source files.
        const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
        // Webpack uses `publicPath` to determine where the app is being served from.
        // It requires a trailing slash, or the file assets will get an incorrect path.
        const publicPath = paths.servedPath;
        // Some apps do not use client-side routing with pushState.
        // For these, "homepage" can be set to "." to enable relative asset paths.
        const shouldUseRelativeAssetPaths = publicPath === './';

        // Note: defined here because it will be used more than once.
        const cssFilename = 'static/css/[name].[contenthash:8].css';

        // ExtractTextPlugin expects the build output to be flat.
        // (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
        // However, our output is structured with css, js and media folders.
        // To have this structure working with relative paths, we have to use custom options.
        const extractTextPluginOptions = shouldUseRelativeAssetPaths
        ? // Making sure that the publicPath goes back to to build folder.
          { publicPath: Array(cssFilename.split('/').length).join('../') }
        : {};
        cssLoaderAarry = [{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign({
                            fallback: {
                                loader: require.resolve('style-loader'),
                                options: {
                                    hmr: false,
                                },
                            },
                            use: [{
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 1,
                                        minimize: true,
                                        sourceMap: shouldUseSourceMap,
                                        modules: true,
                                        localIdentName: '[name]__[local]___[hash:base64:5]'                                   
                                    },
                                },
                                {
                                    loader: require.resolve('postcss-loader')
                                }
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign({
                            fallback: {
                                loader: require.resolve('style-loader'),
                                options: {
                                    hmr: false,
                                },
                            },
                            use: [{
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 1,
                                        minimize: true,
                                        sourceMap: shouldUseSourceMap,
                                    },
                                },
                                {
                                    loader: require.resolve('less-loader'), // compiles Less to CSS
                                    options: {
                                        javascriptEnabled: true,
                                        modifyVars: theme
                                    }
                                }
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            }
        ]
    } else {
        cssLoaderAarry = [{
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader')
                    }
                ],
            },
            {
                test: /\.less$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: require.resolve('less-loader'),
                        options: {
                            javascriptEnabled: true,
                            modifyVars: theme
                        }
                    }
                ],
            }
        ]
    }
    return {
        strictExportPresence: true,
        rules: [
            // TODO: Disable require.ensure as it's not a standard language feature.
            // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
            // { parser: { requireEnsure: false } },

            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            {
                test: /\.(js|jsx|mjs)$/,
                enforce: 'pre',
                use: [{
                    options: {
                        formatter: eslintFormatter,
                        eslintPath: require.resolve('eslint'),
                    },
                    loader: require.resolve('eslint-loader'),
                }, ],
                include: paths.appSrc,
            },
            {
                oneOf: [{
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: isProduction,
                            cacheDirectory: !isProduction,
                        },
                    },
                    ...cssLoaderAarry,
                    {
                        exclude: [/\.html$/, /\.(js|jsx|mjs)$/, /\.(css|less)$/, /\.json$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]',
                        },
                    },
                ],
            },
        ],
    }
}