import { reactEditorPreview } from "@tandem/editor/browser/preview";

import * as React from "react";
import { DOMElements } from "@tandem/html-extension/collections";
import { FocusComponent } from "@tandem/editor/browser/components/common";
import { reactPreview, Metadata } from "@tandem/common";
import { Workspace, GutterComponent } from "@tandem/editor/browser";
import { HashInputComponent } from "@tandem/html-extension/editor/browser/components/common";
import {
  SyntheticWindow,
  SyntheticLocation,
  SyntheticHTMLElement,
  SyntheticDOMAttribute,
} from "@tandem/synthetic-browser";


@reactEditorPreview(() => {
  const workspace = new Workspace();
  const window = new SyntheticWindow(new SyntheticLocation("test"));
  (window.document.body as SyntheticHTMLElement).innerHTML = `
    <div class="test" id="some id" a-very-long-attribute="something" />
  `;
  workspace.select(window.document.body.firstChild);
  return <GutterComponent>
    <EntityAttributesPaneComponent workspace={workspace} />
  </GutterComponent>
})
export class EntityAttributesPaneComponent extends React.Component<{ workspace: Workspace }, any> {

  addAttribute = () => {

  }

  setAttribute = (name: string, value: any, oldName?: string) => {
    this.items.setAttribute(name, value);
    if (oldName) {
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
