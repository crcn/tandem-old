import { ITyped } from "sf-core/object";
import { IHTMLEntity } from "./base";
import { IDOMSection } from "sf-html-extension/dom";
import { BaseNodeEntity } from "sf-core/ast";

export abstract class HTMLNodeEntity<T extends ITyped> extends BaseNodeEntity<T> implements IHTMLEntity {
  private _section: IDOMSection;

  initialize() {
    this._section = this.createSection();
    super.initialize();
  }

  get section(): IDOMSection {
    return this._section;
  }

  abstract createSection();
}
