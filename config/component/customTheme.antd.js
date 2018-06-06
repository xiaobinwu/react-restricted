/* 自定义antd样式 */
const { existsSync } = require('fs');
const paths = require('./paths');

const pkgPath = paths.appPackageJson;
const pkg = existsSync(pkgPath) ? require(pkgPath) : {};

let theme = {};
if (pkg.theme && typeof (pkg.theme) === 'string') {
    let cfgPath = pkg.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
        cfgPath = paths.resolveApp(cfgPath);
    }
    const getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
} else if (pkg.theme && typeof (pkg.theme) === 'object') {
    theme = pkg.theme; // eslint-disable-line
}
module.exports = theme;
