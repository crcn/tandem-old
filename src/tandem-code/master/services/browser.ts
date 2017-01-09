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
import { ExpressServerProvider } from "@tandem/editor/master";
import { IStudioEditorServerConfig } from "tandem-code/master/config";
import { FileCacheProvider, FileCache } from "@tandem/sandbox";
import { Kernel, CoreApplicationService } from "@tandem/common";
import { loggable, inject, injectProvider } from "@tandem/common/decorators";
import { DSUpsertRequest, LoadApplicationRequest, InitializeApplicationRequest } from "@tandem/common/messages";

// TODO - split this out into separate files -- turning into a god object.

@loggable()
export class BrowserService extends CoreApplicationService<IStudioEditorServerConfig> {

  private _ioService: IOService<IStudioEditorServerConfig>;
  private _port:number;

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;

  @injectProvider(ExpressServerProvider.ID)
  private _serverProvider: ExpressServerProvider;

  $didInject() {
    super.$didInject();
    this.bus.register(this._ioService = this.kernel.create(IOService, []));
  }

  async [InitializeApplicationRequest.INITIALIZE]() {
    await this._loadStaticRoutes();
    await this._loadFileCacheRoutes();
    await this._loadSocketServer();
  }

  async _loadStaticRoutes() {

    const server = this._serverProvider.value;

    server.use(cors());
    server.use(compression());
    
    server.use("/", express.static(this.config.browser.directory));
  }

  async _loadFileCacheRoutes() {
    this._serverProvider.value.use("/file-cache/", async (req, res) => {
      const uri = decodeURIComponent(req.path.substr(1));
      const item = this._fileCache.eagerFindByFilePath(uri);
      const { content, type } = await item.read();
      res.type(type || mime.lookup(uri));
      res.end(content);
    });
  }

  async _loadSocketServer() {
    const io = createSocketIOServer();
    io["set"]("origins", "*domain.com*:*");
    io.on("connection", this._ioService.addConnection);
    io.listen(this._serverProvider.target);
  }
}
