import { decode } from "ent";
import { inject } from "tandem-common/decorators";
import { HTMLFile } from "tandem-html-extension/models/html-file";
import { EntityMetadata } from "tandem-common/ast/entities";
import { HTMLNodeEntity } from "./node";
import { IHTMLNodeEntity } from "./base";
import { NodeSection, IDOMSection } from "tandem-html-extension/dom";
import { HTMLExpression, IHTMLValueNodeExpression } from "tandem-html-extension/ast";
import { DEPENDENCIES_NS, Dependencies, Injector } from "tandem-common/dependencies";

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