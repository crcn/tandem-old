import fs =  require("fs");
import fsa = require("fs-extra");
import path =  require("path");
import gaze =  require("gaze");
import mime =  require("mime");
import sift = require("sift");
import cors =  require("cors");
import getPort =  require("get-port");
import express =  require("express");
import compression =  require("compression");
import createSocketIOServer = require("socket.io");

import { exec } from "child_process";
import { IOService } from "@tandem/editor/common";
import { loggable, inject } from "@tandem/common/decorators";
import { IStudioEditorServerConfig } from "tandem-code/master/config";
import { FileCacheProvider, FileCache } from "@tandem/sandbox";
import { Kernel, CoreApplicationService } from "@tandem/common";
import { DSUpsertRequest, LoadApplicationRequest, InitializeApplicationRequest } from "@tandem/common/messages";

// TODO - split this out into separate files -- turning into a god object.

@loggable()
export class BrowserService extends CoreApplicationService<IStudioEditorServerConfig> {

  private _server: express.Express;
  private _ioService:IOService<IStudioEditorServerConfig>;
  private _port:number;
  private _socket:any;

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  $didInject() {
    super.$didInject();
    this.bus.register(this._ioService = this.kernel.create(IOService, []));
  }

  async [InitializeApplicationRequest.INITIALIZE]() {
    this._port = Number(this.config.port);
    await this._loadHttpServer();
    await this._loadStaticRoutes();
    await this._loadFileCacheRoutes();
    await this._loadSocketServer();

    if (this.config.argv.open) {
      exec(`open http://localhost:${this._port}/editor#/workspace`);
    }
  }

  async _loadHttpServer() {
    this.logger.info(`Listening on port ${this._port}`);

    this._server = express();
    this._socket = this._server.listen(this._port);
  }

  async _loadStaticRoutes() {

    this._server.use(cors());
    this._server.use(compression());

    for (const entryName in this.config.entries) {
      var entryPath = this.config.entries[entryName];

      var scriptName = path.basename(entryPath);

      const prefix = "/" + entryName;

      // this should be part of the config
      const entryDirectory = path.dirname(entryPath);
      this._server.use(prefix, express.static(entryDirectory));

      const staticFileNames = fs.readdirSync(entryDirectory);

      this._server.use(prefix, (req, res) => {
        res.send(this.getIndexHtmlContent(staticFileNames));
      });
    }
  }

  async _loadFileCacheRoutes() {
    this._server.use("/file-cache/", async (req, res) => {
      const uri = decodeURIComponent(req.path.substr(1));
      const item = this._fileCache.eagerFindByFilePath(uri);
      const { content, type } = await item.read();
      res.type(type || mime.lookup(uri));
      res.end(content);
    });
  }

  // TODO - deprecate this

  getIndexHtmlContent(staticFileNames) {
    const host = `http://localhost:${this._port}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset='utf-8' />
          <style>
            html, body {
              width: 100%;
              height: 100%;
            }
          </style>
          <script type="text/javascript">
            var config = {
              server: {
                hostname: window.location.hostname,
                port: Number(window.location.port || 80),
                cwd: "${process.cwd()}"
              },
              log: {
                level: ${this.config.log && this.config.log.level}
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
    io["set"]("origins", "*domain.com*:*");
    io.on("connection", this._ioService.addConnection);
    io.listen(this._socket);
  }
}
