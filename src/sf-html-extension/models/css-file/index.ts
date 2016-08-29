import { CSSDocument } from "sf-html-extension/ast";
import { DocumentFile } from "sf-front-end/models";
import { CSS_MIME_TYPE } from "sf-html-extension/constants";
import { inject } from "sf-core/decorators";
import { DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { ActiveRecordFactoryDependency, IInjectable, Injector } from "sf-core/dependencies";

export class CSSFile extends DocumentFile<CSSDocument> implements IInjectable {
  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;
  didInject() {
    this._document = new CSSDocument(this, this._dependencies);
  }
}

export const cssFileDependency = new ActiveRecordFactoryDependency(CSS_MIME_TYPE, CSSFile);