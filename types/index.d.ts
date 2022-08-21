import defaultConfig from "../source/defaut_configs";


type Config = defaultConfig

declare const proServer:(config: Config) => void;
export default proServer;

export declare const defineConfig: (config: Config) => Config
