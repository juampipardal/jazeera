import { ErrorRequestHandler, RequestHandler } from "express";

export type Middleware = RequestHandler;
export type ErrorMiddleware = ErrorRequestHandler;
export type RequestMethod =  'get' | 'post' | 'delete' | 'options' | 'put';


export interface RouteDefinition {
    // Path to our route
    path: string;
    // HTTP Request method (get, post, ...)
    requestMethod: RequestMethod;
    // Method name within our class responsible for this route
    methodName: string;
    middlewares?: Middleware[];
    errorMiddleware?: ErrorMiddleware;
    reqParams?: string[];
  }