
type Decode = {
    url: string
    format(res,req,data): void
}

type defaultConfig = {
    port:Number;
    open:Boolean;
    decodeFunction(config: defaultConfig): Decode[]
    proxy: {
        /** decodeFunction or intercept for only match one */
        intercept(res,req,data): unknown
        target:string
        
    }
}

declare const defaultConfig: defaultConfig;

export =  defaultConfig;