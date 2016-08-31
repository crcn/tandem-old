import { IFile } from "sf-core/active-records";
import { inject } from "sf-core/decorators";
import { Observable } from "sf-core/observable";
import { MetadataKeys } from "sf-front-end/constants";
import { watchProperty } from "sf-core/observable";
import { ContainerNode } from "sf-core/markup";
import { CSSStyleSheetsDependency } from "sf-html-extension/dependencies";
import { parseCSS, CSSStyleSheetExpression } from "sf-html-extension/ast";
import { Dependencies, DEPENDENCIES_NS, Injector } from "sf-core/dependencies";
import { IContainerNodeEntity, BaseNodeEntity, BaseContainerNodeEntity, INodeEntity, EntityMetadata, IEntityDocument } from "sf-core/ast/entities";

export class CSSRootEntity extends BaseContainerNodeEntity<CSSStyleSheetExpression> implements IContainerNodeEntity {
  readonly parent: IContainerNodeEntity;
  readonly children: Array<INodeEntity>;

  constructor(source: CSSStyleSheetExpression, public document: IEntityDocument, protected _dependencies: Dependencies) {
    super(source);
  }

  mapSourceChildNodes() {
    return this.source.rules;
  }

  getInitialMetadata() {
    return Object.assign(super.getInitialMetadata(), {
      [MetadataKeys.HIDDEN]: true
    });
  }
}