export interface Type<T> {
    new (...args: any[]): T;
  }

export const Controller = (prefix: string = '') => {
    return  <T>(target: Type<T>) => {
        Reflect.defineMetadata('prefix', prefix, target);
        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target);
        }
    };
};

// para que TS emita metadata sobre una clase, esta debe estar decorada.
export const Service = () => {
    return <T>(target: Type<T>) => {
        Reflect.getMetadata("design:paramtypes", target);
    }
}