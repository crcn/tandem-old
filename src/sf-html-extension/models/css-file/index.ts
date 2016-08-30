import { inject } from "sf-core/decorators";
import { DocumentFile } from "sf-front-end/models";
import { MimeTypes } from "sf-html-extension/constants";
import { CSSRootEntity, parseCSS } from "sf-html-extension/ast";
import { ActiveRecordFactoryDependency, IInjectable, Injector } from "sf-core/dependencies";

export class CSSFile extends DocumentFile<CSSRootEntity> implements IInjectable {
  readonly type: string = MimeTypes.CSS_MIME_TYPE;
  protected createEntity(content: string) {
    return new CSSRootEntity(parseCSS(content), this, this._dependencies);
  }
}

export const cssFileDependency = new ActiveRecordFactoryDependency(MimeTypes.CSS_MIME_TYPE, CSSFile);