import { Controller, Service } from "./class.decorator";
import { Middleware, OnError } from "./middleware.decorator";
import { ReqParam } from "./RouteParams.decorator";
import { Delete, Get, Options, Post, Put, Patch } from "./RequestMethod.decorator";
import { Module } from "./Module.decorator";

export  {
    Module,
    Controller,
    Service,
    Middleware,
    OnError,
    ReqParam,
    Get,
    Post,
    Delete,
    Options,
    Put,
    Patch
}