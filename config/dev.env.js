'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://kz.szwzznkj.com"',
  // BASE_API: '"http://inn.test.cn"',
})
