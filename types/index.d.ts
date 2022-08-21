import defaultConfig from "../source/defaut_configs";


type Config = defaultConfig

declare const proServer:(config: Config) => void;
export default proServer;


declare export const defineConfig: (config: Config) => Config