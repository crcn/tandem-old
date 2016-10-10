import { TDFrameStageToolComponent } from "./components";
import { ReactComponentFactoryDependency } from "@tandem/editor";
import { MimeTypeDependency, HTML_MIME_TYPE } from "@tandem/common";
import { TDPROJECT_MIME_TYPE, TDPROJECT_XMLNS } from "./constants";

import {
  SyntheticTDFrame,
  SyntheticTDProject,
} from "./synthetic";

import { ModuleFactoryDependency } from "@tandem/sandbox";

import {
  HTML_XMLNS,
  MarkupModule,
  SyntheticHTMLElement,
  DefaultSyntheticComponent,
  SyntheticDOMElementClassDependency,
  SyntheticDOMNodeComponentClassDependency,
} from "@tandem/synthetic-browser";

export const tdprojectExtensionDependencies = [

  // stage tool components
  new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDFrameStageToolComponent),

  // elements
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "default", SyntheticHTMLElement),

  // components
  new SyntheticDOMNodeComponentClassDependency(TDPROJECT_XMLNS, "frame", SyntheticTDFrame),
  new SyntheticDOMNodeComponentClassDependency(TDPROJECT_XMLNS, "default", DefaultSyntheticComponent),
  new SyntheticDOMNodeComponentClassDependency(TDPROJECT_XMLNS, "tdproject", SyntheticTDProject),

  // sandbox
  new ModuleFactoryDependency(HTML_MIME_TYPE, TDPROJECT_MIME_TYPE, MarkupModule),

  // mime types
  new MimeTypeDependency("tdproject", TDPROJECT_MIME_TYPE)
];