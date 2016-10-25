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
import { CoreApplicationService } from "@tandem/editor/core";
import { IEdtorServerConfig } from "@tandem/editor/server/config";
import { Response } from "mesh";
import { IOService } from "@tandem/common/services";
import { IApplication } from "@tandem/common/application";
import { loggable, inject } from "@tandem/common/decorators";
import { BaseApplicationService } from "@tandem/common/services";
import { SocketIOHandlerDependency  } from "@tandem/server/dependencies";
import { ApplicationServiceDependency } from "@tandem/common/dependencies";
import { DependenciesDependency, Dependencies } from "@tandem/common/dependencies";
import { FileCacheDependency, FileCache } from "@tandem/sandbox";
import { DSUpsertAction, LoadAction, InitializeAction } from "@tandem/common/actions";

// TODO - split this out into separate files -- turning into a god object.

export class BrowserService extends CoreApplicationService<IEdtorServerConfig> {

  private _server: express.Express;
  private _ioService:IOService<IApplication>;
  private _port:number;
  private _socket:any;
  public config:any;
  private _bundles:Array<any>;

  @inject(DependenciesDependency.ID)
  readonly dependencies: Dependencies;

  @inject(FileCacheDependency.ID)
  private _fileCache: FileCache;

  $didInject() {
    super.$didInject();
    this.bus.register(this._ioService = IOService.create<IApplication>(this.dependencies));
  }

  async [InitializeAction.INITIALIZE]() {
    this._port = this.config.port || await getPort();
    await this._loadHttpServer();
    await this._loadStaticRoutes();
    await this._loadSocketServer();

    if (this.config.argv.open) {
      exec(`open http://localhost:${this._port}/editor`);
    }

    this._fileCache.syncWithLocalFiles();
  }

  async _loadHttpServer() {
    console.log(`listening on port ${this._port}`);

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

    for (const entryName in this.config.entries) {
      var entryPath = this.config.entries[entryName];

      var scriptName = path.basename(entryPath);

      const prefix = "/" + entryName;

      // this should be part of the config
      const entryDirectory = path.dirname(entryPath);
      this._server.use(prefix, express.static(entryDirectory));

      if (this.config.publicDirectory) {
        this._server.use(prefix, express.static(this.config.publicDirectory));
      }

      const staticFileNames = fs.readdirSync(entryDirectory);

      this._server.use(prefix, (req, res) => {
        res.send(this.getIndexHtmlContent(staticFileNames));
      });
    }
  }

  // TODO - deprecate this

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
    SocketIOHandlerDependency.plugin(io, this.dependencies);
    io["set"]("origins", "*domain.com*:*");
    io.on("connection", this._ioService.addConnection);
    io.listen(this._socket);
  }
}
