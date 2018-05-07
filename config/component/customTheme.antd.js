/* 自定义antd样式 */
const { existsSync } = require('fs');
const { join, resolve } = require('path');

const pkgPath = join('../../', 'package.json');
const pkg = existsSync(pkgPath) ? require(pkgPath) : {};

let theme = {};
if (pkg.theme && typeof (pkg.theme) === 'string') {
    let cfgPath = pkg.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
        cfgPath = resolve('./', cfgPath);
    }
    console.log(cfgPath)
    const getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
} else if (pkg.theme && typeof (pkg.theme) === 'object') {
    theme = pkg.theme;
}
module.exports = theme;
