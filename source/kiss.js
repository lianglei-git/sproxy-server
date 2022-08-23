import {createServer} from 'http';
const application = function () {
    this.stack = Array();
    return this;
}
application.use = function (fn) {
    var path = '/';
    var offset = 0;
    /** in case params for string: "path", for function: "base" */
    if (typeof fn !== 'function') {
        offset = 1;
        // ...   
    }
    var callbacks = Array.prototype.slice.call(arguments, offset)

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
application.handle = function (req, res) {
    const self = this;
    let idx = 0;
    function next(err) {
        let fn = self.stack[idx++];
        if (err || !fn) {
            if (!fn) err = 'not funciton'
            return console.error(err);
        }
        fn(req, res, next)
    }
    next();
}

const createApplication = () => {
    const p = application();
    const app = function (req, res, next) {
        return application.handle.call(p, req, res, next);
    }
    app.use = application.use.bind(p);
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



export default createApplication;