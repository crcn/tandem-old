/// <reference path="globals/express-serve-static-core/index.d.ts" />
/// <reference path="globals/express/index.d.ts" />
/// <reference path="globals/mesh/index.d.ts" />
/// <reference path="globals/mime/index.d.ts" />
/// <reference path="globals/serve-static/index.d.ts" />
/// <reference path="globals/socket.io/index.d.ts" />
/// <reference path="../node_modules/saffron-back-end/typings/index.d.ts" />


declare module "get-port" {
  function getPort():Promise<number>;

  namespace getPort {

  }

  export = getPort;
}