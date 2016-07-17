
import { Service } from 'saffron-common/services';
import IOService from 'saffron-common/services/io';
import loggable from 'saffron-common/logger/mixins/loggable';
import createSocketIOServer from 'socket.io';
import { FactoryFragment } from 'saffron-common/fragments';
import createServer from 'express';
import path from 'path';
import cors from 'cors';
import createStaticMiddleware from 'express-static';
import { sync as getPackagePath } from 'package-path';

@loggable
export default class FrontEndService extends Service {

  constructor(properties) {
    super(properties);
    this.app.actors.push(this._ioService = IOService.create(properties));
    this._port = this.config.socketio.port;
  }

  async load() {
    await this._loadHttpServer();
    await this._loadStaticRoutes();
    await this._loadSocketServer();
  }

  async _loadHttpServer() {
    this.logger.info(`listening on port ${this._port}`);
    this._server = createServer();
    this._socket = this._server.listen(this._port);
  }

  async _loadBundles() {
    const bundles = [];
    for (var moduleName of (this.app.config.bundles || [])) {
      try {
        bundles.push(await this._loadBundle(moduleName));
      } catch(e) {
        this.logger.error('unable to load %s', moduleName);
      }
    }
    return bundles;
  }

  async _loadBundle(moduleName) {
    this.logger.info('loading bundle %s', moduleName);
    const pkgPath = getPackagePath(require.resolve(moduleName));
    console.log(pkgPath);
    const pkg = require(pkgPath + '/package.json');
    return {
      main: path.join(pkgPath, pkg.main)
    };
  }

  async _loadStaticRoutes() {
    var bundles = this._bundles = await this._loadBundles();

    this._server.use(cors());

    // this should be part of the config
    this._server.use(createStaticMiddleware(__dirname + '/../public'));

    for (var bundle of bundles) {
      this._server.use(createStaticMiddleware(path.dirname(bundle.main)));
    }

    this._server.use((req, res) => {
      res.send(this.getIndexHtmlContent());
    });
  }

  getIndexHtmlContent() {
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
        </head>
        <body>
          <div id="app"></div>
          <script src='${host}/vendor/react.min.js'></script>
          <script src='${host}/vendor/react-dom.min.js'></script>
          ${
            this._bundles.map(function(bundle) {
              return `<script src="${host}/${path.basename(bundle.main)}"></script>`;
            }).join('\n')
          }
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

export const fragment = FactoryFragment.create({
  ns: 'application/services/front-end',
  factory: FrontEndService,
});
