import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS } from "./constants";
import { MimeTypeProvider, HTML_MIME_TYPE, MimeTypeAliasProvider } from "@tandem/common";

import {
  SyntheticTDRootElement,
  SyntheticTDRulerElement,
  SyntheticTDRulerLineElement,
  SyntheticTDArtboardElement,
  SyntheticTDTemplateElement,
} from "./synthetic";

import {
  HTML_XMLNS,
  MarkupEditor,
  SyntheticHTMLElement,
  MarkupMimeTypeXMLNSProvider,
  SyntheticDOMElementClassProvider,
} from "@tandem/synthetic-browser";

import {
  SyntheticHTMLLink,
  SyntheticHTMLStyle,
  SyntheticHTMLScript,
} from "@tandem/html-extension";

export function createTDProjectCoreProviders() {
  return [

    // elements
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "template", SyntheticTDTemplateElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "tandem", SyntheticTDRootElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "ruler", SyntheticTDRulerElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "ruler-line", SyntheticTDRulerLineElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "artboard", SyntheticTDArtboardElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "link", SyntheticHTMLLink),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "default", SyntheticHTMLElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "script", SyntheticHTMLScript),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "style", SyntheticHTMLStyle),

    // mime types
    new MimeTypeAliasProvider(TDPROJECT_MIME_TYPE, HTML_MIME_TYPE),
    new MimeTypeProvider("tdm", TDPROJECT_MIME_TYPE),
    new MimeTypeProvider("tandem", TDPROJECT_MIME_TYPE),

    // xml namespaces
    new MarkupMimeTypeXMLNSProvider(TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS),

    // editors
    new ContentEditorFactoryProvider(TDPROJECT_MIME_TYPE, MarkupEditor, true),
  ];
}