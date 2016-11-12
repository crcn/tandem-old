import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { Directory, File } from "@tandem/editor/common/models";
import { GutterComponent } from "@tandem/editor/browser/components";
import { TreeNode } from "@tandem/common";
import { NavigatorPaneComponent } from "./index";



export const renderPreview = reactEditorPreview(() => {
  const directory = new Directory("src");

  const components = new Directory("components");
  components.appendChild(new File("test.tsx"));

  const models = new Directory("models");
  models.appendChild(new File("workspace.ts"));
  models.appendChild(new File("address.ts"));

  directory.appendChild(components);
  directory.appendChild(models);

  return <GutterComponent>
    <NavigatorPaneComponent workspace={{} as any} store={{ cwd: directory  } as any} />
  </GutterComponent>
});

