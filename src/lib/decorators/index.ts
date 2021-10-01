import { Controller } from "./controller.decorator";
import { Middleware, OnError } from "./middleware.decorator";
import { ReqParam } from "./RouteParams.decorator";
import { Delete, Get, Options, Post, Put } from "./RequestMethod.decorator";

export  {
    Controller,
    Middleware,
    OnError,
    ReqParam,
    Get,
    Post,
    Delete,
    Options,
    Put
}