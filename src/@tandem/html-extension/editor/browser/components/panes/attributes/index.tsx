import * as React from "react";
import { Workspace } from "@tandem/editor/browser";
import { DOMElements } from "@tandem/html-extension/collections";
import { ApplyFileEditAction } from "@tandem/sandbox";
import { HashInputComponent } from "@tandem/html-extension/editor/browser/components/common";
import { BaseApplicationComponent } from "@tandem/common";
import { SyntheticHTMLElement, SyntheticDOMAttribute } from "@tandem/synthetic-browser";

export class EntityAttributesPaneComponent extends BaseApplicationComponent<{ workspace: Workspace }, any> {

  addAttribute = () => {
    this.items.setAttribute("", "");
  }

  setAttribute = (name: string, value: any, oldName?: string) => {
    if(name != null) this.items.setAttribute(name, value);
    if (oldName != null) {
      this.items.removeAttribute(oldName);
    }

    for (const item of this.items) {
      const edit = item.createEdit();
      this.bus.execute(new ApplyFileEditAction(edit.actions));
    }
  }

  get items(): DOMElements<any> {
    if (!this.props.workspace) return new DOMElements();
    const { selection } = this.props.workspace;
    return DOMElements.fromArray(selection);
  }

  render() {
    const items = this.items;
    if (!items.length) return null;

    return <div className="td-pane">
      <div className="td-section-header">
        Attributes
        <div className="controls">
          <span onClick={this.addAttribute}>+</span>
        </div>
      </div>
      { items.attributes.length ? <HashInputComponent items={items.attributes} setKeyValue={this.setAttribute} /> : this.renderAddButton() }
    </div>;
  }

  renderAddButton() {

    // TODO: temporary - make this prettier.
    return <div className="container">
      <div onClick={this.addAttribute} style={{ cursor: "pointer" }}>Add one</div>
    </div>;
  }
}
