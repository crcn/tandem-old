import { bindable } from "sf-common/decorators";
import { HTMLFile } from "sf-html-extension/models";
import { MimeTypes } from "sf-paperclip-extension/constants";
import { DocumentFile } from "sf-front-end/models";
import { HTMLFragmentExpression } from "sf-html-extension/ast";
import { parsePC, PCDocumentRootEntity } from "sf-paperclip-extension/ast";
import { FileFactoryDependency, Dependencies } from "sf-common/dependencies";

export class PCFile extends HTMLFile {
  @bindable()
  public context: any;
  readonly type: string = MimeTypes.PC_MIME_TYPE;
  createEntity(ast: HTMLFragmentExpression, dependencies: Dependencies) {
    return new PCDocumentRootEntity(ast, this, dependencies);
  }
  parse(content: string) {
    return parsePC(content);
  }
}

export const pcFileDependency = new FileFactoryDependency(MimeTypes.PC_MIME_TYPE, PCFile);