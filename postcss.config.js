module.exports = {
    plugins: [
        require('postcss-import')({
            path: ['src/']
        }),
        require('postcss-assets')({
            loadPaths: ['src/common/'],
            relative: true
        }),
        require('postcss-nested'),
        require('postcss-mixins'),
        require('postcss-extend'),
        require('postcss-cssnext')({
            warnForDuplicates: false
        }),
        require('cssnano')({
            sourcemap: true,
            safe: true,
        }),
    ]
}
