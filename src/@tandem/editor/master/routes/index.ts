import { GetProjectRequest } from "@tandem/editor/common";
import { HTTPRouteProvider } from "../providers";
import { BaseHTTPRouteHandler } from "./base";
import { URIProtocolProvider } from "@tandem/sandbox";
import express = require("express");

export const createHTTPRouteProviders = () => {
  return [
    
    new HTTPRouteProvider("get", "/projects/:id.tandem", class extends BaseHTTPRouteHandler {
      async handle(req, res: express.Response, next) {
        const project = await GetProjectRequest.dispatch(req.params.id, this.bus);
        if (!project) return next();
        const { type, content } = await project.read();
        res.contentType(type);
        res.send(content);
      }
    }),

    // new HTTPRouteProvider("post", "/project/:id.tandem", class extends BaseHTTPRouteHandler {
    //   async handle(req, res: express.Response, next) {
    //     const project = await GetProjectRequest.dispatch(req.params.id, this.bus);
    //     if (!project) return next();
    //     const { type, content } = await project.read();
    //     res.contentType(type);
    //     res.send(content);
    //   }
    // }),
  ];
  
}
