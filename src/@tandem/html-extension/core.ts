import { CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";
import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import {
  HTML_XMLNS,
  CSSEditor,
  SVG_XMLNS,
  SVG_TAG_NAMES,
  HTML_TAG_NAMES,
  SyntheticHTMLElement,
  MarkupMimeTypeXMLNSProvider,
  SyntheticDOMElementClassProvider,
} from "@tandem/synthetic-browser";


import { 
  SyntheticHTMLLink,
  SyntheticHTMLScript,
  SyntheticHTMLStyle,
} from "./synthetic";

// key bindings
import { MimeTypeProvider } from "@tandem/common";

export function createHTMLCoreProviders() {
  return [

    ...HTML_TAG_NAMES.map((tagName) => new SyntheticDOMElementClassProvider(HTML_XMLNS, tagName, SyntheticHTMLElement)),
    ...SVG_TAG_NAMES.map((tagName) => new SyntheticDOMElementClassProvider(SVG_XMLNS, tagName, SyntheticHTMLElement)),

    // new SyntheticDOMElementClassProvider(HTML_XMLNS, "canvas", SyntheticHTMLCanvas),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "link", SyntheticHTMLLink),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "script", SyntheticHTMLScript),
    new SyntheticDOMElementClassProvider(HTML_XMLNS, "style", SyntheticHTMLStyle),

    // TODO - move these to htmlCoreProviders
    // mime types
    new MimeTypeProvider("css", CSS_MIME_TYPE),
    new MimeTypeProvider("htm", HTML_MIME_TYPE),
    new MimeTypeProvider("html", HTML_MIME_TYPE)
  ];
}

export * from "./messages";
export * from "./constants";
export * from "./synthetic";
export * from "./sandbox";