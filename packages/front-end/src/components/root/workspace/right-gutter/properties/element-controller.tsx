import * as React from "react";
import {
  PCSourceTagNames,
  SyntheticVisibleNode,
  SyntheticElement
} from "paperclip";
import { elementTypeChanged } from "../../../../../actions";
import { DropdownMenuOption } from "../../../../inputs/dropdown/controller";
import { BaseElementPropertiesProps } from "./view.pc";
import { Dispatch } from "redux";
import { InputProperties } from "./input.pc";

const TYPE_MENU_OPTIONS: DropdownMenuOption[] = [
  "a",
  "abbr",
  "acronym",
  "address",
  "b",
  "base",
  "blockquote",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
].map(value => ({ label: value, value }));

export type Props = {
  dispatch: Dispatch<any>;
  selectedNodes: SyntheticElement[];
} & BaseElementPropertiesProps;

export default (Base: React.ComponentClass<BaseElementPropertiesProps>) => {
  return class ElementController extends React.PureComponent<Props> {
    onTypeChange = (value: any) => {
      this.props.dispatch(elementTypeChanged(value));
    };
    render() {
      const { onTypeChange } = this;
      const { selectedNodes, dispatch, ...rest } = this.props;
      if (!selectedNodes.length) {
        return null;
      }

      const element = selectedNodes.find(
        (node: SyntheticVisibleNode) => node.name !== PCSourceTagNames.TEXT
      ) as SyntheticElement;

      if (!element) {
        return null;
      }

      let fieldChild;
      if (element.name === "input") {
        fieldChild = (
          <InputProperties dispatch={dispatch} selectedNodes={selectedNodes} />
        );
      }

      return (
        <Base
          {...rest}
          fieldsProps={{ children: fieldChild || [] }}
          typeInputProps={{
            value: element.name,
            options: TYPE_MENU_OPTIONS,
            onChange: onTypeChange
          }}
        />
      );
    }
  };
};
