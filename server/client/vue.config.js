const path = require('path');
const debug = process.env.NODE_ENV !== 'production';

module.exports = {
  devServer: {
    proxy: { // 配置跨域
      '/api': {
        target: 'http://localhost:5000/api/',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    before: app => { }
  }
};