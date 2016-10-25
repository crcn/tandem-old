import { TandemBundleLoader } from "./sandbox";
import { TDArtboardStageToolComponent } from "./components";
import { ReactComponentFactoryDependency } from "@tandem/editor";
import { TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS } from "./constants";
import { MimeTypeDependency, HTML_MIME_TYPE, MimeTypeAliasDependency } from "@tandem/common";
import { BundlerLoaderFactoryDependency, ContentEditorFactoryDependency } from "@tandem/sandbox";

import {
  SyntheticTDRepeatElement,
  SyntheticTDArtboardElement,
  SyntheticTDTemplateElement,
} from "./synthetic";

import {
  HTML_XMLNS,
  MarkupEditor,
  SyntheticHTMLElement,
  MarkupMimeTypeXMLNSDependency,
  SyntheticDOMElementClassDependency,
} from "@tandem/synthetic-browser";

import {
  HTMLBundleLoader,
  SyntheticHTMLLink,
  SyntheticHTMLStyle,
  SyntheticHTMLScript,
} from "@tandem/html-extension";

export const tdprojectExtensionDependencies = [

  // stage tool components
  new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),

  // elements
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "template", SyntheticTDTemplateElement),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "dom-repeat", SyntheticTDRepeatElement),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "artboard", SyntheticTDArtboardElement),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "link", SyntheticHTMLLink),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "default", SyntheticHTMLElement),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "script", SyntheticHTMLScript),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "style", SyntheticHTMLStyle),

  // mime types
  new MimeTypeAliasDependency(TDPROJECT_MIME_TYPE, HTML_MIME_TYPE),
  new MimeTypeDependency("tdproject", TDPROJECT_MIME_TYPE),
  new MimeTypeDependency("tdm", TDPROJECT_MIME_TYPE),

  // xml namespaces
  new MarkupMimeTypeXMLNSDependency(TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS),

  // editors
  new ContentEditorFactoryDependency(TDPROJECT_MIME_TYPE, MarkupEditor),
];