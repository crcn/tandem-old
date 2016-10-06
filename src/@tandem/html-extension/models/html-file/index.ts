import * as pretty from "pretty";
import { parseMarkup } from "@tandem/html-extension/lang";
import { MimeTypes } from "@tandem/html-extension/constants";
import { IASTNode } from "@tandem/common/lang";
import { DocumentFile } from "@tandem/editor/models/base";
import { Dependencies } from "@tandem/common/dependencies";
import { FileFactoryDependency } from "@tandem/common/dependencies";
import { HTMLDocumentRootEntity, HTMLFragmentExpression, MarkupExpressionLoader } from "@tandem/html-extension/lang";

export class HTMLFile extends DocumentFile<HTMLDocumentRootEntity> {
  readonly type: string = MimeTypes.HTML;
  createEntity(ast: HTMLFragmentExpression) {
    return new HTMLDocumentRootEntity(ast);
  }

  createExpressionLoader(): MarkupExpressionLoader {
    return new MarkupExpressionLoader();
  }
}

export const htmlFileModelDependency = new FileFactoryDependency(MimeTypes.HTML, HTMLFile);

