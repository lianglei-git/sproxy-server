// 待完善
var http = require('http');
var httpProxy = require('http-proxy');
var httpServer = require('http-server');
var child_process = require('child_process');
var mime = require('mime');
var path = require('path');
const { readFileSync } = require('fs');
var proxy = httpProxy.createProxyServer();
var spawn = child_process.spawn;
var merge = require('./merge');
const defaultConfig = require('./defaut_configs');
const basicConnect = path.resolve(__dirname, '../dist');

process.on('uncaughtException', function (err) {
  console.error(err);
});

const decode = [
  {
    url: '/static/viewct/',
    format(req, res, body) {
      let revalURL = req.url.replace('/static/viewct/', '');
      if (revalURL.indexOf('?') > -1) {
        revalURL = revalURL.slice(0, revalURL.indexOf('?'));
      }
      const content = readFileSync(
        path.resolve(basicConnect, revalURL),
        'utf-8'
      );
      const type = mime.getType(revalURL);
      res.setHeader('Content-Type', type);
      return content || body;
    }
  }
];

function formatRes(req, res, body) {
  const filter = decode.find((i) => req.url.indexOf(i.url) > -1);
  const result = filter && filter.format(req, res, body);
  return result;
}

proxy.on('proxyRes', function (proxyRes, req, res) {
  var body = [];
  proxyRes.on('data', function (chunk) {
    body.push(chunk);
  });
  proxyRes.on('end', function () {
    body = Buffer.concat(body);
    const formatBody = formatRes(req, res, body);
    if (formatBody) return res.end(formatBody);
  });
});

http
  .createServer(function (req, res) {
    try {
      // 如果以test开头的请求则做额外处理
      if (req.url.substr(0, 6) == '/test/') {
        // ......
        return;
      }
      proxy.web(req, res, {
        target: 'http://10.2.112.100:8360',
        selfHandleResponse: !!decode.find((i) => req.url.indexOf(i.url) > -1),
        changeOrigin: true
      });
      // //其他请求直接转发
    } catch (e) {
      console.error(e);
    }
  })
  .listen(8081, '127.0.0.1', () => {
    console.log('端口：：8081');
  });
