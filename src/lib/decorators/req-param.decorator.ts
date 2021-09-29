export function ReqParam(value: string) {
    return function (target: any, metadataKey: string, parameterIndex: number) {
        let metadata = Reflect.getOwnMetadata(metadataKey, target);
        if (! metadata) {
            metadata = {
                params: []
            };
        }
    
        metadata.params.push(value);
        Reflect.defineMetadata(metadataKey, metadata, target);

    }
} 
