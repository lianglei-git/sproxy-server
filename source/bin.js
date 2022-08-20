import process from 'process';
import fs from 'node:fs';
import path from 'path';
import minimist from 'minimist'
import defineConfig from './define.config.js';
import { isFunction, isUndefined, isPlainObject } from './utils.js';
import { fileURLToPath } from 'url'
import require from './_require.js'
import Entry from './index.js';
const cwd = process.cwd();
const argv = minimist(process.argv.slice(2));
const __filenameNew = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filenameNew)

process.title = 'xy-pro-server';
let full_config;
const _resolve = path.resolve;
const CONST_FILE_NAME = 'proserver.config.js';




if (argv.h || argv.help) {
  console.log([
    'usage: xy-pro-server [config path]',
    '',
    'options:',
    '  -p --port    Port to use. If 0, look for open port. [8080]',
    '  -a           Address to use [0.0.0.0]',
    '  -d           Show directory listings [true]',
    '  -i           Display autoIndex [true]',
    '  -g --gzip    Serve gzip files when possible [false]',
    '  -b --brotli  Serve brotli files when possible [false]',
    '               If both brotli and gzip are enabled, brotli takes precedence',
    '  -e --ext     Default file extension if none supplied [none]',
    '  -s --silent  Suppress log messages from output',
    '  --cors[=headers]   Enable CORS via the "Access-Control-Allow-Origin" header',
    '                     Optionally provide CORS headers list separated by commas',
    '  -o [path]    Open browser window after starting the server.',
    '               Optionally provide a URL path to open the browser window to.',
    '  -c           Cache time (max-age) in seconds [3600], e.g. -c10 for 10 seconds.',
    '               To disable caching, use -c-1.',
    '  -t           Connections timeout in seconds [120], e.g. -t60 for 1 minute.',
    '               To disable timeout, use -t0',
    '  -U --utc     Use UTC time from at in log messages.',
    '  --log-ip     Enable logging of the client\'s IP address',
    '',
    '  -P --proxy       Fallback proxy if the request cannot be resolved. e.g.: http://someurl.com',
    '  --proxy-options  Pass options to proxy using nested dotted objects. e.g.: --proxy-options.secure false',
    '',
    '  --username   Username for basic authentication [none]',
    '               Can also be specified with the env variable NODE_HTTP_SERVER_USERNAME',
    '  --password   Password for basic authentication [none]',
    '               Can also be specified with the env variable NODE_HTTP_SERVER_PASSWORD',
    '',
    '  -S --tls --ssl   Enable secure request serving with TLS/SSL (HTTPS)',
    '  -C --cert    Path to TLS cert file (default: cert.pem)',
    '  -K --key     Path to TLS key file (default: key.pem)',
    '',
    '  -r --robots        Respond to /robots.txt [User-agent: *\\nDisallow: /]',
    '  --no-dotfiles      Do not show dotfiles',
    '  --mimetypes        Path to a .types file for custom mimetype definition',
    '  -h --help          Print this list and exit.',
    '  -v --version       Print the version and exit.'
  ].join('\n'));
  process.exit();
}

if (argv._[0] && argv._[0].indexOf('.config') > -1) {
  let jobConfig = require(_resolve(cwd, argv._[0]));
  /** 
   * Only plain object of the target file are processed
   */
  if (isPlainObject(jobConfig) && !isFunction(jobConfig)) {

    full_config = defineConfig(Object.assign(jobConfig, argv));
  } else {
    console.error('Only support "Object"');
  }
} else {
  try {
    const jobRoot_default_Config = require(_resolve(cwd, CONST_FILE_NAME))
    full_config = defineConfig(Object.assign(jobRoot_default_Config, argv))
  } catch {
    full_config = defineConfig(argv);
  }
}


full_config && Entry(full_config);