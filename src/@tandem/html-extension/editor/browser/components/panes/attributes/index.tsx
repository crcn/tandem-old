import * as React from "react";
import { Workspace } from "@tandem/editor/browser";
import { DOMElements } from "@tandem/html-extension/collections";
import { HashInputComponent } from "@tandem/html-extension/editor/browser/components/common";
import { SyntheticHTMLElement, SyntheticDOMAttribute } from "@tandem/synthetic-browser";

export class EntityAttributesPaneComponent extends React.Component<{ workspace: Workspace }, any> {

  addAttribute = () => {
    this.items.setAttribute("", "");
  }

  setAttribute = (name: string, value: any, oldName?: string) => {
    if(name != null) this.items.setAttribute(name, value);
    if (oldName != null) {
      this.items.removeAttribute(oldName);
    }
  }

  get items(): DOMElements {
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
      <HashInputComponent items={items.attributes} setKeyValue={this.setAttribute} />
    </div>;
  }
}
