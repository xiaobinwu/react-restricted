const path = require('path');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');

module.exports = {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        process.env.NODE_PATH.split(path.delimiter).filter(Boolean)),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
        src: paths.appSrc,
        common: paths.resolveApp('src/common'),
        css: paths.resolveApp('src/common/css'),
        img: paths.resolveApp('src/common/img'),
        js: paths.resolveApp('src/common/js'),

        component: paths.resolveApp('src/component'),
        service: paths.resolveApp('src/service'),
        rRedux: paths.resolveApp('src/redux'),
        pages: paths.resolveApp('src/pages'),
        route: paths.resolveApp('src/pages/route'),
        view: paths.resolveApp('src/pages/view'),
        themes: paths.resolveApp('src/themes'),
        charts: paths.resolveApp('src/charts')
    },
    plugins: [
        // Prevents users from importing files from outside of src/ (or node_modules/).
        // This often causes confusion because we only process files within src/ with babel.
        // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
        // please link the files into your node_modules/ and let module-resolution kick in.
        // Make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
};
