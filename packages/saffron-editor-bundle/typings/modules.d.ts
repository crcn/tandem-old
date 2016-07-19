declare module "toarray" {
  function toarray(value:any):Array<any>;
  namespace toarray {

  }
  export = toarray;
}

declare module "mesh-array-ds-bus" {
  import { Bus } from 'mesh';
  class ArrayDsBus extends Bus {
    static create(target:Array<any>, modifiers:any):ArrayDsBus;
  }

  namespace ArrayDsBus {

  }

  export = ArrayDsBus;
}