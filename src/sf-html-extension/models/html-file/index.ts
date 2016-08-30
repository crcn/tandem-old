import * as pretty from "pretty";
import { parseHTML } from "sf-html-extension/ast";
import { MimeTypes } from "sf-html-extension/constants";
import { DocumentFile } from "sf-front-end/models/base";
import { HTMLDocumentRootEntity } from "sf-html-extension/ast";
import {
  ActiveRecordFactoryDependency
} from "sf-core/dependencies";

export class HTMLFile extends DocumentFile<HTMLDocumentRootEntity> {
  readonly type: string = MimeTypes.HTML_MIME_TYPE;
  createEntity(content: string) {
    return new HTMLDocumentRootEntity(parseHTML(content), this, this._dependencies.clone());
  }

  formatContent(content: string) {
    return pretty(content);
  }
}

export const htmlFileModelDependency = new ActiveRecordFactoryDependency(MimeTypes.HTML_MIME_TYPE, HTMLFile);

