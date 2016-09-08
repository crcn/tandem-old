import { CSSFile } from "tandem-html-extension/models";
import { MimeTypes } from "tandem-scss-extension/constants";
import { DocumentFile } from "tandem-front-end/models";
import { parseSCSS, SCSSRootExpression, SCSSRootEntity } from "tandem-scss-extension/ast";
import { EntityFactoryDependency, FileFactoryDependency, Dependencies } from "tandem-common";

export class SCSSFile extends CSSFile {
  readonly type: string = MimeTypes.SCSS;
  public imported: boolean = false;

  protected createEntity(ast: SCSSRootExpression) {
    return new SCSSRootEntity(ast);
  }

  async parse(content: string) {
    return parseSCSS(content);
  }
}

export const scssFileDependency = new FileFactoryDependency(MimeTypes.SCSS, SCSSFile);