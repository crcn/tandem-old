import { CSSFile } from "@tandem/html-extension/models";
import { MimeTypes } from "@tandem/scss-extension/constants";
import { DocumentFile } from "@tandem/editor/models";
import { EntityFactoryDependency, FileFactoryDependency, Dependencies } from "@tandem/common";
import { parseSCSS, SCSSRootExpression, SCSSRootEntity, SCSSExpressionLoader } from "@tandem/scss-extension/lang";

export class SCSSFile extends CSSFile {
  readonly type: string = MimeTypes.SCSS;
  public imported: boolean = false;

  protected createEntity(ast: SCSSRootExpression) {
    return new SCSSRootEntity(ast);
  }

  createExpressionLoader() {
    return new SCSSExpressionLoader();
  }
}

export const scssFileDependency = new FileFactoryDependency(MimeTypes.SCSS, SCSSFile);