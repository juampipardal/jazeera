import { RequestHandler, ErrorRequestHandler } from 'express';
import { ErrorMiddleware } from '../models/route-definition.interface';


export function Middleware(middlewares: RequestHandler[]): MethodDecorator {
    return (target: Object, propertyKey: string): void => {
        addMiddlewareToMetadata(target, propertyKey, middlewares);
    };
}

export function AsyncMiddleware(middlewares: RequestHandler[]): MethodDecorator {
    return (target: Object, propertyKey: string): void => {
        addMiddlewareToMetadata(target, propertyKey, middlewares);
    };
}


export function OnError(statusCode: number): MethodDecorator {
    const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(statusCode).json({error_code: statusCode});
    };
    return (target: Object, propertyKey: string): void => {
        setErrorMiddleware(target, propertyKey, errorMiddleware);
    };
}

function addMiddlewareToMetadata(target: Object, metadataKey: any, middlewares: RequestHandler | RequestHandler[]): void {
    
    let metadata = Reflect.getOwnMetadata(metadataKey, target);
    
    if (!metadata) {
        metadata = {};
    }
    if (!metadata.middlewares) {
        metadata.middlewares = [];
    }

    let newArr: RequestHandler[];
    if (middlewares instanceof Array) {
        newArr = middlewares.slice();
    } else {
        newArr = [middlewares];
    }
    
    newArr.push(...metadata.middlewares);
    metadata.middlewares = newArr;
  
    Reflect.defineMetadata(metadataKey, metadata, target);
}


function setErrorMiddleware(target: Object, metadataKey: any, errorMiddleware: ErrorMiddleware): void {
    let metadata = Reflect.getOwnMetadata(metadataKey, target);
    if (!metadata) {
        metadata = {};
    }
    metadata.errorMiddleware = errorMiddleware;
    Reflect.defineMetadata(metadataKey, metadata, target);
}