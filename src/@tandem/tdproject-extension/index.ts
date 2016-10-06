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
  SyntheticMarkupElement,
  SyntheticMarkupElementClassDependency,
} from "@tandem/synthetic-browser";

export const tdprojectExtensionDependencies = [

  // stage tool components
  new ReactComponentFactoryDependency("components/tools/pointer/tdprojectFrame", TDFrameStageToolComponent),

  // elements
  new SyntheticMarkupElementClassDependency(TDPROJECT_XMLNS, "tdproject", SyntheticTDProject),
  new SyntheticMarkupElementClassDependency(TDPROJECT_XMLNS, "default", SyntheticMarkupElement),
  new SyntheticMarkupElementClassDependency(TDPROJECT_XMLNS, "frame", SyntheticTDFrame),

  // sandbox
  new ModuleFactoryDependency(CommonMimeTypes.HTML, MimeTypes.TDPROJECT, MarkupModule),

  // mime types
  new MimeTypeDependency("tdproject", MimeTypes.TDPROJECT)
];