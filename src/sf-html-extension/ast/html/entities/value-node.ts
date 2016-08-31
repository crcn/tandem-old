import { decode } from "ent";
import { inject } from "sf-core/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { ValueNode } from "sf-core/markup";
import { EntityMetadata } from "sf-core/ast/entities";
import { IHTMLValueNodeExpression } from "sf-html-extension/ast";
import { NodeSection, IDOMSection } from "sf-html-extension/dom";
import { IHTMLEntity, IHTMLContainerEntity } from "./base";
import { IEntityDocument, BaseValueNodeEntity } from "sf-core/ast";
import { DEPENDENCIES_NS, Dependencies, Injector } from "sf-core/dependencies";

export abstract class HTMLValueNodeEntity<T extends IHTMLValueNodeExpression> extends BaseValueNodeEntity<T> implements IHTMLEntity {

  @inject(DEPENDENCIES_NS)
  protected _dependencies: Dependencies;

  private _section: IDOMSection;
  public document: HTMLFile;

  get section() {
    return this._section;
  }

  protected initialize() {
    super.initialize();
    this._section = this.createSection();
  }

  protected onValueChange(newValue: any, oldValue: any) {
    super.onValueChange(newValue, oldValue);
    if (this.section instanceof NodeSection) {
      this.section.targetNode.nodeValue = decode(newValue);
    }
  }

  protected willUnmount() {
    this.section.remove();
  }

  clone() {
    const clone = this._clone();
    if (this._dependencies) Injector.inject(clone, this._dependencies);
    return clone;
  }

  protected abstract createSection();
  protected abstract _clone();
}
