import * as pretty from "pretty";
import { inject } from "sf-core/decorators";
import { DocumentFile } from "sf-front-end/models";
import { MimeTypes } from "sf-html-extension/constants";
import { EntityFactoryDependency, Dependencies } from "sf-core/dependencies";
import { CSSRootEntity, parseCSS, CSSStyleSheetExpression } from "sf-html-extension/ast";
import { ActiveRecordFactoryDependency, IInjectable, Injector } from "sf-core/dependencies";

export class CSSFile extends DocumentFile<CSSRootEntity> implements IInjectable {
  readonly type: string = MimeTypes.CSS_MIME_TYPE;
  protected createEntity(ast: CSSStyleSheetExpression, dependencies: Dependencies) {
    return new CSSRootEntity(ast, this, dependencies);
  }
  parse(content: string) {
    return parseCSS(content);
  }
  getFormattedContent(ast: CSSStyleSheetExpression) {
    return pretty(ast.toString());
  }
}

export const cssFileDependency = new ActiveRecordFactoryDependency(MimeTypes.CSS_MIME_TYPE, CSSFile);