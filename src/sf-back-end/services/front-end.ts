import * as path from "path";
import * as cors from "cors";
import * as express from "express";

import * as createSocketIOServer from "socket.io";

import { sync as getPackagePath } from "package-path";

import * as fs from "fs";
import * as gaze from "gaze";
import * as sift from "sift";

import { Logger } from "sf-core/logger";
import { IApplication } from "sf-core/application";
import { UpsertAction } from "sf-core/actions";
import { loggable, inject } from "sf-core/decorators";
import { BaseApplicationService } from "sf-core/services";
import { DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { ApplicationServiceDependency } from "sf-core/dependencies";
import { IOService } from "sf-common/services";

import { Response } from "mesh";

@loggable()
export default class FrontEndService extends BaseApplicationService<IApplication> {

  private _server:any;
  private _ioService:IOService<IApplication>;
  private _port:number;
  private _socket:any;
  public config:any;
  public logger:Logger;
  private _bundles:Array<any>;

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  didInject() {
    this.app.actors.push(this._ioService = IOService.create<IApplication>(this.dependencies));
    this._port = this.app.config.port;
  }


  async load() {
    await this._loadHttpServer();
    await this._loadStaticRoutes();
    await this._loadSocketServer();
  }

  async _loadHttpServer() {
    this.logger.info(`listening on port ${this._port}`);
    this._server = express();
    this._socket = this._server.listen(this._port);
  }


  async _loadStaticRoutes() {

    this._server.use(cors());

    var entryPath = this.app.config.frontEndEntry;

    var scriptName = path.basename(entryPath);

    // this should be part of the config
    const entryDirectory = path.dirname(entryPath);
    this._server.use(express.static(entryDirectory));

    if (this.app.config.publicDirectory) {
      this._server.use(express.static(this.app.config.publicDirectory));
    }

    const staticFileNames = fs.readdirSync(entryDirectory);

    this._server.use((req, res) => {
      res.send(this.getIndexHtmlContent(staticFileNames));
    });
  }

  getIndexHtmlContent(staticFileNames) {
    const host = `http://localhost:${this._port}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body {
              width: 100%;
              height: 100%;
            }
          </style>
          <script type="text/javascript">
            var config = {
              backend: {
                port: ${this._port}
              }
            };
          </script>
        </head>
        <body>
          <div id="app"></div>
          ${
            staticFileNames.sort((a, b) => /css$/.test(a) ? -1 : 1).map((basename) => {
              if (/css$/.test(basename)) {
                return `<link rel="stylesheet" type="text/css" href="${basename}">`;
              } else if (/js$/.test(basename)) {
                return `<script src="${basename}"></script>`;
              }
            }).filter((str) => !!str).join("\n")
          }
        </body>
      </html>
    `;
  }

  async _loadSocketServer() {
    this._server = createSocketIOServer();
    this._server.set("origins", "*domain.com*:*");
    this._server.on("connection", this._ioService.addConnection);
    this._server.listen(this._socket);
  }
}

export const dependency = new ApplicationServiceDependency("front-end", FrontEndService);
