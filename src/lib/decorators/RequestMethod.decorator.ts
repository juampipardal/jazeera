import { RequestMethod, RouteDefinition, RouteParamsType } from '../models/route-definition.interface';

export const Get = (path: string): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey: string, descriptor: PropertyDescriptor): void => {
    setRoute(path, 'get', target, propertyKey, descriptor);
  };
}

export const Post = (path: string): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey: string, descriptor: PropertyDescriptor): void => {
    setRoute(path, 'post', target, propertyKey, descriptor);
  };
}

export const Delete = (path: string): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey: string, descriptor: PropertyDescriptor): void => {
    setRoute(path, 'delete', target, propertyKey, descriptor);
  };
}

export const Options = (path: string): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey: string, descriptor: PropertyDescriptor): void => {
    setRoute(path, 'options', target, propertyKey, descriptor);
  };
}

export const Put = (path: string): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey: string, descriptor: PropertyDescriptor): void => {
    setRoute(path, 'put', target, propertyKey, descriptor);
  };
}


function setRoute(path: string, method: RequestMethod, target, propertyKey: string, descriptor: PropertyDescriptor) {
  if (! Reflect.hasMetadata('routes', target.constructor)) {
    Reflect.defineMetadata('routes', [], target.constructor);
  }

  // Get the routes stored so far, extend it by the new route and re-set the metadata.
  const routes =  Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

  const routeParams: RouteParamsType[] = Reflect.getOwnMetadata(propertyKey, target)?.params;

  routes.push({
    requestMethod: method,
    path,
    methodName: propertyKey,
    middlewares: [],
    params: routeParams?.reverse() || []
  });
  
  Reflect.defineMetadata('routes', routes, target.constructor);
}