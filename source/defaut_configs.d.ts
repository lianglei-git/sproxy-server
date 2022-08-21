
type Decode = {
    url: String
    format(res, req, data): void
}

type Proxy = {
    [k: string]: {
        /** decodeFunction or intercept for only match one */
        intercept?: (res, req, data) => unknown
        target: String
    }
}

type defaultConfig = {
    port?: Number;
    open?: Boolean;
    contentBase: String;
    host?: String;
    decodeFunction?: (config: defaultConfig) => Decode[]
    publicPath: String;
    proxy: Proxy;
}

declare const defaultConfig: defaultConfig;

export = defaultConfig;