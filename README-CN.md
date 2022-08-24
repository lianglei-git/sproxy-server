## 看似代理服务器
> 契机：项目打包后登录页面像访问远程服务器，且登录后的页面要访问本地文件，我找了本地代理，尝试了 `http-server`的代理，发现并不是我根本需要的东西，也可能是我没有找到位置，所以自己写了一个。

> 如果你想要做代理服务器，且需要根据不同规则使用本地文件。那么你可以采用这款工具

### 使用
- `yarn sproxy-server`
    1. cli使用
        有两种方式去匹配config， 当然默认走的`default.config.js` 首先你可以通过根目录编写`proserver.config.js` 且在命令直接运行 `sproxy-server`就会默认走入根目录配置文件。  
        其次你可以通过 `sproxy-server xxx.config.js`去手动介入配置文件。
    2. 代码运行使用
        ```js
            import ProServer from 'sproxy-server';
            ProServer(config);
            // 如果你想添加middleware
            ProServer.app.use((req,res,next) => {});
            // 如果你想重新定义config
            ProServer.defineConfig(Object);
        ```

### 接下来
- cli模式的外露文件使用common规范，这点是重写了require但并没有导入node原有模块，目前解决方案可以采用使用代码运行方式
- 会进一步提高对webpack-dev-server的复刻兼容 





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
