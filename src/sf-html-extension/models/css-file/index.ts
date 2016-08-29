import { inject } from "sf-core/decorators";
import { DocumentFile } from "sf-front-end/models";
import { CSS_MIME_TYPE } from "sf-html-extension/constants";
import { watchProperty } from "sf-core/observable";
import { CSSRootEntity } from "sf-html-extension/ast";
import { DEPENDENCIES_NS, Dependencies } from "sf-core/dependencies";
import { ActiveRecordFactoryDependency, IInjectable, Injector } from "sf-core/dependencies";

export class CSSFile extends DocumentFile<CSSRootEntity> implements IInjectable {
  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;
  protected createEntity(content: string) {
    return new CSSRootEntity(content, this, this._dependencies.clone());
  }
}

export const cssFileDependency = new ActiveRecordFactoryDependency(CSS_MIME_TYPE, CSSFile);