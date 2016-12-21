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

    // TODO - this stuff should go into @tandem/sandbox

    new HTTPRouteProvider("get", "/proxy/read/:base64URI", class extends BaseHTTPRouteHandler {
      async handle(req: express.Request, res: express.Response, next) {
        const uri = new Buffer(req.params.base64URI, "base64").toString("utf8");
        const protocol = URIProtocolProvider.lookup(uri, this.kernel);
        const { type, content } = await protocol.read(uri);
        res.contentType(type);
        res.send(content);
      }
    }),

    new HTTPRouteProvider("post", "/proxy/write/:base64URI", class extends BaseHTTPRouteHandler {
      async handle(req: express.Request, res: express.Response, next) {
        const uri = new Buffer(req.params.base64URI, "base64").toString("utf8");
        const protocol = URIProtocolProvider.lookup(uri, this.kernel);
        const buffer = [];
        req.on("data", buffer.push.bind(buffer));
        req.on("end", () => {
          protocol.write(uri, buffer.join(""));
          res.end();
        });
      }
    }),

    new HTTPRouteProvider("get", "/proxy/file-exists/:base64URI", class extends BaseHTTPRouteHandler {
      async handle(req: express.Request, res: express.Response, next) {
        const uri = new Buffer(req.params.base64URI, "base64").toString("utf8");
        const protocol = URIProtocolProvider.lookup(uri, this.kernel);
        res.send(await protocol.fileExists(uri));
      }
    }),
  ];
  
}
