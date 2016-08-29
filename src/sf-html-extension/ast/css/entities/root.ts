import { IFile } from "sf-core/active-records";
import { inject } from "sf-core/decorators";
import { watchProperty } from "sf-core/observable";
import { ContainerNode } from "sf-core/markup";
import { CSSStyleSheetsDependency } from "sf-html-extension/dependencies";
import { parseCSS, CSSStyleSheetExpression } from "sf-html-extension/ast";
import { Dependencies, DEPENDENCIES_NS, Injector } from "sf-core/dependencies";
import { IEntity, EntityMetadata, IEntityDocument } from "sf-core/ast/entities";

export class CSSRootEntity implements IEntity {
  readonly parent: IEntity;
  private _styleSheetExpression: CSSStyleSheetExpression;
  readonly metadata: EntityMetadata = new EntityMetadata(this);

  constructor(private _source: string, public document: IEntityDocument, readonly dependencies: Dependencies) {

  }

  dispose() {

  }


  get source(): string {
    return this._source;
  }

  patch(entity: CSSRootEntity) {
    this._source = entity._source;
    this.load();
  }

  flatten(): Array<IEntity> {
    return [this];
  }

  load() {
    const styleSheetsDependency = CSSStyleSheetsDependency.findOrRegister(this.dependencies);
    if (this._styleSheetExpression) {
      styleSheetsDependency.unregister(this._styleSheetExpression);
    }
    this._styleSheetExpression = parseCSS(this.source);
    styleSheetsDependency.register(this._styleSheetExpression);
  }

  update() {
    // TODO
  }

}