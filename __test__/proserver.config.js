// require('./aa.js')

module.exports = {
  ksl: 1123,
  contentBase: '.',
  port: 24678,
  host: '0.0.0.0',
  open: true, // 是否自动打开默认浏览器
  publicPath: '/static/viewct/',
  /** 转译读取本地资源 */
  // decodeFunction(config) {
  //   return [
  //     {
  //       url: '/static/viewct/',
  //       format(req, res, body) {
  //         let revalURL = req.url.replace('/static/viewct/', '');
  //         if (revalURL.indexOf('?') > -1) {
  //           revalURL = revalURL.slice(0, revalURL.indexOf('?'));
  //         }
  //         const content = readFileSync(
  //           path.resolve(config.basicConnect, revalURL),
  //           'utf-8'
  //         );
  //         const type = mime.getType(revalURL);
  //         res.setHeader('Content-Type', type);
  //         return content || body;
  //       }
  //     }
  //   ]
  // },
  proxy: {
    '/': {
      // target: 'http://10.2.118.227:8360/', // 'http://10.2.112.100:8360/',
      target: 'http://218.28.104.157:443',
      intercept(req, res) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return `
              <div style="font-size:22px">
                  pro-proxy-server is <span style="color:#b86c0f">heavy</span>!
              </div>
            `
      },
      // 👌
      bypass: function name(req, res) {
        // 静态资源读取本地
        if (req.url.substr(0, 15) == '/static/viewct/') {
          return req.url.substr(14);
        }
        // return '/bin/index.mjs'
      }
    }
  }
}

