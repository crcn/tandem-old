import * as React from "react";
import { compose, pure, withHandlers } from "recompose";
import {
  PCSourceTagNames,
  SyntheticVisibleNode,
  SyntheticElement
} from "paperclip";
import { elementTypeChanged } from "actions";
import { DropdownMenuItem } from "../../../../inputs/dropdown/controller";
const { InputProperties } = require("./input.pc");

const TYPE_MENU_OPTIONS: DropdownMenuItem[] = [
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

export default compose(
  pure,
  withHandlers({
    onTypeChange: ({ dispatch }) => (value: string) => {
      dispatch(elementTypeChanged(value));
    }
  }),
  Base => ({ onTypeChange, selectedNodes, onTextValueKeyDown, dispatch }) => {
    const element = selectedNodes.find(
      (node: SyntheticVisibleNode) => node.name !== PCSourceTagNames.TEXT
    ) as SyntheticElement;

    let fieldChild;
    if (element.name === "input") {
      fieldChild = (
        <InputProperties dispatch={dispatch} selectedNodes={selectedNodes} />
      );
    }

    return (
      <Base
        fieldsProps={{ children: fieldChild || [] }}
        typeInputProps={{
          value: element.name,
          options: TYPE_MENU_OPTIONS,
          onChange: onTypeChange
        }}
      />
    );
  }
);
