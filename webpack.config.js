const defaultsDeep = require('lodash.defaultsdeep');
var path = require('path');
var webpack = require('webpack');

// Plugins
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// PostCss
var autoprefixer = require('autoprefixer');
var postcssVars = require('postcss-simple-vars');
var postcssImport = require('postcss-import');

// OSS
const WebpackAliOSSPlugin = require('webpack-oss');
var now = Date.now();

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: '0.0.0.0',
        port: process.env.PORT || 8601,
        proxy: {
            '/api/*': {
                target: 'http://localhost:8000'
            }
        }
    },
    output: {
        library: 'GUI',
        filename: '[name].[chunkhash].js',
    },
    externals: {
        React: 'react',
        ReactDOM: 'react-dom'
    },
    resolve: {
        symlinks: false
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: [path.resolve(__dirname, 'src'), /node_modules[\\/]scratch-[^\\/]+[\\/]src/],
            options: {
                // Explicitly disable babelrc so we don't catch various config
                // in much lower dependencies.
                babelrc: false,
                plugins: [
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-transform-async-to-generator',
                    '@babel/plugin-proposal-object-rest-spread',
                    ['react-intl', {
                        messagesDir: './translations/messages/'
                    }],
                    ["import", {
                        "libraryName": "antd",
                        "style": "css" // `style: true` 会加载 less 文件
                    }]
                ],
                presets: [
                    ['@babel/preset-env', {targets: {browsers: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']}}],
                    '@babel/preset-react'
                ]
            }
        },
        {
            test: /\.css$/,
            exclude: [/[\\/]node_modules[\\/].*antd/],
            use: [process.env.NODE_ENV === 'production' ? {
                loader: MiniCssExtractPlugin.loader,
            }: {
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    camelCase: true
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: function () {
                        return [
                            postcssImport,
                            postcssVars,
                            autoprefixer({
                                browsers: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']
                            })
                        ];
                    }
                }
            }],
        },
        {
            test: /\.css$/,
            include: [/[\\/]node_modules[\\/].*antd/],
            use: [process.env.NODE_ENV === 'production' ? {
                loader: MiniCssExtractPlugin.loader,
            }: {
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    camelCase: true
                }
            }]
        }]
    },
    optimization: {},
    plugins: []
};

// 生产环境判定
if (process.env.NODE_ENV === 'production') {
    // 压缩
    base.optimization['minimizer'] = [
        new UglifyJsPlugin({
            include: /\.js$/,
            parallel: true,
            uglifyOptions: {
                output: {
                    comments: false,
                },
            }
        })
    ];

    // CSS提取
    var cssPlugin = new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css',
    });
    base.plugins.push(cssPlugin);

    // CSS压缩
    var cssOptPlugin = new OptimizeCssAssetsPlugin({
        cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
    });
    base.plugins.push(cssOptPlugin);
}

module.exports = [
    // to run editor examples
    defaultsDeep({}, base, {
        entry: {
            'lib.min': ['react', 'react-dom'],
            'gui': './src/playground/index_wrapper.js',
            'blocksonly': './src/playground/blocks-only.jsx',
            'compatibilitytesting': './src/playground/compatibility-testing.jsx',
            'player': './src/playground/h5/h5_wrapper.js',
            'my': './src/web/pages/my/my.jsx'
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].[chunkhash].js',
            publicPath: process.env.NODE_ENV === 'production' ? 'https://assets.scratch.kids123code.com/webpack/' + now + '/' : '/'
        },
        externals: {
            React: 'react',
            ReactDOM: 'react-dom'
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: /\.(svg|png|wav|gif|jpg)$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'static/assets/'
                    }
                }
            ])
        },
        optimization: {
            //splitChunks: {
            //    chunks: 'all',
            //    name: 'lib.min'
            //},
            runtimeChunk: {
                name: 'lib.min'
            }
        },
        plugins: base.plugins.concat([
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"' + process.env.NODE_ENV + '"',
                'process.env.DEBUG': Boolean(process.env.DEBUG),
                'process.env.GA_ID': '"' + (process.env.GA_ID || 'UA-106141066-2') + '"'
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'gui'],
                template: 'src/playground/index.ejs',
                title: '123少儿编程|Scratch 3.0',
                sentryConfig: process.env.SENTRY_CONFIG ? '"' + process.env.SENTRY_CONFIG + '"' : null
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'blocksonly'],
                template: 'src/playground/index.ejs',
                filename: 'blocks-only.html',
                title: 'Scratch 3.0 GUI: Blocks Only Example'
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'compatibilitytesting'],
                template: 'src/playground/index.ejs',
                filename: 'compatibility-testing.html',
                title: 'Scratch 3.0 GUI: Compatibility Testing'
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'player'],
                template: 'src/playground/index.ejs',
                filename: 'h5.html',
                title: '123少儿编程|作品展示'
            }),
            new HtmlWebpackPlugin({
                chunks: ['lib.min', 'my'],
                template: 'src/web/tpl.ejs',
                filename: 'my.html',
                title: '123少儿编程|我的主页'
            }),
            new CopyWebpackPlugin([{
                from: 'static',
                to: 'static'
            }]),
            new CopyWebpackPlugin([{
                from: 'node_modules/scratch-blocks/media',
                to: 'static/blocks-media'
            }]),
            new CopyWebpackPlugin([{
                from: 'extensions/**',
                to: 'static',
                context: 'src/examples'
            }]),
            new CopyWebpackPlugin([{
                from: 'extension-worker.{js,js.map}',
                context: 'node_modules/scratch-vm/dist/web'
            }])
        ].concat(
            process.env.NODE_ENV === 'production' ? [
                new WebpackAliOSSPlugin({
                    accessKeyId: 'LTAIPM8Vp5yZ6d6y',
                    accessKeySecret: 'rpYZQReTmkqGfapx5J2uugu91yf1oG',
                    region: 'oss-cn-qingdao',
                    bucket: 'assets-scratch',
                    exclude: [/.*\.html$/],
                    deleteAll: false,
                    format: 'webpack/' + now,
                })
            ] : []
        ))
    })
].concat(
    process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist' ? (
        // export as library
        defaultsDeep({}, base, {
            target: 'web',
            entry: {
                'scratch-gui': './src/index.js'
            },
            output: {
                libraryTarget: 'umd',
                path: path.resolve('dist'),
            },
            externals: {
                React: 'react',
                ReactDOM: 'react-dom'
            },
            module: {
                rules: base.module.rules.concat([
                    {
                        test: /\.(svg|png|wav|gif|jpg)$/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'static/assets/',
                            publicPath: '/static/assets/'
                        }
                    }
                ])
            },
            plugins: base.plugins.concat([
                new CopyWebpackPlugin([{
                    from: 'node_modules/scratch-blocks/media',
                    to: 'static/blocks-media'
                }]),
                new CopyWebpackPlugin([{
                    from: 'extension-worker.{js,js.map}',
                    context: 'node_modules/scratch-vm/dist/web'
                }])
            ])
        })) : []
);
