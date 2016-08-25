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

declare module "pretty" {
  function pretty(source: string): string;

  namespace pretty {

  }

  export = pretty;
}

declare module "ent" {
  function encode(source: string): string;
  function decode(source: string): string;
}

declare module "react-input-autosize" {
  class AutosizeInput extends __React.Component<any, any> {

  }

  namespace AutosizeInput {

  }

  export = AutosizeInput;
}

declare module "store" {
  export function get(key: string): any;
  export function set(key: string, value: any);
}