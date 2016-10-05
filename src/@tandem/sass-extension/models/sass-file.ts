import { CSSFile } from "@tandem/html-extension/models";
import { MimeTypes } from "@tandem/sass-extension/constants";
import { DocumentFile } from "@tandem/editor/models";
import { EntityFactoryDependency, FileFactoryDependency, Dependencies } from "@tandem/common";
import { parseSass, SassRootExpression, SassRootEntity, SassExpressionLoader } from "@tandem/sass-extension/lang";

export class SassFile extends CSSFile {
  readonly type: string = MimeTypes.Sass;
  public imported: boolean = false;

  protected createEntity(ast: SassRootExpression) {
    return new SassRootEntity(ast);
  }

  createExpressionLoader() {
    return new SassExpressionLoader();
  }
}

export const sassFileDependency = new FileFactoryDependency(MimeTypes.Sass, SassFile);