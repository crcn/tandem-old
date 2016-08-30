import { parsePC } from "sf-paperclip-extension/ast";
import { bindable } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models";
import { MimeTypes } from "sf-paperclip-extension/constants";
import { DocumentFile } from "sf-front-end/models";
import { PCDocumentRootEntity } from "sf-paperclip-extension/ast";
import { ActiveRecordFactoryDependency } from "sf-core/dependencies";

export class PCFile extends HTMLFile {
  @bindable()
  public context: any;
  readonly type: string = MimeTypes.PC_MIME_TYPE;
  createEntity(content: string) {
    return new PCDocumentRootEntity(parsePC(content), this, this._dependencies);
  }
}

export const pcFileDependency = new ActiveRecordFactoryDependency(MimeTypes.PC_MIME_TYPE, PCFile);