## Production Proxy Server or Match Local File

>Do: If you want to be a proxy server, you need to use local files according to different rules. Then you can use this tool；

## Using 
- `pnpm add sproxy-server`
  
  - `Using Cli`
    `sproxy-server xxx.config.js` Or `proserver.config.js` for the project root, Run again `sproxy-server`

  - `Using Code`
    ```js 
        import proServer from 'sproxy-server';
        proServer(config);
        // in case you want to use middleware: 
        proServer.app.use((req,res,next) => {});
        // in case you want rewrite `defineConfig`
        proServer.defineConfig(Object);
    ```


## Config File
`"proserver.config.js" is for the root directory` Or `sproxy-server xxx.config.js`;

1. "proserver.config.js" is for the root directory -> `sproxy-server`
2. sproxy-server xxx.config.js -> `sproxy-server xxx.config.js`


> For details about parameter Settings, see [Details](types/index.d.ts)


### 🌰
```js
module.exports = {
    port?: 24678,
    open?: true,
    contentBase: '../__test__',
    host?: '127.0.0.1',
    decodeFunction?: () => {
        return [
            {
                url: '/a/b',
                format(req,res,data) {
                    return 'Ok'
                }
            }
        ]
    },
    proxy: {
        '/': {
            target: 'http://123.4.5:9999/',
            intercept?: (req,res,data) => `<div>Switch</div>`,
            bypass?: (req,res) => {
                if(req.url.indexOf('__test__') > -1) {
                    return '/bin/index.mjs'
                }
            }
        },
        '/a': {

        }
    }
}
```


