import "@tandem/editor/browser/styles.ts";
import "./index.scss";

import "reflect-metadata";

import * as React from "react";
import { DOMElements } from "@tandem/html-extension/collections";
import { reactPreview, Metadata } from "@tandem/common";
import { FocusComponent } from "@tandem/editor/browser/components/common";
import { Workspace, GutterComponent } from "@tandem/editor/browser";
import {
  SyntheticWindow,
  SyntheticLocation,
  SyntheticHTMLElement,
  SyntheticDOMAttribute,
} from "@tandem/synthetic-browser";


class AttributeComponent extends React.Component<{ attribute: SyntheticDOMAttribute, setAttribute: (key: string, value: string) => any, edit? : boolean, onValueEnter: (attribute: SyntheticDOMAttribute) => any }, { editName: boolean }> {

  constructor() {
    super();
    this.state = { editName: false };
  }

  onChange = (event: React.KeyboardEvent<any>) => {
    this.props.setAttribute(this.props.attribute.name, (event.target as any).value);
  }

  editName = () => {
    this.setState({ editName: true });
  }

  onNameInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/13|27/.test(String(event.keyCode))) return;

    if (event.keyCode === 13) {
      this.setName(event);
    }

    this.setState({ editName: false });
  }

  setName = (event: any) => {
    const value = this.props.attribute.value;
    if (this.props.attribute.name != null) {
      this.props.setAttribute(this.props.attribute.name, undefined);
    }
    if (event.currentTarget.value) {
      this.props.setAttribute(event.currentTarget.value, value);
    }
  }

  onValueKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      this.props.onValueEnter(this.props.attribute);
    }
  }

  onNameInputBlur = (event: React.FocusEvent<any>) => {
    this.setName(event);
    this.setState({ editName: false });
  }

  render() {
    const { attribute } = this.props;
    return <div className="row">
      <div className="col-xs-3 no-wrap" title={attribute.name} onDoubleClick={this.editName}>
        { !this.props.attribute.name || this.state.editName ? <FocusComponent select={true}><input type="text" defaultValue={attribute.name} onBlur={this.onNameInputBlur} onKeyDown={this.onNameInputKeyDown}></input></FocusComponent> : <label>{attribute.name}</label> }
      </div>
      <div className="col-xs-9">
        <input type="text" value={attribute.value} onChange={this.onChange} onKeyDown={this.onValueKeyDown}></input>
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

  constructor() {
    super();
  }

  addAttribute = () => {
    this.items.setAttribute("", "");
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
        <div className="pull-right">
          <span onClick={this.addAttribute}>+</span>
        </div>
      </div>
      <div className="container">
        {
          [...items.attributes].map((attribute, index, attributes) => {
            if (!attribute) return null;
            return <AttributeComponent key={index} attribute={attribute} setAttribute={items.setAttribute.bind(items)} onValueEnter={() => {
              if (index === attributes.length -1) this.addAttribute();
            }} />;
          })
        }
      </div>
    </div>;
  }
}
