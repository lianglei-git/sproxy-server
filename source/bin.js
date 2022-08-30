import process from 'process';
import path from 'path';
import minimist from 'minimist'
import defineConfig from './define.config.js';
import { isFunction, isPlainObject } from './utils.js';
import { fileURLToPath } from 'url'
import Entry from './index.js';
import { readFileSync } from 'fs';
import mergeConfig from './merge.js';

process.title = 'xy-pro-server';
let full_config;
const CONST_FILE_NAME = 'proserver.config.mjs',
  _resolve = path.resolve,
  cwd = process.cwd(),
  argv = minimist(process.argv.slice(2)),
  __filenameNew = fileURLToPath(import.meta.url),
  __dirname = path.dirname(__filenameNew);


/**
 * File name specification
 * 1. "proserver.config.mjs" a fixed file name in the root directory.
 * 2. The name extension must be ".config.mjs" or type Module for package.json
 */

if (argv.v || argv.version) {
  const info = readFileSync(_resolve(__dirname, '../package.json')).toString();
  const _info = JSON.parse(info);
  console.log('name    :', `\x1B[31m sproxy-server \x1B[31m\x1B[30m`);
  console.log("version : ", "\x1B[36mv" + _info.version + "\x1B[36m")
  process.exit();
}
if (argv.h || argv.help) {
  console.log([
    'usage: sproxy-server [config path], In case  have “config path” File name extension must be "\x1B[35m.config.mjs\x1B[30m"',
    '',
    'options:',
    '  -p --port          Port to use. If 0, look for open port. \x1B[34m[24678]\x1B[30m',
    '  -a --address       Address to use \x1B[34m[0.0.0.0]\x1B[30m',
    '  -o                 Open browser window after starting the server.',
    '  -c --contentBase   The address of the local resource \x1B[34m[string]\x1B[30m',
    '  -h --help          Print this list and exit.',
    '  -v --version       Print the version and exit.'
  ].join('\n'));
  process.exit();
}
const RequireConfigFile = async (relativePath) => {
  let jobConfig = await import(_resolve(cwd, relativePath));
  /** Handling Default behavior */
  if (isPlainObject(jobConfig.default)) {
    jobConfig = jobConfig.default;
  } else if (isFunction(jobConfig.default)) {
    jobConfig = jobConfig.default();
  }
  return jobConfig;
}

if (argv._[0] && (argv._[0] + '').indexOf('.config') > -1) {
  let jobConfig = await RequireConfigFile(argv._[0]);
  /** 
   * Only plain object of the target file are processed
   */
  if (isPlainObject(jobConfig) && !isFunction(jobConfig)) {

    full_config = defineConfig(jobConfig, argv);
  } else {
    console.error('\x1B[31mOnly support "Object"\x1B[30m');
  }
} else {
  try {
    let jobRoot_default_Config = await RequireConfigFile(CONST_FILE_NAME);
    full_config = defineConfig(jobRoot_default_Config, argv)
  } catch (err) {
    console.info(`\x1B[33m${err.stack}\x1B[33m`)
    full_config = defineConfig(argv);
  }
}

/**
 * @param {string[] | number[]} arg Must be of type (String | Number)
 */
function transform(arg) {
  return {
    [(argv.p || argv.port) && 'port']: arg.p || arg.port,
    [(argv.a || argv.address) && 'host']: arg.a || arg.address,
    [(argv.o) && 'open']: arg.o === 'false' ? false : true,
    [(argv.c || argv.contentBase) && 'contentBase']: argv.c || argv.contentBase,
  }
}
full_config = mergeConfig(full_config, transform(argv));

full_config && Entry(full_config);