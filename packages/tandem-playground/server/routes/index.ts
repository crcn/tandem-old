import { GetProjectRequest } from "@tandem/editor/common";
import { BaseHTTPRouteHandler, HTTPRouteProvider } from "@tandem/editor/master";
import { URIProtocolProvider } from "@tandem/sandbox";
import express = require("express");
import bodyParser = require("body-parser");
const version = require("../../version");

export const createHTTPRouteProviders = () => {
  return [
    new HTTPRouteProvider("get", "/version", class extends BaseHTTPRouteHandler {
      async handle(req, res: express.Response, next) {
        res.send(version);
      }
    })
  ];
  
}
