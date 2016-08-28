import { IFile } from "sf-core/active-records";
import { inject } from "sf-core/decorators";
import { watchProperty } from "sf-core/observable";
import { ContainerNode } from "sf-core/markup";
import { CSSStyleSheetsDependency } from "sf-html-extension/dependencies";
import { IEntityDocument, IEntity } from "sf-core/entities";
import { Dependencies, DEPENDENCIES_NS, Injector } from "sf-core/dependencies";
import { parse as parseCSS, CSSStyleSheetExpression } from "sf-html-extension/parsers/css";

export class CSSDocument extends ContainerNode implements IEntityDocument {
  readonly root: IEntity;
  private _styleSheetExpression: CSSStyleSheetExpression;

  constructor(readonly file: IFile, readonly dependencies: Dependencies) {
    super();
    watchProperty(file, "content", this._onContentChange).trigger();
  }

  update() {
    // TODO
  }

  didMount() {
    CSSStyleSheetsDependency.findOrRegister(this.dependencies).register(this._styleSheetExpression);
  }


  willUnmount() {
    CSSStyleSheetsDependency.findOrRegister(this.dependencies).unregister(this._styleSheetExpression);
  }

  _onContentChange = (content: string) => {
    this._styleSheetExpression = parseCSS(content);
  }
}