import 'reflect-metadata';
import express, { Application, NextFunction, Request, Response } from "express";
import { ParamTypes, RouteDefinition, RouteParamsType } from "./models/route-definition.interface";

export class JazeeraApp {

    private _app: Application;

    constructor() {
        this._app = express();
    }

    get app(): Application {
        return this._app;
    }

    public addControllers(controllers: any[]) {
        controllers.forEach(controller => {
            // This is our instantiated class
           const instance = new controller();
           // The prefix saved to our controller
           const prefix = Reflect.getMetadata('prefix', controller);
           // Our `routes` array containing all our routes for this controller
           const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
           
           routes.forEach(route => {
                // Existe el caso donde puede no tener middlewares una ruta.
                const routeMiddlewares = Reflect.getMetadata(route.methodName, instance.__proto__)?.middlewares || [];
                const errorMiddleware = Reflect.getMetadata(route.methodName, instance.__proto__)?.errorMiddleware || function(req,res,next) {next()};

                this.app[route.requestMethod](prefix + route.path, routeMiddlewares, (req: express.Request, res: express.Response, next: express.NextFunction) => {   
                    
                    // Execute our method for this path and pass our express request and response object.
                    let valueToReturn = instance[route.methodName].apply(this, this.getMethodArgs(route.params, req, res, next));

                    if (valueToReturn instanceof Promise) {
                        valueToReturn.then(val => {
                            if (val) {
                                res.status(200).json(val);
                            }
                        });
                    } else {
                        if (valueToReturn && (!valueToReturn.status || (valueToReturn.status && typeof valueToReturn.status !== 'function'))) { //only way to check if is res object
                            return res.status(200).json(valueToReturn);
                        }
                    }
               }, errorMiddleware);
           });
        }
    )};


    private getMethodArgs(params: RouteParamsType[], req: Request, res: Express.Response, next: NextFunction) {
        let methodArguments = [];
        
        if (params.length > 0) {            
            methodArguments = 
                params.sort((a, b) => a.index - b.index)
                .map(param => { // TODO doubleDispatch
                    if (param.type === 'reqParam') {
                        return param.value ? req.params[param.value] : req.params;
                    }
                    if (param.type === 'bodyParam') {
                        return param.value ? req.body[param.value] : req.body;
                    }
                })
        }
        methodArguments.push(req, res, next);
        return methodArguments;
    }

}
