import { ContentEditorFactoryProvider } from "@tandem/sandbox";
import { TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS } from "./constants";
import { MimeTypeProvider, HTML_MIME_TYPE, MimeTypeAliasProvider } from "@tandem/common";

import {
  SyntheticTDRootElement,
  SyntheticTDRulerElement,
  SyntheticTDRulerLineElement,
  SyntheticRemoteBrowserElement,
  SyntheticTDTemplateElement,
} from "./synthetic";

import {
  HTML_XMLNS,
  MarkupEditor,
  SyntheticHTMLLinkElement,
  SyntheticHTMLStyleElement,
  SyntheticHTMLScriptElement,
  SyntheticHTMLElement,
  MarkupMimeTypeXMLNSProvider,
  SyntheticDOMElementClassProvider,
} from "@tandem/synthetic-browser";

export function createTDProjectCoreProviders() {
  return [

    // elements
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "template", SyntheticTDTemplateElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "tandem", SyntheticTDRootElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "ruler", SyntheticTDRulerElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "ruler-line", SyntheticTDRulerLineElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "remote-browser", SyntheticRemoteBrowserElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "link", SyntheticHTMLLinkElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "default", SyntheticHTMLElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "script", SyntheticHTMLScriptElement),
    new SyntheticDOMElementClassProvider(TDPROJECT_XMLNS, "style", SyntheticHTMLStyleElement),

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