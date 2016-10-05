import {
  MimeTypes as CommonMimeTypes,
} from "@tandem/common";

import {
  BaseModule,
  ModuleFactoryDependency
} from "@tandem/sandbox";

import { MimeTypes } from "../constants";

export class JSSassModule extends BaseModule {
  async evaluate() {
    const { document } = this.sandbox.global;
    const element = document.createElement("style");
    element.innerHTML = this.content;
    document.head.appendChild(element);
  }
}

export const jsSassModuleFactoryDependency = new ModuleFactoryDependency(CommonMimeTypes.JavaScript, MimeTypes.Sass, JSSassModule);
