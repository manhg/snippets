var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    entry: {
        main: APP_DIR + "/index.jsx"
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].js"
    },
    externals: {
        "react": "React",
        'react-dom': 'ReactDOM'
    },
    module: {
        loaders: [{
                test: /\.coffee$/,
                use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015', 'react']
                        }
                    },
                    'coffee-loader'
                ]
            },
            {
                test: /\.jsx?/,
                include: APP_DIR,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};

module.exports = config;
