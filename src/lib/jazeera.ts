import 'reflect-metadata';
import express, { Application, NextFunction, Request } from "express";
import { RouteDefinition, RouteParamsType } from "./models/route-definition.interface";
import { Injector } from './DI/injector';

export class JazeeraApp {

    private _app: Application;

    constructor() {
        this._app = express();
    }

    get app(): Application {
        return this._app;
    }

    public addModules(modules: any[]) {
        
        modules.forEach(module => {

            const modulePrefix = Reflect.getMetadata('prefix', module);
            const moduleControllers: any[] = Reflect.getMetadata('controllers', module);
        
            moduleControllers.forEach(controller => this.setupController(controller, modulePrefix));
        });
    };

    public addStandaloneControllers(controllers: any[]) {
        controllers.forEach(controller => this.setupController(controller, '/'));
    }

    private setupController(controller: any, modulePrefix: string): void {
        const instance = Injector.resolve<any>(controller);
        const prefix = Reflect.getMetadata('prefix', controller);
        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
        
        routes.forEach(route => {
            const fullPrefix = modulePrefix === '/' ? prefix : modulePrefix + prefix;
            const routeMiddlewares = Reflect.getMetadata(route.methodName, instance)?.middlewares || [];
            const errorMiddleware = Reflect.getMetadata(route.methodName, instance)?.errorMiddleware || function(req,res,next) {next()};
            console.log('REGISTERING ROUTE: '+ route.methodName + ' ' + route.requestMethod +  ' ' + fullPrefix + route.path)
            this.app[route.requestMethod](fullPrefix + route.path, routeMiddlewares, (req: express.Request, res: express.Response, next: express.NextFunction) => {   
                
                let valueToReturn = instance[route.methodName].apply(instance, this.getMethodArgs(route.params, req, res, next));

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


    private getMethodArgs(params: RouteParamsType[], req: Request, res: Express.Response, next: NextFunction) {
        let methodArguments = [];
        
        if (params.length > 0) {            
            methodArguments = 
                params.sort((a, b) => a.index - b.index)
                .map(param => { 
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
