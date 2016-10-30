import { IApplication } from "@tandem/common/application";
import { CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";
import { SyntheticDOMElementClassProvider, HTML_XMLNS, MarkupMimeTypeXMLNSProvider } from "@tandem/synthetic-browser";

import { 
  SyntheticHTMLLink,
  SyntheticHTMLScript,
  SyntheticHTMLStyle,
} from "./synthetic";

// key bindings
import { MimeTypeProvider } from "@tandem/common";

export function createHTMLCoreProviders() {
  return [

    // TODO - move these to either sandbox/ or synthetic/ directories
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

export * from "./actions";
export * from "./constants";
export * from "./synthetic";
export * from "./sandbox";