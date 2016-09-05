import { CSSFile } from "tandem-html-extension/models";
import { MimeTypes } from "tandem-scss-extension/constants";
import { parseSCSS } from "tandem-scss-extension/ast";
import { DocumentFile } from "tandem-front-end/models";
import { EntityFactoryDependency, FileFactoryDependency, Dependencies } from "tandem-common";

export class SCSSFile extends CSSFile {
  readonly type: string = MimeTypes.SCSS;
  async parse(content: string) {
    return parseSCSS(content);
  }
}

export const scssFileDependency = new FileFactoryDependency(MimeTypes.SCSS, CSSFile);