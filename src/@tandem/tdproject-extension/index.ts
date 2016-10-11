import { TDFrameStageToolComponent } from "./components";
import { ReactComponentFactoryDependency } from "@tandem/editor";
import { MimeTypeDependency, HTML_MIME_TYPE } from "@tandem/common";
import { TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS } from "./constants";

import {
  SyntheticTDFrameEntity,
  SyntheticTDProject,
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

import { SyntheticVisibleHTMLEntity, SyntheticHTMLStyleEntity, SyntheticHTMLLinkEntity } from "@tandem/html-extension";

export const tdprojectExtensionDependencies = [

  // stage tool components
  new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDFrameStageToolComponent),

  // elements
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "default", SyntheticHTMLElement),

  // components
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "frame", SyntheticTDFrameEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "default", SyntheticVisibleHTMLEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "tdproject", SyntheticTDProject),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "style", SyntheticHTMLStyleEntity),
  new SyntheticDOMNodeEntityClassDependency(TDPROJECT_XMLNS, "link", SyntheticHTMLLinkEntity),

  // sandbox
  new SandboxModuleFactoryDependency(HTML_MIME_TYPE, TDPROJECT_MIME_TYPE, MarkupModule),

  // mime types
  new MimeTypeDependency("tdproject", TDPROJECT_MIME_TYPE),

  // xml namespaces
  new MarkupMimeTypeXMLNSDependency(TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS)
];