import * as path from 'path';
import * as cors from 'cors';
import * as express from 'express';

import * as createSocketIOServer from 'socket.io';

import { sync as getPackagePath } from 'package-path';

import * as fs from 'fs';
import * as gaze from 'gaze';
import * as sift from 'sift';

import { Logger } from 'saffron-core/src/logger';
import { IApplication } from 'saffron-base/src/application';
import { UpsertAction } from 'saffron-core/src/actions';
import { loggable } from 'saffron-core/src/decorators';
import { BaseApplicationService } from 'saffron-core/src/services';
import { ApplicationServiceFragment } from 'saffron-core/src/fragments';
import { IOService } from 'saffron-common/src/services';

import { Response } from 'mesh';

@loggable()
export default class FrontEndService extends BaseApplicationService<IApplication> {

  private _server:any;
  private _ioService:IOService<IApplication>;
  private _port:number;
  private _socket:any;
  public config:any;
  public logger:Logger;
  private _bundles:Array<any>;

  constructor(app:IApplication) {
    super(app);
    app.actors.push(this._ioService = new IOService<IApplication>(app));
    this._port = this.app.config.socketio.port;
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
    this._server.use(express.static(path.dirname(entryPath)));
    this._server.use(express.static(__dirname + '/../../public'));

    this._server.use((req, res) => {
      res.send(this.getIndexHtmlContent(scriptName));
    });
  }

  getIndexHtmlContent(scriptName) {
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
              socketio: {
                port: ${this._port}
              }
            };
          </script>
        </head>
        <body>
          <div id="app"></div>
          <script src="/vendor/react.min.js"></script>
          <script src="/vendor/react-dom.min.js"></script>
          <script src="${host}/${scriptName}"></script>
        </body>
      </html>
    `;
  }

  async _loadSocketServer() {
    this._server = createSocketIOServer();
    this._server.set('origins', '*domain.com*:*');
    this._server.on('connection', this._ioService.addConnection);
    this._server.listen(this._socket);
  }
}

export const fragment = new ApplicationServiceFragment('front-end', FrontEndService);
