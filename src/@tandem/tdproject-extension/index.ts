import { TDArtboardStageToolComponent } from "./components";
import { ReactComponentFactoryDependency } from "@tandem/editor";
import { MimeTypeDependency, HTML_MIME_TYPE } from "@tandem/common";
import { TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS } from "./constants";

import {
  TDArtboardEntity,
  TDProjectEntity,
} from "./synthetic";

import { SandboxModuleFactoryDependency } from "@tandem/sandbox";

import {
  HTML_XMLNS,
  MarkupModule,
  SyntheticHTMLElement,
  DefaultSyntheticDOMEntity,
  MarkupMimeTypeXMLNSDependency,
  SyntheticDOMElementClassDependency,
  SyntheticDOMNodeEntityClassDependency,
} from "@tandem/synthetic-browser";

import {
  HTMLLinkEntity,
  HTMLStyleEntity,
  HTMLScriptEntity,
  VisibleHTMLEntity,
} from "@tandem/html-extension";

export const tdprojectExtensionDependencies = [

  // stage tool components
  new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDArtboardStageToolComponent),

  // elements
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "default", SyntheticHTMLElement),

  // components
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "artboard", TDArtboardEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "default", VisibleHTMLEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "tdproject", TDProjectEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "style", HTMLStyleEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "link", HTMLLinkEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "script", HTMLScriptEntity),

  // sandbox
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, TDPROJECT_MIME_TYPE, MarkupModule),

  // mime types
  new MimeTypeDependency("tdproject", TDPROJECT_MIME_TYPE),

  // xml namespaces
  new MarkupMimeTypeXMLNSDependency(TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS)
];