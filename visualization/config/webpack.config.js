const path = require('path')

const _ = require('lodash')
const webpack = require('webpack')
const merge = require('webpack-merge')
const DashboardPlugin = require('webpack-dashboard/plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const TransferPlugin = require('transfer-webpack-plugin')

const ROOT = path.join(__dirname, '..')
const CLIENT = path.join(ROOT, 'client')
const TARGET = process.env.npm_lifecycle_event

const common = {
  context: CLIENT,
  entry: {
    main: CLIENT,
    vendor: [
      'moment',
      'react',
      'lodash',
      'react-dom',
      'react-router',
      'react-decoration',
      'react-addons-perf'
    ]
  },
  node: {
    fs: 'empty'
  },
  externals: [
    { './cptable': 'var cptable' },
    { './jszip': 'jszip' }
  ],
  output: {
    path: path.join(ROOT, 'public'),
    filename: '[name].js',
    publicPath: '/assets/static/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: CLIENT,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: CLIENT,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: [
            'css-loader',
            'postcss'
          ]
        })
      },
      {
        test: /\.css$/,
        include: path.join(ROOT, 'node_modules'),
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new TransferPlugin(
      [
        { from: 'assets', to: '' }
      ],
      path.join(__dirname, '..', 'server')
    ),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('precss'),
          require('autoprefixer')
        ]
      }
    })
  ]
}

const dev = {
  devtool: 'source-map',
  entry: {
    main: [
      'webpack-hot-middleware/client',
      CLIENT
    ]
  },
  plugins: [
    new DashboardPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('dev')
      }
    })
  ]
}

const prod = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}

const customizeOptions = {
  customizeArray (a, b, key) { return [...a, ...b] },
  customizeObject (a, b, key) { return _.mergeWith(a, b) }
}

if (
  TARGET === 'start' ||
  TARGET === 'start:dev' ||
  TARGET === 'dashboard' ||
  TARGET === 'test:server' ||
  !TARGET // using dev setup for default case
) {
  module.exports = merge(customizeOptions)(common, dev)
} else if (
  TARGET === 'analyze' ||
  TARGET === 'build:client'
) {
  module.exports = merge(customizeOptions)(common, prod)
} else {
  throw new Error(`target ${TARGET} is not specified, please checkout webpack.config.js`)
}
