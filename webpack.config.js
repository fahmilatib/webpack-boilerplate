const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const buildDir = path.resolve(__dirname, 'webpack/dist');
const jsDir = path.resolve(__dirname, 'js'); // update this
const cssDir = path.resolve(__dirname, 'css'); // update this
const jsFilename = 'app'; // update this
const cssFilename = 'app'; // update this

let config = {
    entry: path.resolve(__dirname, 'webpack/src') + '/index.js',
    output: {
        path: buildDir,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    plugins: [
        new FileManagerPlugin({
            onStart: {
                delete: [buildDir],
            },
            onEnd: {
                copy: [
                    { source: `${buildDir}/*.js`, destination: jsDir },
                    { source: `${buildDir}/*.css`, destination: cssDir },
                ],
            },
        }),
    ],
};

module.exports = (env, argv) => {
    const isProduction = argv.mode == 'production';
    config.output.filename = isProduction ? `${jsFilename}.min.js` : `${jsFilename}.js`;

    config.plugins.push(new MiniCssExtractPlugin({
        filename: isProduction ? `${cssFilename}.min.css` : `${cssFilename}.css`,
    }));

    return config;
};
