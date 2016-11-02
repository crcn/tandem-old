import "@tandem/editor/browser/styles.ts";
import "./index.scss";

import "reflect-metadata";

import * as React from "react";
import { DOMElements } from "@tandem/html-extension/collections";
import { PaneComponent } from "@tandem/editor/browser/components/common";
import { reactPreview, Metadata } from "@tandem/common";
import { Workspace, GutterComponent } from "@tandem/editor/browser";
import {
  SyntheticWindow,
  SyntheticLocation,
  SyntheticHTMLElement,
  SyntheticDOMAttribute,
} from "@tandem/synthetic-browser";


class AttributeComponent extends React.Component<{ attribute: SyntheticDOMAttribute, setAttribute: (key: string, value: string) => any}, { currentEdit: any }> {

  onChange = (event: React.KeyboardEvent<any>) => {
    this.props.setAttribute(this.props.attribute.name, (event.target as any).value);
  }

  render() {
    const { attribute } = this.props;
    return <div className="row">
      <div className="col-xs-3 no-wrap" title={attribute.name}>
        {attribute.name}
      </div>
      <div className="col-xs-9">
        <input type="text" value={attribute.value} onChange={this.onChange}></input>
      </div>
    </div>;
  }
}

@reactPreview(() => {
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
  render() {
    const { selection } = this.props.workspace;
    const items = DOMElements.fromArray(selection);
    if (!items.length) return null;

    return <PaneComponent title="Attributes">
      <div className="container">
        {
          items.attributes.map((attribute) => {
            return <AttributeComponent key={attribute.name} attribute={attribute} setAttribute={items.setAttribute.bind(items)} />;
          })
        }
      </div>
    </PaneComponent>
  }
}
