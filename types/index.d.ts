import defaultConfig from "./defaut_configs";
import type { Server } from 'http';

type Config = defaultConfig

type Default = {
    (config: Config): void;
    defineConfig: (config: Config) => Config
    app: Server
}
declare const proServer: Default;
export default proServer;

export declare const defineConfig: Default['defineConfig']
export declare const app: Default['app']