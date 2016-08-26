// import "./layer-input.scss";
import "./index.scss";

import * as React from "react";

import * as AutosizeInput from "react-input-autosize";
import { SelectAction } from "sf-front-end/actions";
import { VisibleHTMLElementEntity } from "sf-html-extension/models";
import { LayerLabelComponentFactoryDependency } from "sf-front-end/dependencies";

class FocusComponent extends React.Component<any, any> {
  render() {
    return this.props.children;
  }
}

const VOID_ELEMENTS = [];

import {
  SetToolAction
} from "sf-front-end/actions";

const CLASS_NAME_PRIORITY = [
  "title",
  "name",
  "id",
  "class",
  "src"
];

class ElementLayerLabelComponent extends React.Component<any, any> {

  private _updateCount: number;

  constructor() {
    super();
    this._updateCount = 0;
    this.state = {};
  }

  editHTML() {
    // TODO - uncomment this when this is fixed
    return;
    this.setState({
      editTagName: true,
      source: this.getHTMLValue()
    });
  }

  setState(state) {
    super.setState(state);
  }

  addChild(event) {
    this.props.entity.layerExpanded = true;

    // TODO - this needs to be generalized. Specific to
    // HTML right now
    const child = this.props.app.fragments.queryOne("entities/element").factory.create({
      tagName: "div",
      editLayerSource: true
    });

    this.props.entity.children.push(
      child
    );

    this.props.app.notifier.notify(
      new SelectAction([child])
    );

    event.stopPropagation();
  }

  componentWillMount() {
    if (this.props.entity.editLayerSource) {
      this.editHTML();
    }
  }

  render() {
    const entity     = this.props.entity;
    const editSource = entity.editLayerSource;
    const connectDragSource = this.props.connectDragSource;

    const buffer = [
      <span className="m-element-layer-label--tag" key="lt">&lt;</span>
    ];

    if (this.state.editTagName) {
      buffer.push(this.renderHTMLInput());
    } else {
      buffer.push(this.state.editTagName ?
        this.renderHTMLInput() :
        <span className="m-element-layer-label--tag-name" key="tagName">{entity.nodeName.toLowerCase()}</span>
      );

      // filter them, and remove the items we do not want to display
      // (for now)
      const attrs = entity.attributes.concat().sort(function (a, b) {
        return a.name > b.name ? -1 : 1;
      }).filter((a) => CLASS_NAME_PRIORITY.indexOf(a.name) !== -1);

      attrs.forEach(function (attr) {
        const k = attr.name;
        buffer.push(
          <span className="m-element-layer-label--key" key={k + 1}>&nbsp;{k}</span>,
          <span className="m-element-layer-label--operator" key={k + 2}>=</span>,
          <span className="m-element-layer-label--string" key={ k + 3}>"{attr.value}"</span>
        );
      });
    }

    buffer.push(
      <span className="m-element-layer-label--tag" key="et">
        { entity.childNodes.length === 0 ? " /" : void 0 }
        &gt;
      </span>
    );


    return <div className="m-label m-element-layer-label" onDoubleClick={this.editHTML.bind(this)}>
      { connectDragSource(<span>{buffer}</span>) } { !~VOID_ELEMENTS.indexOf(entity.nodeName.toLowerCase()) ? <span className="m-element-layer-label--add-child-button" onClick={this.addChild.bind(this)}>+</span> : void 0 }
    </div>;
  }

  onInputKeyDown(event) {
    if (event.keyCode === 13) {
      this.doneEditing(null);
    }
  }

  onInputChange(event) {
    this.setState({
      source: event.target.value
    });
  }

  doneEditing(event) {

    const entity = this.props.entity;

    const source = String(this.state.source || "").trim();

    // dumb parser here...
    const tagName = source.match(/\w+/);
    const attrRegExp = /\s+(\w+)(=[""](.*?)[""])?/g;
    const attributes = source.match(attrRegExp) || [];

    if (tagName) {
      entity.tagName = tagName[0];
    }

    // turn it off so it doesn"t get copied & pasted
    entity.editLayerSource = false;

    // delete ALL attributes
    for (const key in entity.attributes) {
      if (key === "style") continue;
      entity.setAttribute(key, void 0);
    }

    // reset attributes with inserted text
    attributes.forEach(function(attr) {
      const match = attr.match(new RegExp(attrRegExp.source));
      entity.setAttribute(match[1], match[3]);
    });

    // TODO - this smells funny here - need to reset selection
    // otherwise stuff breaks.
    this.props.app.notifier.notify(new SelectAction([entity]));

    this.setState({
      editTagName: false
    });
  }

  onInputFocus(event) {
    event.target.select();
  }

  renderHTMLInput() {
    return <FocusComponent key="input"><AutosizeInput
      type="text"
      className="m-layer-label-input"
      onFocus={this.onInputFocus.bind(this)}
      value={this.state.source}
      onChange={this.onInputChange.bind(this)}
      onBlur={this.doneEditing.bind(this)}
      onKeyDown={this.onInputKeyDown.bind(this)}
    /></FocusComponent>;
  }

  getHTMLValue() {

    const entity = this.props.entity;
    const buffer = [entity.tagName];

    for (const key in entity.attributes) {
      const value = entity.attributes[key];
      if (typeof value === "object") continue;
      buffer.push(" ", key, "=", "\"", value, "\"");
    }

    return buffer.join("");
  }
}

export default ElementLayerLabelComponent;

export const dependency = new LayerLabelComponentFactoryDependency("element", ElementLayerLabelComponent);