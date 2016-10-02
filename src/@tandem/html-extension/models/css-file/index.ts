import { inject, Observable, IASTNode } from "@tandem/common";
import { HTMLFile } from "@tandem/html-extension/models";
import { MimeTypes } from "@tandem/html-extension/constants";
import { DocumentFile } from "@tandem/front-end/models";
import { CSSRootEntity, parseCSS, CSSRootExpression, CSSExpressionLoader } from "@tandem/html-extension/lang";
import {
  Injector,
  IInjectable,
  Dependencies,
  FileFactoryDependency,
  EntityFactoryDependency,
} from "@tandem/common";

export class CSSFile extends DocumentFile<CSSRootEntity> implements IInjectable {
  public owner: HTMLFile;
  readonly type: string = MimeTypes.CSS;
  protected createEntity(ast: CSSRootExpression) {
    return new CSSRootEntity(ast);
  }
  createExpressionLoader(): any {
    return new CSSExpressionLoader();
  }
}

export const cssFileDependency = new FileFactoryDependency(MimeTypes.CSS, CSSFile);