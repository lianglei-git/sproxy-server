// TODO
import child_process from 'child_process';
import { readFileSync } from 'fs';
import http from 'http';
import httpProxy from 'http-proxy';
import mime from 'mime';
import path from 'path';
import { isPromise } from 'util/types';
import { openDefaultBrower, isUndefined, isString, isFunction } from './utils.js';
var proxy = httpProxy.createProxyServer();
var spawn = child_process.spawn;

process.on('uncaughtException', function (err) {
  console.error(err);
});

function Run(config) {
  const decode = [];

  if (!isUndefined(config.decodeFunction)) {
    decode.concat(config.decodeFunction(config));
  }
  
  for(let k in config.proxy) {
    if(isFunction(config.proxy[k].intercept)) {
      decode.push({url: k, format: config.proxy[k].intercept})
    }
  }

  if (!isUndefined(config.publicPath) && isString(config.publicPath)) {
    /** publicPath who? */
    // decode.push({
    //   url: config.publicPath,
    //   format(req, res, body) {
    //     let revalURL = req.url.replace(config.publicPath, '');
    //     if (revalURL.indexOf('?') > -1) {
    //       revalURL = revalURL.slice(0, revalURL.indexOf('?'));
    //     }
    //     const content = readFileSync(
    //       path.resolve(config.basicConnect, revalURL),
    //       'utf-8'
    //     );
    //     const type = mime.getType(revalURL);
    //     res.setHeader('Content-Type', type);
    //     return content || body;
    //   }
    // })
  }

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
      if(isPromise(formatBody))return formatBody.then(r => res.end(r))
      return res.end(formatBody);
    });
  });

  http
    .createServer(function (req, res) {
      let proxyKeys = Object(config.proxy).keys();
      let paoxyTarget = proxyKeys.find(i => req.url.indexOf(i.url) > -1)
      if (target) {
        proxy.web(req, res, {
          target: paoxyTarget.target,
          selfHandleResponse: !!decode.find((i) => req.url.indexOf(i.url) > -1),
          changeOrigin: true
        });
      }
    })
    .listen(config.port, config.host, () => {
      const IP = 'http://' + config.host + ':' + config.port;
      console.log('URL -> ', IP);
      if (config.open) {
        openDefaultBrower(IP);
      }
    });

}

module.exports = Run


/** using */
// 1. Using the CLI:  proxy-server || proxy-server abc.config.js
// 2. Using the Code: 
//                1|  import Server from 'pro-proxy-server'
//                2|  Server(config);
//                3|  wait... is not the end
//                4|  in case want to see the detailed configuration， i don't konw 🤕️