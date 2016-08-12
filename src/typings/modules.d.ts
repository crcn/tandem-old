declare module "gaze" {
  function gaze(path:any, watcher:Function):any;
  namespace gaze {

  }
  export = gaze;
}

declare module "package-path" {
  function getPakagePath(rest:any):any;
  namespace getPakagePath {
    function sync(arg:any):any;
  }
  export = getPakagePath;
}

declare module "mesh-array-ds-bus" {
  import { Bus } from "mesh";
  class MeshArrayDsBus extends Bus {
    constructor(target:Array<any>, mutators?:any);
    static create(target:Array<any>, mutators?:any):MeshArrayDsBus;
  }
  namespace MeshArrayDsBus {

  }
  export = MeshArrayDsBus;
}

declare module "mongoid-js" {

  function mongoid(): string;

  namespace mongoid {

  }

  export = mongoid;
}