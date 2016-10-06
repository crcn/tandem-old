import { MimeTypeDependency, MimeTypes as CommonMimeTypes } from "@tandem/common";
import { MimeTypes, TDPROJECT_XMLNS } from "./constants";

import {
  SyntheticTDFrame,
  SyntheticTDProject,
} from "./synthetic";

import { ModuleFactoryDependency } from "@tandem/sandbox";
import { MarkupModule, SyntheticMarkupElementClassDependency, SyntheticMarkupElement } from "@tandem/synthetic-browser";

export const tdprojectExtensionDependencies = [

  // elements
  new SyntheticMarkupElementClassDependency(TDPROJECT_XMLNS, "tdproject", SyntheticTDProject),
  new SyntheticMarkupElementClassDependency(TDPROJECT_XMLNS, "default", SyntheticMarkupElement),
  new SyntheticMarkupElementClassDependency(TDPROJECT_XMLNS, "frame", SyntheticTDFrame),

  // sandbox
  new ModuleFactoryDependency(CommonMimeTypes.HTML, MimeTypes.TDPROJECT, MarkupModule),

  // mime types
  new MimeTypeDependency("tdproject", MimeTypes.TDPROJECT)
];