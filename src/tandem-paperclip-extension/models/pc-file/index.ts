import { bindable } from "tandem-common/decorators";
import { HTMLFile } from "tandem-html-extension/models";
import { MimeTypes } from "tandem-paperclip-extension/constants";
import { DocumentFile } from "tandem-front-end/models";
import { HTMLFragmentExpression } from "tandem-html-extension/ast";
import { parsePC, PCDocumentRootEntity } from "tandem-paperclip-extension/ast";
import { FileFactoryDependency, Dependencies } from "tandem-common/dependencies";

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