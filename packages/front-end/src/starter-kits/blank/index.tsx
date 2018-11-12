import * as React from "react";
import { ProjectTemplate, ProjectFileCreator } from "../../state";
import {
  createPCModule,
  createPCComponent,
  createPCTextNode,
  PCVisibleNodeMetadataKey
} from "paperclip";
import { createBounds } from "tandem-common";

export const template: ProjectTemplate = {
  id: "blank",
  icon: null,
  label: "Blank"
};

export type BlankProjectOptions = {};

export const createFiles: ProjectFileCreator = ({  }: BlankProjectOptions) => {
  const mainComponent = createPCComponent(
    "Application",
    null,
    null,
    null,
    [createPCTextNode("App content")],
    {
      [PCVisibleNodeMetadataKey.BOUNDS]: createBounds(0, 600, 0, 400)
    }
  );

  return {
    "./src/main.pc": JSON.stringify(createPCModule([mainComponent]), null, 2)
  };
};
