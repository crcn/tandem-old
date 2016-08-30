import { bindable } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models";
import { MimeTypes } from "sf-paperclip-extension/constants";
import { DocumentFile } from "sf-front-end/models";
import { HTMLFragmentExpression } from "sf-html-extension/ast";
import { parsePC, PCDocumentRootEntity } from "sf-paperclip-extension/ast";
import { ActiveRecordFactoryDependency } from "sf-core/dependencies";

export class PCFile extends HTMLFile {
  @bindable()
  public context: any;
  readonly type: string = MimeTypes.PC_MIME_TYPE;
  createEntity(ast: HTMLFragmentExpression) {
    return new PCDocumentRootEntity(ast, this, this._dependencies);
  }
  parse(content: string) {
    return parsePC(content);
  }
}

export const pcFileDependency = new ActiveRecordFactoryDependency(MimeTypes.PC_MIME_TYPE, PCFile);