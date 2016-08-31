import { IFile } from "sf-core/active-records";
import { inject } from "sf-core/decorators";
import { Observable } from "sf-core/observable";
import { watchProperty } from "sf-core/observable";
import { ContainerNode } from "sf-core/markup";
import { CSSStyleSheetsDependency } from "sf-html-extension/dependencies";
import { parseCSS, CSSStyleSheetExpression } from "sf-html-extension/ast";
import { Dependencies, DEPENDENCIES_NS, Injector } from "sf-core/dependencies";
import { IContainerNodeEntity, INodeEntity, EntityMetadata, IEntityDocument } from "sf-core/ast/entities";

export class CSSRootEntity extends ContainerNode implements IContainerNodeEntity {
  readonly parent: IContainerNodeEntity;
  readonly metadata: EntityMetadata = new EntityMetadata(this);
  readonly children: Array<INodeEntity>;

  constructor(private _source: CSSStyleSheetExpression, public document: IEntityDocument, readonly dependencies: Dependencies) {
    super("#css-document");
  }

  dispose() { }

  get source(): CSSStyleSheetExpression {
    return this._source;
  }

  patch(entity: CSSRootEntity) {
    this._source = entity._source;
    this.load();
  }

  flatten(): Array<INodeEntity> {
    return [this];
  }

  load() {
    const styleSheetsDependency = CSSStyleSheetsDependency.findOrRegister(this.dependencies);
    if (this._source) {
      styleSheetsDependency.unregister(this._source);
    }
    styleSheetsDependency.register(this._source);
  }

  update() {
    // TODO
  }
}