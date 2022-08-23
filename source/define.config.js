import defaultConfig from "../types/defaut_configs.js";
import merge from './merge.js';
import path from 'path';

/**
 * @returns {defaultConfig}
 */
export default function (...args) {
    const _default = Array(defaultConfig);
    while (args.length >= 1) {
        const last = args.pop();
        if (last) {
            const _d_l = _default.pop();
            _default.push(merge(_d_l, last));
        }
    }
    const d = _default[0];
    d.basicConnect = path.resolve(process.cwd(), d.contentBase || '');
    return d;
}
