import { IApplication } from "@tandem/common/application";
import { CSS_MIME_TYPE, HTML_MIME_TYPE } from "@tandem/common";
import { SyntheticDOMElementClassDependency, HTML_XMLNS, MarkupMimeTypeXMLNSDependency } from "@tandem/synthetic-browser";

import { 
  SyntheticHTMLLink,
  SyntheticHTMLScript,
  SyntheticHTMLStyle,
} from "./synthetic";

// key bindings
import { MimeTypeDependency } from "@tandem/common/dependencies";

export function createHTMLCoreDependencies() {
  return [

    // TODO - move these to either sandbox/ or synthetic/ directories
    new SyntheticDOMElementClassDependency(HTML_XMLNS, "link", SyntheticHTMLLink),
    new SyntheticDOMElementClassDependency(HTML_XMLNS, "script", SyntheticHTMLScript),
    new SyntheticDOMElementClassDependency(HTML_XMLNS, "style", SyntheticHTMLStyle),

    // TODO - move these to htmlCoreDependencies
    // mime types
    new MimeTypeDependency("css", CSS_MIME_TYPE),
    new MimeTypeDependency("htm", HTML_MIME_TYPE),
    new MimeTypeDependency("html", HTML_MIME_TYPE)
  ];
}

export * from "./actions";
export * from "./constants";
export * from "./synthetic";
export * from "./sandbox";