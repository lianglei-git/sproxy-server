/** entry  */ 
import { existsSync, readFileSync } from 'fs';
import createApplication, { useCores } from './kiss.js';
import httpProxy from 'http-proxy';
import path from 'path';
import { isPromise } from 'util/types';
import defineConfig from './define.config.js'
import { openDefaultBrower, isUndefined, isString, isFunction } from './utils.js';
const app = createApplication();
var proxy = httpProxy.createProxyServer();

app.use(useCores());
process.on('uncaughtException', function (err) {
  console.error(err);
});


function Run(config) {
  const decode = [];

  if (!isUndefined(config.decodeFunction)) {
    decode.concat(config.decodeFunction(config));
  }

  for (let k in config.proxy) {
    if (isFunction(config.proxy[k].intercept)) {
      decode.push({ url: k, format: config.proxy[k].intercept })
    }
  }

  if (!isUndefined(config.publicPath) && isString(config.publicPath)) {
   // ...
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
      if (isPromise(formatBody)) return formatBody.then(r => res.end(r))
      return res.end(formatBody);
    });
  });

  const getProxyTarget = (req) => {
    let proxyKeys = Object.keys(config.proxy);
    let currKey = proxyKeys.find(i => req.url.indexOf(i) > -1);
    const target = currKey && config.proxy[currKey];
    return target;
  }

  /** match proxy targe */
  app.use((req, res, next) => {
    const proxyTarget = getProxyTarget(req)
    if (proxyTarget) {
      res.proxyTarget = proxyTarget;
      next();
    };
  })
  /** bypass */
  app.use((req, res, next) => {
    /** bypass, If a local file is matched, the local file is used; in case match bypassUrl, returns local file */
    const proxyTarget = res.proxyTarget;
    let bypassUrl = proxyTarget.bypass && proxyTarget.bypass(req, res) || '';
    if (bypassUrl.indexOf('?') > -1) {
      bypassUrl = bypassUrl.slice(0, bypassUrl.indexOf('?'));
    }
    // const i = accessSync(path.join(config.basicConnect, bypassUrl), fs.constants.F_OK);
    const realPath = path.join(config.basicConnect, bypassUrl)
    const p = path.extname(bypassUrl) && existsSync(realPath);
    if (p) {
      const content = readFileSync(realPath, 'utf-8');
      res.end(content);
    }else {
      next();
    }
  })
  /** proxy */
  app.use((req, res, next) => {
    const proxyTarget = res.proxyTarget;
    proxy.web(req, res, {
      target: proxyTarget.target,
      selfHandleResponse: !!decode.find((i) => req.url.indexOf(i.url) > -1),
      changeOrigin: true
    });
  });

  app.listen(config.port, config.host, () => {
    const IP = 'http://' + config.host + ':' + config.port;
    console.log('✨ URL -> \x1B[36m', IP, '\x1B[30m');
    if (config.open) {
      openDefaultBrower(IP)
    }
  });
}


Run.defineConfig = defineConfig;
Run.app = app;
export default Run;

export {
  defineConfig,
  app
}
/** using */
// 1. Using the CLI:  proxy-server || proxy-server abc.config.js
// 2. Using the Code: 
//                1|  import Server from 'sproxy-server'
//                2|  Server(config);
//                3|  wait... is not the end
//                4|  in case want to see the detailed configuration， i don't konw 🤕️