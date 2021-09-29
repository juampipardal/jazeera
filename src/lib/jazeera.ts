import 'reflect-metadata';
import express, { Application } from "express";
import { RouteDefinition } from "./models/route-definition.interface";

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
                    let valueToReturn;
                    if (route.reqParams.length > 0) {
                        let newArgs: any[] = route.reqParams.map(arg => req.params[arg]);
                        newArgs.push(req);  
                        newArgs.push(res);
                        newArgs.push(next);
                        valueToReturn = instance[route.methodName].apply(this, newArgs);
                    } else {
                        valueToReturn = instance[route.methodName](req, res, next);
                    }

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

}
