import { decode } from "ent";
import { inject } from "sf-common/decorators";
import { HTMLFile } from "sf-html-extension/models/html-file";
import { EntityMetadata } from "sf-common/ast/entities";
import { HTMLNodeEntity } from "./node";
import { IHTMLNodeEntity } from "./base";
import { HTMLExpression, IHTMLValueNodeExpression } from "sf-html-extension/ast";
import { NodeSection, IDOMSection } from "sf-html-extension/dom";
import { DEPENDENCIES_NS, Dependencies, Injector } from "sf-common/dependencies";

export abstract class HTMLValueNodeEntity<T extends HTMLExpression & IHTMLValueNodeExpression> extends HTMLNodeEntity<T> implements IHTMLNodeEntity {

  private _value: any;

  protected mapSourceChildren() {
    return [];
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
    if (this.section instanceof NodeSection) {
      this.section.targetNode.nodeValue = value;
    }
  }

  protected updateFromSource() {
    this.value = this.source.value;
  }

  protected abstract createSection();

}