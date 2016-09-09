import { inject, IASTStringFormatter, Observable, IExpression } from "tandem-common";
import { HTMLFile } from "tandem-html-extension/models";
import { MimeTypes } from "tandem-html-extension/constants";
import { DocumentFile } from "tandem-front-end/models";
import { EntityFactoryDependency, Dependencies } from "tandem-common/dependencies";
import { CSSRootEntity, parseCSS, CSSRootExpression } from "tandem-html-extension/ast";
import { FileFactoryDependency, IInjectable, Injector } from "tandem-common/dependencies";

class CSSASTStringFormatter extends Observable implements IASTStringFormatter {
  public expression: IExpression;
  get content(): string {
    return this.expression.toString();
  }
}


export class CSSFile extends DocumentFile<CSSRootEntity> implements IInjectable {
  public owner: HTMLFile;
  readonly type: string = MimeTypes.CSS;
  protected createEntity(ast: CSSRootExpression) {
    return new CSSRootEntity(ast);
  }
  createASTFormatter() {
    return new CSSASTStringFormatter();
  }
  async parse(content: string) {
    return parseCSS(content);
  }
}

export const cssFileDependency = new FileFactoryDependency(MimeTypes.CSS, CSSFile);