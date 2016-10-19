import * as fs from "fs";
import * as fsa from "fs-extra";
import * as path from "path";
import * as gaze from "gaze";
import * as sift from "sift";
import * as cors from "cors";
import * as getPort from "get-port";
import * as express from "express";
import * as compression from "compression";
import * as createSocketIOServer from "socket.io";

import { exec } from "child_process";
import { Logger } from "@tandem/common/logger";
import { Response } from "mesh";
import { IOService } from "@tandem/common/services";
import { IApplication } from "@tandem/common/application";
import { loggable, inject } from "@tandem/common/decorators";
import { BaseApplicationService } from "@tandem/common/services";
import { SocketIOHandlerDependency  } from "@tandem/back-end/dependencies";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";
import { DEPENDENCIES_NS, Dependencies } from "@tandem/common/dependencies";
import { FileCacheDependency, FileCache } from "@tandem/sandbox";
import { DSUpsertAction, LoadAction, InitializeAction, ReadFileAction } from "@tandem/common/actions";

// TODO - split this out into separate files -- turning into a god object.

@loggable()
export default class FrontEndService extends BaseApplicationService<IApplication> {

  private _server: express.Express;
  private _ioService:IOService<IApplication>;
  private _port:number;
  private _socket:any;
  public config:any;
  public logger:Logger;
  private _bundles:Array<any>;

  @inject(DEPENDENCIES_NS)
  readonly dependencies: Dependencies;

  @inject(FileCacheDependency.NS)
  private _fileCache: FileCache;

  $didInject() {
    this.app.bus.register(this._ioService = IOService.create<IApplication>(this.dependencies));
  }

  async [InitializeAction.INITIALIZE]() {
    this._port = this.app.config.port || await getPort();
    await this._loadHttpServer();
    await this._loadStaticRoutes();
    await this._loadSocketServer();

    if (this.app.config.argv.open) {
      exec(`open http://localhost:${this._port}/editor`);
    }

    this._fileCache.syncWithLocalFiles();
  }

  async _loadHttpServer() {
    this.logger.info(`listening on port ${this._port}`);

    this._server = express();
    this._socket = this._server.listen(this._port);
  }

  async _loadStaticRoutes() {

    this._server.use(cors());
    this._server.use(compression());

    this._server.get("/asset/:uri", async (req, res, next) => {

      const uri = decodeURIComponent(req.params.uri);
      // const { content } = await ReadFileAction.execute(uri, this.bus);


      // need to sandbox this in project directory
      res.sendFile(uri);
    });

    for (const entryName in this.app.config.entries) {
      var entryPath = this.app.config.entries[entryName];

      var scriptName = path.basename(entryPath);

      const prefix = "/" + entryName;

      // this should be part of the config
      const entryDirectory = path.dirname(entryPath);
      this._server.use(prefix, express.static(entryDirectory));

      if (this.app.config.publicDirectory) {
        this._server.use(prefix, express.static(this.app.config.publicDirectory));
      }

      const staticFileNames = fs.readdirSync(entryDirectory);

      this._server.use(prefix, (req, res) => {
        res.send(this.getIndexHtmlContent(staticFileNames));
      });
    }
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
                hostname: window.location.hostname,
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
    const io = createSocketIOServer();
    SocketIOHandlerDependency.plugin(io, this.app.dependencies);
    io["set"]("origins", "*domain.com*:*");
    io.on("connection", this._ioService.addConnection);
    io.listen(this._socket);
  }
}

export const frontEndServiceDependency = new ApplicationServiceDependency("front-end", FrontEndService);
