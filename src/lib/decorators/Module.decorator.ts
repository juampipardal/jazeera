export const Module = (params: {prefix?: string, controllers: any[]}) => {
    return (target) => {
        Reflect.defineMetadata('prefix', params.prefix || '/', target);
        Reflect.defineMetadata('controllers', params.controllers, target);
    };
};