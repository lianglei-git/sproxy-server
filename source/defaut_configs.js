const path = require('path');
export default {
  hot: true,
  contentBase: path.join(__dirname, 'dist'),
  port: 24678,
  open: true, // 是否自动打开默认浏览器
  // 隔离模式头
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin'
  },
  // 允许远端访问
  host: '0.0.0.0',
  publicPath: '/static/viewct/',
  // 使用的代理服务器
  proxy: {
    '/': {
      // target: 'http://10.2.118.227:8360/', // 'http://10.2.112.100:8360/',
      target: 'http://10.2.112.100:8360/',
      bypass: function name(req, res) {
        // 静态资源读取本地
        if (req.url.substr(0, 15) == '/static/viewct/') {
          return req.url.substr(14);
        }
      }
    }
  }
};
