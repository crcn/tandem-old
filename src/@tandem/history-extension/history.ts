import {
  inject,
  IInjectable,
  APPLICATION_SINGLETON_NS
} from "@tandem/common";


export class ModuleHistory implements IInjectable {

  constructor() {

  }

  get length() {
    return 0;
  }

  get position() {
    return 0;
  }

  didInject() {

  }
}