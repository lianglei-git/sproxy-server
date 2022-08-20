import { existsSync, readFileSync } from 'fs';
import { dirname, extname } from 'path';
import vm from 'vm';

class Module {
    id = null;
    exports = {};
    static
    catch = new Map();
    static extensions = {
        '.js'(module) {
            let code = readFileSync(module.id).toString();
            let content = '(function (module,exports, require, __dirname, __filename){\n' + code + '\n})'
            const func = vm.runInThisContext(content);
            const exports = module.exports;
            func.call(exports, module, exports, _Require, dirname(module.id), module.id)
        },
        'ts'() { }
    }
    static _resolvePathName(filenmae) {
        let id = null;
        if (existsSync(filenmae)) {
            id = filenmae
        } else {
            let extensions = Object.keys(Module.extensions);
            id = extensions.reduce((_id, item) => {
                existsSync(filenmae + item) && (_id = filenmae + item);
                return _id;
            }, null);
            if (!id) {
                throw Error('This file is not available ‘' + filenmae + '‘');
            }
        }
        return id
    }
    load() {
        let _extname = extname(this.id)

        Module.extensions[_extname](this);
    }
}

const _Require = (path) => {
    let resolvePath = Module._resolvePathName(path);
    let catchData = Reflect.get(Module.catch, resolvePath) || null;
    let res = null;
    try {
        if (catchData) res = catchData[resolvePath].exports;
        else {
            const module = new Module();
            module.id = resolvePath;
            Reflect.set(Module.catch, resolvePath, module);
            module.load();
            res = module.exports;
        }
    } catch {
        console.error('Use the correct path!');
    }
    return res;
}

export default _Require;