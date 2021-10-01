import { ErrorRequestHandler, RequestHandler } from "express";

export type Middleware = RequestHandler;
export type ErrorMiddleware = ErrorRequestHandler;
export type RequestMethod =  'get' | 'post' | 'delete' | 'options' | 'put';
export type ParamTypes = 'reqParam' | 'bodyParam';

export interface RouteParamsType {
  type: ParamTypes,
  value: string,
  index: number
}

export interface RouteDefinition {
    path: string;
    requestMethod: RequestMethod;
    methodName: string;
    middlewares?: Middleware[];
    errorMiddleware?: ErrorMiddleware;
    params?: RouteParamsType[];
  }