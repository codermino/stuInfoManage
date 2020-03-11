const path = require('path');
const debug = process.env.NODE_ENV !== 'production';

module.exports = {
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  // @表示src文件夹
  //       'views': '@/views',
  //       'components': '@/components',
  //       'network': '@/network',
  //       'common': '@/common',
  //       'assets': '@/assets',
  //     }
  //   }
  // },
  devServer: {
    proxy: { // 配置跨域
      '/api': {
        //如果是这种方式的target那么在前端请求的时候的/api(会把/api替换为'')/user/login，那么就会被跨域成为后端的/user/login
        // 根路径还是http://localhost:5000/api/,请求的路径就是http://localhost:5000/api/user/login
        target: 'http://localhost:5000/api/',

        //如果是这种方式的target那么在前端请求的时候的/api(会把/api替换为'')/user/login，那么就会被跨域成为后端的/user/login
        // 对应的请求路径就是http://localhost:5000/user/login
        // target: 'http://localhost:5000/',
        // ws: true,        //如果要代理 websockets，配置这个参数
        // secure: false,  // 如果是https接口，需要配置这个参数
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    before: app => { }
  }
};

// module.exports = {
//   devServer: {
//     proxy: {
//       '/': {
//         target: 'http://localhost:5000/',
//         changeOrigin: true
//       }
//     }
//   }
// };
