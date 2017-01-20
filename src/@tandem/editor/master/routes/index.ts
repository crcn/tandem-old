import { GetProjectRequest } from "@tandem/editor/common";
import { HTTPRouteProvider } from "../providers";
import { BaseHTTPRouteHandler } from "./base";
import { URIProtocolProvider } from "@tandem/sandbox";
import express = require("express");
import bodyParser = require("body-parser");
import mime = require("mime");
import { getProtocol } from "@tandem/common";

export const createHTTPRouteProviders = () => {
  return [
    
    new HTTPRouteProvider("get", "/projects/:id.tandem", class extends BaseHTTPRouteHandler {
      async handle(req: express.Request, res: express.Response, next) {
        const project = await GetProjectRequest.dispatch(req.params.id, this.bus);
        if (!project) return next();

        const sendContent = async () => {
          const protocol = getProtocol(project.uri);

          const { type, content } = await project.read();
          res.contentType(type);
          res.send(content);
        }

        if (req.headers["x-wait-for-change"]) {
          const disposable = project.watch(() => {
            disposable.dispose();
            sendContent();
          });
        } else {
          return sendContent();
        }
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

    new HTTPRouteProvider("get", "/proxy/:base64URI", class extends BaseHTTPRouteHandler {
      async handle(req: express.Request, res: express.Response, next) {
        const uri = new Buffer(req.params.base64URI, "base64").toString("utf8");
        const protocol = URIProtocolProvider.lookup(uri, this.kernel);
        const { type, content } = await protocol.read(uri);
        res.contentType(type || mime.lookup(uri));
        res.write(content);
        res.end();
      }
    }),

    // new HTTPRouteProvider("post", "/proxy/write/:base64URI", class extends BaseHTTPRouteHandler {
    //   async handle(req: express.Request, res: express.Response, next) {
    //     const uri = new Buffer(req.params.base64URI, "base64").toString("utf8");
    //     const protocol = URIProtocolProvider.lookup(uri, this.kernel);
    //     const buffer = [];
    //     req.on("data", buffer.push.bind(buffer));
    //     req.on("end", () => {
    //       protocol.write(uri, buffer.join(""));
    //       res.end();
    //     });
    //   }
    // }),

    // new HTTPRouteProvider("get", "/proxy/file-exists/:base64URI", class extends BaseHTTPRouteHandler {
    //   async handle(req: express.Request, res: express.Response, next) {
    //     const uri = new Buffer(req.params.base64URI, "base64").toString("utf8");
    //     const protocol = URIProtocolProvider.lookup(uri, this.kernel);
    //     res.send(await protocol.fileExists(uri));
    //   }
    // }),
  ];
  
}
