import { TDArtboardStageToolComponent } from "./components";
import { ReactComponentFactoryDependency } from "@tandem/editor";
import { MimeTypeDependency, HTML_MIME_TYPE } from "@tandem/common";
import { TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS } from "./constants";

import {
  TDArtboardEntity,
  SyntheticTDRepeatElement,
  SyntheticTDTemplateElement,
} from "./synthetic";

import { SandboxModuleFactoryDependency, BundlerLoaderFactoryDependency } from "@tandem/sandbox";

import {
  HTML_XMLNS,
  MarkupModule,
  NoopDOMENtity,
  SyntheticHTMLElement,
  DefaultSyntheticDOMEntity,
  MarkupMimeTypeXMLNSDependency,
  SyntheticDOMElementClassDependency,
  SyntheticDOMNodeEntityClassDependency,
} from "@tandem/synthetic-browser";

import {
  VisibleHTMLEntity,
  SyntheticHTMLLink,
  SyntheticHTMLScript,
  HTMLBundleLoader,
  SyntheticHTMLStyle,
} from "@tandem/html-extension";

export const tdprojectExtensionDependencies = [

  // stage tool components
  new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),

  // elements
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "template", SyntheticTDTemplateElement),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "dom-repeat", SyntheticTDRepeatElement),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "link", SyntheticHTMLLink),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "default", SyntheticHTMLElement),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "script", SyntheticHTMLScript),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "style", SyntheticHTMLStyle),

  // components
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "artboard", TDArtboardEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "default", VisibleHTMLEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "script", NoopDOMENtity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "link", NoopDOMENtity),

  // sandbox
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, TDPROJECT_MIME_TYPE, MarkupModule),

  // sandbox loaders
  new BundlerLoaderFactoryDependency(TDPROJECT_MIME_TYPE, HTMLBundleLoader),

  // mime types
  new MimeTypeDependency("tdproject", TDPROJECT_MIME_TYPE),
  new MimeTypeDependency("tdm", TDPROJECT_MIME_TYPE),

  // xml namespaces
  new MarkupMimeTypeXMLNSDependency(TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS)
];