import { createServer } from 'http';
import { merge } from './utils.js';
import mime from 'mime';
const slice = Array.prototype.slice

function Application() {
    this.stack = [];
}
Application.prototype.use = function (fn) {
    var path = '/';
    var offset = 0;
    /** in case params for string: "path", for function: "base" */
    if (typeof fn !== 'function') {
        offset = 1;
        // ...   
    }
    var callbacks = slice.call(arguments, offset)

    for (let i = 0; i < callbacks.length; i++) {
        var fn = callbacks[i];
        const resetFn = (req, res, next) => {
            if (fn.length > 3) {
                //  not a standard request handler
                return next();
            }
            try {
                fn(req, res, next)
            } catch (err) {
                next(err);
            }
        }
        if (typeof fn !== 'function') throw Error('ppp')
        this.stack.push(resetFn);
    }
}
Application.prototype.handle = function (req, res) {
    const self = this;
    let idx = 0;
    function next(err) {
        if (req.method == 'OPTIONS') {
            res.end("");
        }
        let fn = self.stack[idx++];
        if (err || !fn) {
            if (!fn) return; // console.log('The bottom of the')
            return console.error(err);
        }
        fn(req, res, next)
    }
    next();
}

const createApplication = () => {
    const p = new Application();
    const app = function (req, res, next) {
        return p.handle.call(p, req, res, next);
    }
    app.use = p.use.bind(p);
    app.listen = (...args) => {
        createAppServer(app).listen(...args);
    }
    return app;
}


const createAppServer = (app) => {
    return createServer(app)
}

// const app = createApplication();
// app.use((req, res, next) => {
//     console.log(1991919);
//     setTimeout(() => {
//         next();
//     }, 3000)
// })

// app.use((req, res, next) => {
//     console.log(99898);
//     next();
// })


// createAppServer(app).listen(8765, () => { console.log`8765` })

/** util */
const useCores = (options) => {
    const defaults = {
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        origin: "*",
        allowHeaders: "content-type"
    };
    options = merge(defaults, options);

    if (Array.isArray(options.exposeHeaders)) {
        options.exposeHeaders = options.exposeHeaders.join(',');
    }

    if (Array.isArray(options.allowMethods)) {
        options.allowMethods = options.allowMethods.join(',');
    }

    if (Array.isArray(options.allowHeaders)) {
        options.allowHeaders = options.allowHeaders.join(',');
    }

    if (options.maxAge) {
        options.maxAge = String(options.maxAge);
    }

    options.credentials = !!options.credentials;
    options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;
    return (req, res, next) => {
        const set =(k,v) => res.setHeader(k,v);
        set('Access-Control-Allow-Origin', options.origin);
        if (options.credentials === true) {
            set('Access-Control-Allow-Credentials', 'true');
        }
        if (options.exposeHeaders) {
            set('Access-Control-Expose-Headers', options.exposeHeaders);
        }
        if (options.maxAge) {
             set('Access-Control-Max-Age', options.maxAge);
        }
        if (options.allowMethods) {
             set('Access-Control-Allow-Methods', options.allowMethods);
        }
        if (options.allowHeaders) {
             set('Access-Control-Allow-Headers', options.allowHeaders);
        }
        // res.setHeader("Access-Control-Allow-Headers", "content-type");
        const getType = mime.getType || mime.lookup;
        const type = getType(req.url);
        res.setHeader('Content-Type', type);
        next();
    }
}


const useBody = () => (req, res, next) => {
    Object.defineProperty(res, 'body', {
        set(val) {
            res.end(JSON.stringify(val));
        },
        get() {
            throw new Error(`ctx.body can't read, only support assign value.`)
        }
    })
    next();
}


export {
    useBody,
    useCores
}
export default createApplication;