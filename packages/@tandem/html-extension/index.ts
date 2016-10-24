import { IApplication } from "@tandem/common/application";
import { CSS_MIME_TYPE, HTML_MIME_TYPE, JS_MIME_TYPE } from "@tandem/common";

import {
  CSSEditor,
  HTML_XMLNS,
  MarkupEditor,
  SyntheticDOMElementClassDependency,
} from "@tandem/synthetic-browser";

import { 
  SyntheticHTMLLink,
  SyntheticHTMLScript,
  SyntheticHTMLStyle,
} from "./synthetic";

import {
  HTML_TAG_NAMES,
  SyntheticDOMText,
  SyntheticDOMElement,
  SyntheticDOMComment,
  SyntheticHTMLElement,
} from "@tandem/synthetic-browser";

// layer components
import { htmlEditorDependencies } from "./editor";
import { htmlSandboxDependencies } from "./sandbox";

// key bindings
import { MimeTypeDependency } from "@tandem/common/dependencies";

export const htmlExtensionDependencies = [

  ...htmlEditorDependencies,
  ...htmlSandboxDependencies,

  // TODO - move these to either sandbox/ or synthetic/ directories
  new SyntheticDOMElementClassDependency(HTML_MIME_TYPE, "link", SyntheticHTMLLink),
  new SyntheticDOMElementClassDependency(HTML_MIME_TYPE, "script", SyntheticHTMLScript),
  new SyntheticDOMElementClassDependency(HTML_MIME_TYPE, "style", SyntheticHTMLStyle),

  // TODO - move these to htmlCoreDependencies
  // mime types
  new MimeTypeDependency("css", CSS_MIME_TYPE),
  new MimeTypeDependency("htm", HTML_MIME_TYPE),
  new MimeTypeDependency("html", HTML_MIME_TYPE)
];

export * from "./editor";
export * from "./actions";
export * from "./constants";
export * from "./synthetic";
export * from "./sandbox";