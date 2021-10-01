import { RouteParamsType } from "../models/route-definition.interface";

export function ReqParam(value?: string) {
    return function (target: any, metadataKey: string, parameterIndex: number) {
        const reqParam: RouteParamsType = {type: 'reqParam', value, index: parameterIndex};
        addRouteParam(reqParam, target, metadataKey, parameterIndex);
    }
}

export function BodyParam(value?: string) {
    return function (target: any, metadataKey: string, parameterIndex: number) {
        const reqParam: RouteParamsType = {type: 'bodyParam', value, index: parameterIndex};
        addRouteParam(reqParam, target, metadataKey, parameterIndex);
    }
}




function addRouteParam(value: RouteParamsType, target: any, metadataKey: string, parameterIndex: number) {
    
    let metadata = Reflect.getOwnMetadata(metadataKey, target);
        
    if (! metadata) {
        metadata = {
            params: []
        };
    }

    metadata.params.push(value);
    Reflect.defineMetadata(metadataKey, metadata, target);

}

