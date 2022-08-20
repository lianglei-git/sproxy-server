import defaultConfig from "./defaut_configs.js";
import merge from './merge.js'

/**
 * @returns {defaultConfig}
 */
export default function(targetConfig){
    let d = merge(defaultConfig, targetConfig);
    d.basicConnect = path.resolve(process.cwd(), d.contentBase);
    defaultConfig.decodeFunction()
    return d;
}