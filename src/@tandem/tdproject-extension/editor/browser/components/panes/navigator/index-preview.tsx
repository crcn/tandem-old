import * as React from "react";
import { reactEditorPreview } from "@tandem/editor/browser/preview";
import { GutterComponent } from "@tandem/editor/browser/components";
import { TreeNode } from "@tandem/common";
import { NavigatorPaneComponent } from "./index";

class File extends TreeNode<File> {
  constructor(readonly name) {
    super();
  }
}

class Directory extends TreeNode<Directory|File> {
  constructor(readonly name, children: TreeNode<any>[] = []) {
    super();
    for (const child of children) {
      this.appendChild(child as any);
    }
  }
}

export const renderPreview = reactEditorPreview(() => {
  const directory = new Directory(
    "src",
    [
      new Directory("components", [
        new File("component.tsx"),
        new File("button.tsx")
      ]),
      new Directory("models", [
        new File("workspace.ts")
      ])
    ]
  );

  return <GutterComponent>
    <NavigatorPaneComponent file={directory} />
  </GutterComponent>
});

