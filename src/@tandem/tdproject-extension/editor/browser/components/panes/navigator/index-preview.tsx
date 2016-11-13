import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { DirectoryModel, FileModel } from "@tandem/editor/common/models";
import { GutterComponent } from "@tandem/editor/browser/components";
import { TreeNode } from "@tandem/common";
import { NavigatorPaneComponent } from "./index";



export const renderPreview = reactEditorPreview(() => {
  const directory = new DirectoryModel("src");

  const components = new FileModel("components");
  components.appendChild(new FileModel("test.tsx"));

  const models = new DirectoryModel("models");
  models.appendChild(new FileModel("workspace.ts"));
  models.appendChild(new FileModel("address.ts"));

  directory.appendChild(components);
  directory.appendChild(models);

  return <GutterComponent>
    <NavigatorPaneComponent workspace={{ selection: [] } as any} store={{ cwd: directory  } as any} />
  </GutterComponent>
});

