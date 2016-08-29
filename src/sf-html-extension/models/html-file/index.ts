import { IActor } from "sf-core/actors";
import { IEntity } from "sf-core/ast/entities";
import { BubbleBus } from "sf-core/busses";
import { parseHTML } from "sf-html-extension/ast";
import { Observable } from "sf-core/observable";
import { DocumentFile } from "sf-front-end/models/base";
import { HTML_MIME_TYPE } from "sf-html-extension/constants";
import { inject, bindable } from "sf-core/decorators";
import { HTMLDocumentRootEntity } from "sf-html-extension/ast";
import { IActiveRecord, ActiveRecord } from "sf-core/active-records";
import { PropertyChangeAction, DSUpdateAction } from "sf-core/actions";
import {
  IInjectable,
  MAIN_BUS_NS,
  Dependencies,
  DEPENDENCIES_NS,
  ClassFactoryDependency,
  ActiveRecordFactoryDependency,
} from "sf-core/dependencies";

export class HTMLFile extends DocumentFile<HTMLDocumentRootEntity> {
  readonly type: string = HTML_MIME_TYPE;
  @inject(DEPENDENCIES_NS)
  private _dependencies: Dependencies;
  createEntity(content: string) {
    return new HTMLDocumentRootEntity(parseHTML(content), this, this._dependencies.clone());
  }
}

export const htmlFileModelDependency = new ActiveRecordFactoryDependency(HTML_MIME_TYPE, HTMLFile);

