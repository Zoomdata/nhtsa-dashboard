var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build'),
    test: path.join(__dirname, 'test'),
    agGrid: path.join(__dirname, 'node_modules', 'ag-grid')
};

process.env.BABEL_ENV = TARGET;

var common = {
    entry: PATHS.app,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(svg|gif|png|jpg)$/,
                loader: 'url-loader?limit=10000&name=images/[name]-[hash].[ext]',
                include: PATHS.app
            },
            {
                test: /\.(eot|woff|woff2|ttf)$/,
                loader: 'url-loader?limit=10000&name=fonts/[name]-[hash].[ext]',
                include: PATHS.app
            },
            {
                test: /\.jsx?$/,
                loaders: ['babel?cacheDirectory'],
                include: PATHS.app
            }
        ],
        noParse: [
            /[\/\\]node_modules[\/\\]zoomdata-client[\/\\]distribute[\/\\]sdk[\/\\]2\.0[\/\\]zoomdata-client\.js$/
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: 'NHTSA Dashboard',
            template: './src/index.html',
            inject: true,
            favicon: './zd.favicon.ico'
        }),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ]
};

if(TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: 'style!css',
                    include: [PATHS.agGrid, path.join(__dirname, 'node_modules', 'normalize.css')]
                },
                {
                    test: /\.css$/,
                    loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    include: [PATHS.app]
                }
            ]
        },
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,

            // display only errors to reduce the amount of output
            stats: 'errors-only',

            // parse host and port from env so this is easy
            // to customize
            host: process.env.HOST,
            port: process.env.PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if(TARGET === 'build' || TARGET === 'stats' || TARGET === 'deploy') {
    module.exports = merge(common, {
        entry: {
            app: PATHS.app,
            vendor: Object.keys(pkg.dependencies)
        },
        output: {
            path: PATHS.build,
            filename: 'js/[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
        },
        devtool: 'source-map',
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
                    include: [PATHS.agGrid, path.join(__dirname, 'node_modules', 'normalize.css')]
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader', {publicPath: '../'}),
                    include: [PATHS.app]
                }
            ]
        },
        postcss: function () {
            return [
                autoprefixer(
                    {
                        browsers: ['last 2 versions']
                    }
                )
            ];
        },
        plugins: [
            new Clean(['build']),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
            new ExtractTextPlugin('css/[name].[chunkhash].css'),
            new webpack.DefinePlugin({
                // This affects react lib size
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    });
}