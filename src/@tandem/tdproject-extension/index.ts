import { MimeTypes, TDPROJECT_XMLNS } from "./constants";
import { ReactComponentFactoryDependency } from "@tandem/editor";
import { MimeTypeDependency, MimeTypes as CommonMimeTypes } from "@tandem/common";

import {
  TDFrameStageToolComponent
} from "./components";

import {
  SyntheticTDFrame,
  SyntheticTDProject,
} from "./synthetic";

import { ModuleFactoryDependency } from "@tandem/sandbox";

import {
  MarkupModule,
  SyntheticDOMElement,
  SyntheticDOMElementClassDependency,
} from "@tandem/synthetic-browser";

export const tdprojectExtensionDependencies = [

  // stage tool components
  new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDFrameStageToolComponent),

  // elements
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "tdproject", SyntheticTDProject),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "default", SyntheticDOMElement),
  new SyntheticDOMElementClassDependency(TDPROJECT_XMLNS, "frame", SyntheticTDFrame),

  // sandbox
  new ModuleFactoryDependency(CommonMimeTypes.HTML, MimeTypes.TDPROJECT, MarkupModule),

  // mime types
  new MimeTypeDependency("tdproject", MimeTypes.TDPROJECT)
];