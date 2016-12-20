import { GetProjectRequest } from "@tandem/editor/common";
import { HTTPRouteProvider } from "../providers";
import { BaseHTTPRouteHandler } from "./base";
import { URIProtocolProvider } from "@tandem/sandbox";
import express = require("express");
import bodyParser = require("body-parser");

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

    new HTTPRouteProvider("post", "/projects/:id.tandem", class extends BaseHTTPRouteHandler {
      async handle(req: express.Request, res: express.Response, next) {
        const buffer = [];
        req.on("data", buffer.push.bind(buffer));
        req.on("end", async () => {
          const content = buffer.join("");
          const project = await GetProjectRequest.dispatch(req.params.id, this.bus);
          if (!project) return next();
          await project.writeSourceURI(content);
        });
      }
    }),
  ];
  
}
