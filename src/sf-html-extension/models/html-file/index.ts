import * as pretty from "pretty";
import { parseHTML } from "sf-html-extension/ast";
import { MimeTypes } from "sf-html-extension/constants";
import { IExpression } from "sf-core/ast";
import { DocumentFile } from "sf-front-end/models/base";
import { Dependencies } from "sf-core/dependencies";
import { ActiveRecordFactoryDependency } from "sf-core/dependencies";
import { HTMLDocumentRootEntity, HTMLFragmentExpression } from "sf-html-extension/ast";

export class HTMLFile extends DocumentFile<HTMLDocumentRootEntity> {
  readonly type: string = MimeTypes.HTML_MIME_TYPE;
  parse(content: string) {
    return parseHTML(content);
  }
  createEntity(ast: HTMLFragmentExpression, dependencies: Dependencies) {
    return new HTMLDocumentRootEntity(ast, this, dependencies);
  }
  getFormattedContent(ast: HTMLFragmentExpression) {
    return pretty(ast.toString());
  }
}

export const htmlFileModelDependency = new ActiveRecordFactoryDependency(MimeTypes.HTML_MIME_TYPE, HTMLFile);

