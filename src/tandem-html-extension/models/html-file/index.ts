import * as pretty from "pretty";
import { parseHTML } from "tandem-html-extension/ast";
import { MimeTypes } from "tandem-html-extension/constants";
import { IExpression } from "tandem-common/ast";
import { DocumentFile } from "tandem-front-end/models/base";
import { Dependencies } from "tandem-common/dependencies";
import { FileFactoryDependency } from "tandem-common/dependencies";
import { HTMLDocumentRootEntity, HTMLFragmentExpression, HTMLExpressionLoader } from "tandem-html-extension/ast";

export class HTMLFile extends DocumentFile<HTMLDocumentRootEntity> {
  readonly type: string = MimeTypes.HTML;
  createEntity(ast: HTMLFragmentExpression) {
    return new HTMLDocumentRootEntity(ast);
  }

  createExpressionLoader(): HTMLExpressionLoader {
    return new HTMLExpressionLoader();
  }
}

export const htmlFileModelDependency = new FileFactoryDependency(MimeTypes.HTML, HTMLFile);

