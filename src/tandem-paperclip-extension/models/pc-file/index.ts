import { bindable } from "tandem-common/decorators";
import { HTMLFile } from "tandem-html-extension/models";
import { MimeTypes } from "tandem-paperclip-extension/constants";
import { DocumentFile } from "tandem-front-end/models";
import { FileFactoryDependency } from "tandem-common/dependencies";
import { HTMLFragmentExpression } from "tandem-html-extension/ast";
import { PCDocumentRootEntity } from "tandem-paperclip-extension/ast";

export class PCFile extends HTMLFile {
  readonly type: string = MimeTypes.PC_MIME_TYPE;
  createEntity(ast: HTMLFragmentExpression) {
    return new PCDocumentRootEntity(ast);
  }
}

export const pcFileDependency = new FileFactoryDependency(MimeTypes.PC_MIME_TYPE, PCFile);